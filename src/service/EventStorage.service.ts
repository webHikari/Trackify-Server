import { IMousemoveEvent, IClickEvent, IScrollEvent } from "../model/events";
import { query } from "../database/db";

class EventStorageService {

    async saveScrollEvents(scrollEvents: IScrollEvent[]) {
        for (const { scrollY, timestamp } of scrollEvents) {
			if (!scrollY && !timestamp) continue;
		
            query(
                "INSERT INTO scroll_events (scrollY, timestamp) VALUES ($1, $2)",
                [scrollY, timestamp],
            );
		}
    }

    async saveMousemoveEvents(mousemoveEvents: IMousemoveEvent[]) {
        for (const { x, y, timestamp } of mousemoveEvents) {
            if (!x && !y && !timestamp) continue;

            query(
                "INSERT INTO mousemove_events (x, y, timestamp) VALUES ($1, $2, $3)",
                [x, y, timestamp],
            );
        }
    }

    async saveClickEvents(clickEvents: IClickEvent[]) {
        for (const { x, y, timestamp } of clickEvents) {
            if (!x && !y && !timestamp) continue;

            query(
                "INSERT INTO click_events (x, y, timestamp) VALUES ($1, $2, $3)",
                [x, y, timestamp],
            );
		}
    }

}

export default new EventStorageService();
