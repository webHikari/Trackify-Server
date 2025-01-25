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
        query("UPDATE time_on_page SET end_time = $1 WHERE id = $2", [
            endTime,
            id,
        ]);
    }

    async getStatistics() {
        // Статистика по дням недели
        const weekdayStats = await query(`
            SELECT 
                EXTRACT(DOW FROM TO_TIMESTAMP(start_time / 1000)) as weekday,
                COUNT(*) as visits
            FROM time_on_page 
            GROUP BY weekday 
            ORDER BY weekday
        `).then((res) => res.rows);

        const hourlyStats = await query(`
            SELECT 
                EXTRACT(HOUR FROM TO_TIMESTAMP(start_time / 1000)) as hour,
                COUNT(*) as visits
            FROM time_on_page 
            GROUP BY hour 
            ORDER BY hour
        `).then((res) => res.rows);

        // Статистика по дням (временная линия)
        const timelineStats = await query(`
            SELECT 
                DATE(TO_TIMESTAMP(start_time / 1000)) as date,
                COUNT(*) as visits
            FROM time_on_page 
            GROUP BY date 
            ORDER BY date
        `).then((res) => res.rows);

        // Топ посещаемых страниц
        const topPages = await query(`
            SELECT 
                url,
                COUNT(*) as visits,
                AVG(end_time - start_time) as avg_time
            FROM time_on_page 
            GROUP BY url 
            ORDER BY visits DESC 
            LIMIT 10
        `).then((res) => res.rows);

        return {
            weekdayActivity: weekdayStats,
            hourlyActivity: hourlyStats,
            timeline: timelineStats,
            topPages: topPages,
        };
    }
}

export default new EventStorageService();
