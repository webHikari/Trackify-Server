// core
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { ip } from "elysia-ip";

// controllers
import EventStorageController from "./controllers/EventStorage.controller";

// types
import { IEvents, ITimeOnPage } from "./model/events";

// database init
import { createTables } from "./database/init";
createTables();

const app = new Elysia();

// app settings
app.use(ip())

app.use(
    cors({
        origin: "http://localhost:5173",
    })
);

// routing
app.post("/", ({ body }: { body: IEvents }) =>
    EventStorageController.saveEvents(body)
);

app.post("/time", ({ body, ip }: { body: string; ip: string }) => {
    EventStorageController.saveGeoByIp(ip);
    EventStorageController.saveTimeOnPage(body);
});

app.get("/statistics", () => EventStorageController.getStatistics());


app.listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
