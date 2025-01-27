import { query } from "../database/db";
import { IEvents, ITimeOnPage } from "../model/events";
import EventStorageService from "../service/EventStorage.service";

class EventStorageController {
    // handle data-saving request
    async saveEvents(body: IEvents) {
        // 1. desctructure incoming data
        const { mousemoveEvents, scrollEvents, clickEvents } = body;

        // 2. check for emptiness, if so then just return 403
        const missingCredentials =
            !mousemoveEvents?.length &&
            !scrollEvents?.length &&
            !clickEvents?.length;

        if (missingCredentials) {
            return {
                status: 403,
                body: { error: "No events to save" },
            };
        }

        // 3. try to save
        await EventStorageService.saveClickEvents(clickEvents);
        await EventStorageService.saveScrollEvents(scrollEvents);
        await EventStorageService.saveMousemoveEvents(mousemoveEvents);

        return {
            status: 200,
            body: { message: "Events saved successfully" },
        };
    }

    async saveTimeOnPage(body: string) {
        const parsedData: ITimeOnPage = JSON.parse(body);
        const { userId, url, startTime, endTime } = parsedData;
        console.log(userId, url, startTime, endTime);

        const missingCredentials = !userId || !url || !startTime || !endTime;
        if (missingCredentials)
            return {
                status: 403,
                body: { error: "Missing Credentials" },
            };

        const currentRecord = await EventStorageService.getLastRecord(userId);

        if (!currentRecord)
            await EventStorageService.insertRecord(
                userId,
                url,
                startTime,
                endTime
            );

        console.log(currentRecord);

        const sameSite =
            currentRecord?.url === url &&
            currentRecord.start_time === String(startTime);

        if (sameSite)
            await EventStorageService.updateEndTime(currentRecord.id, endTime);

        if (currentRecord?.url !== url)
            await EventStorageService.insertRecord(
                userId,
                url,
                startTime,
                endTime
            );

        return {
            status: 200,
            body: { message: "Success" },
        };
    }

    async getStatistics() {
        try {
            const statistics = await EventStorageService.getStatistics();
            return {
                status: 200,
                statistics,
            };
        } catch (error) {
            return {
                status: 500,
                body: { error: "Ошибка при получении статистики" },
            };
        }
    }
	
	async saveGeoByIp(ip: string) {
		// local shit
		if (ip.startsWith("::ffff:")) {
			ip = ip.replace("::ffff:", "");
			return;
		}

		const savedGeo = await query(
			`SELECT * FROM geo_visits WHERE user_ip = $1`,
			[ip]
		).then((res) => res.rows[0])

		if (savedGeo) return;

		const response = await fetch(`http://ip-api.com/json/${ip}`);
		const geoData = await response.json();
	
		// do smth with geo, store maybe drink it, wip


		console.log("GEODATA: ", geoData)

	}
}

export default new EventStorageController();
