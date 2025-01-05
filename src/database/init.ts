import { query } from "./db";

const createTables = async () => {
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
};

createTables();
