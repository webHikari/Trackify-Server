// core
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

// controllers
import EventStorageController from "./controllers/EventStorage.controller";

// types
import { IEvents, ITimeOnPage } from "./model/events";

// database init
import { createTables } from "./database/init";
createTables();

const app = new Elysia();

// routing
app.post("/", ({ body }: { body: IEvents }) =>
    EventStorageController.saveEvents(body)
);

app.post("/time", ({ body }: { body: string }) =>
    EventStorageController.saveTimeOnPage(body)
);

app.get("/statistics", () => EventStorageController.getStatistics());

// cors settings
app.use(
    cors({
        origin: "http://localhost:5173",
    })
);

app.listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
