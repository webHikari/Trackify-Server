import { Pool } from "pg";

const pool = new Pool({
	connectionString: "postgres://postgres:root@db:5432/postgres",
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
