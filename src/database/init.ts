import { query } from "./db";
import { seedDatabase } from "./seed";

export const createTables = async () => {
    try {
        await query(`
			CREATE TABLE IF NOT EXISTS mousemove_events (
				id SERIAL PRIMARY KEY,
				x INTEGER NOT NULL,
				y INTEGER NOT NULL,
				timestamp BIGINT NOT NULL
			);
		`);
        console.log("Table created or already exists");
    } catch (err) {
        console.error("Error creating table:", err);
    }

    try {
        await query(`
			CREATE TABLE IF NOT EXISTS click_events (
				id SERIAL PRIMARY KEY,
				x INTEGER NOT NULL,
				y INTEGER NOT NULL,
				timestamp BIGINT NOT NULL
			);
		`);
        console.log("Table created or already exists");
    } catch (err) {
        console.error("Error creating table:", err);
    }

    try {
        await query(`
			CREATE TABLE IF NOT EXISTS scroll_events (
				id SERIAL PRIMARY KEY,
				scrollY INTEGER NOT NULL,
				timestamp BIGINT NOT NULL
			);
		`);
        console.log("Table created or already exists");
    } catch (err) {
        console.error("Error creating table:", err);
    }

    try {
        await query(`
			CREATE TABLE IF NOT EXISTS time_on_page (
				id SERIAL PRIMARY KEY,
				user_id VARCHAR NOT NULL,
				url VARCHAR NOT NULL,
				start_time BIGINT NOT NULL,
				end_time BIGINT NOT NULL
			);
		`);
        console.log("Table created or already exists");
    } catch (err) {
        console.error("Error creating table:", err);
    }

    try {
		for (let i = 0; i < 20; i++) {
			// await seedDatabase();
		}
        console.log("Тестовые данные успешно добавлены");
    } catch (err) {
        console.error("Ошибка при добавлении тестовых данных:", err);
    }
};
