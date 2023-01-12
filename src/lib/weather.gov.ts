import dayjs from "dayjs";

import type { Alert } from "./types/alert";
import type { Forecast } from "./types/forecast";
import { sleep } from "./util/sleep";

const init: RequestInit = {
    headers: {
        "User-Agent": "(weather.naturecodevoid.dev, https://github.com/naturecodevoid/weather.naturecodevoid.dev)",
    },
};

async function getValFromWeatherAPI<T>(url: string, getVal: (obj: any) => any) {
    for (let i = 0; i < 5; i++) {
        try {
            const request = await fetch(url, init);
            const json = await request.json();
            if (request.status != 200) throw json.detail;
            return getVal(json) as T;
        } catch (err) {
            if (i < 4) {
                await sleep(1000);
                continue;
            } else throw `An error occurred: ${err}`;
        }
    }
    throw "An error occurred: Unknown error. Please try again.";
}

export async function getData(latLon: string) {
    if (!latLon || latLon.split(",").length != 2 || typeof Number.parseFloat(latLon.split(",")[0]) != "number" || typeof Number.parseFloat(latLon.split(",")[1]) != "number")
        throw "Please go into Settings (bottom right) and enter the location you want to receive weather about!";
    const request = await fetch(`https://api.weather.gov/points/${latLon}`, init);
    const points = await request.json();
    if (request.status != 200) throw `An error occurred: ${points.detail}.${points.title.toLowerCase().includes("not found") ? " The latitude and longitude may not be formatted correctly." : ""}`;

    const dailyForecast = await getValFromWeatherAPI<Forecast[]>(points.properties.forecast, (obj) => obj.properties.periods);
    const hourlyForecast = await getValFromWeatherAPI<Forecast[]>(points.properties.forecastHourly, (obj) => obj.properties.periods);
    // in my very small amount of testing county seems to be more accurate than forecast zone, but feel free to tell me if this is not the case
    const alerts = (await getValFromWeatherAPI<any[]>(`https://api.weather.gov/alerts/active/zone/${points.properties.county.split("/").at(-1)}`, (obj) => obj.features))
        .map<Alert>((val, i, arr) => (arr[i] = val.properties))
        .filter((val) => val.affectedZones.includes(points.properties.forecastZone) && val.status == "Actual");
    navigator.clipboard.writeText(JSON.stringify(alerts, null, "    "));

    return { dailyForecast, hourlyForecast, alerts };
}

export function getHourlyForecastsBetweenStartAndEndTime(hourlyForecasts: Forecast[], startTime: dayjs.Dayjs, endTime: dayjs.Dayjs) {
    const forecastsBetweenStartAndEndTime: Forecast[] = [];

    for (const forecast of hourlyForecasts) {
        const forecastStartTime = dayjs(forecast.startTime);
        const forecastEndTime = dayjs(forecast.endTime);
        if ((forecastStartTime.isAfter(startTime) || forecastStartTime.isSame(startTime)) && (forecastEndTime.isBefore(endTime) || forecastEndTime.isSame(endTime)))
            forecastsBetweenStartAndEndTime.push(forecast);
    }

    return forecastsBetweenStartAndEndTime;
}
