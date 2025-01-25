import { query } from "./db";

const urls = [
    "/home",
    "/about",
    "/products",
    "/contact",
    "/blog",
    "/services",
    "/portfolio",
    "/pricing",
];

const userIds = ["user1", "user2", "user3", "user4", "user5"];

export const seedDatabase = async () => {

    const startDate = new Date("2024-01-01").getTime();
    const endDate = new Date().getTime();

    for (let i = 0; i < 250; i++) {
        const randomUrl = urls[Math.floor(Math.random() * urls.length)];
        const randomUserId =
            userIds[Math.floor(Math.random() * userIds.length)];

        // Округляем временные метки до целых чисел
        const randomStartTime = Math.floor(
            startDate + Math.random() * (endDate - startDate)
        );
        const randomDuration = Math.floor(
            (30 + Math.random() * (30 * 60)) * 1000
        );
        const randomEndTime = randomStartTime + randomDuration;

        await query(
            "INSERT INTO time_on_page (user_id, url, start_time, end_time) VALUES ($1, $2, $3, $4)",
            [randomUserId, randomUrl, randomStartTime, randomEndTime]
        );
    }

    console.log("База данных заполнена тестовыми данными");
};
