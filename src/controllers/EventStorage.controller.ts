import { IEvents } from "../model/events";
import EventStorageService from "../service/EventStorage.service" 

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
}

export default new EventStorageController();
