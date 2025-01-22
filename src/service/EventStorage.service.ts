import { IMousemoveEvent, IClickEvent, IScrollEvent } from "../model/events";
import { query } from "../database/db";

class EventStorageService {
    async saveScrollEvents(scrollEvents: IScrollEvent[]) {
        for (const { scrollY, timestamp } of scrollEvents) {
            if (!scrollY && !timestamp) continue;

            query(
                "INSERT INTO scroll_events (scrollY, timestamp) VALUES ($1, $2)",
                [scrollY, timestamp]
            );
        }
    }

    async saveMousemoveEvents(mousemoveEvents: IMousemoveEvent[]) {
        for (const { x, y, timestamp } of mousemoveEvents) {
            if (!x && !y && !timestamp) continue;

            query(
                "INSERT INTO mousemove_events (x, y, timestamp) VALUES ($1, $2, $3)",
                [x, y, timestamp]
            );
        }
    }

    async saveClickEvents(clickEvents: IClickEvent[]) {
        for (const { x, y, timestamp } of clickEvents) {
            if (!x && !y && !timestamp) continue;

            query(
                "INSERT INTO click_events (x, y, timestamp) VALUES ($1, $2, $3)",
                [x, y, timestamp]
            );
        }
    }

    async getLastRecord(userId: string) {
        const record: {
            id: number;
            user_id: string;
            url: string;
            start_time: string;
            end_time: string;
        } = await query(
            "SELECT * FROM time_on_page WHERE user_id = $1 ORDER BY id DESC LIMIT 1",
            [userId]
        ).then((res) => res.rows[0]);

        return record;
    }

    async insertRecord(
        userId: string,
        url: string,
        startTime: number,
        endTime: number
    ) {
        query(
            "INSERT INTO time_on_page (user_id, url, start_time, end_time) VALUES ($1, $2, $3, $4)",
            [userId, url, startTime, endTime]
        );
    }

    async updateEndTime(id: number, endTime: number) {
        console.log("update end time");
        query("UPDATE time_on_page SET end_time = $1 WHERE id = $2", [
            endTime,
            id,
        ]);
    }

    async getStatistics() {
        const clickEvents = await query(
            "SELECT DATE_TRUNC('hour', TO_TIMESTAMP(timestamp / 1000)) as hour, COUNT(*) as count FROM click_events GROUP BY hour ORDER BY hour"
        ).then((res) => res.rows);

        const scrollEvents = await query(
            "SELECT DATE_TRUNC('hour', TO_TIMESTAMP(timestamp / 1000)) as hour, COUNT(*) as count FROM scroll_events GROUP BY hour ORDER BY hour"
        ).then((res) => res.rows);

        const mousemoveEvents = await query(
            "SELECT DATE_TRUNC('hour', TO_TIMESTAMP(timestamp / 1000)) as hour, COUNT(*) as count FROM mousemove_events GROUP BY hour ORDER BY hour"
        ).then((res) => res.rows);

        const timeOnPageStats = await query(
            "SELECT url, AVG(end_time - start_time) as avg_time, COUNT(*) as visits FROM time_on_page GROUP BY url"
        ).then((res) => res.rows);

        return {
            eventsByHour: {
                clicks: clickEvents,
                scrolls: scrollEvents,
                mousemoves: mousemoveEvents,
            },
            pageStatistics: timeOnPageStats,
        };
    }
}

export default new EventStorageService();
