// core
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

// controllers
import EventStorageController from "./controllers/EventStorage.controller";

// types
import { IEvents } from "./model/events";

const app = new Elysia();

// routing
app.get("/", () => "Hello Elysia");
app.post("/", ({ body }: { body: IEvents }) =>
    EventStorageController.saveEvents(body),
);

// cors settings
app.use(
    cors({
        origin: "http://localhost:5173",
    }),
);

app.listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
