import dayjs from "dayjs";

export interface Forecast {
    name: string;
    startTime: string;
    endTime: string;
    isDaytime: boolean;
    temperature: number;
    temperatureUnit: string;
    windSpeed: string;
    windDirection: string;
    icon: string;
    shortForecast: string;
    detailedForecast: string;
}

const init: RequestInit = {
    headers: {
        "User-Agent": "(weather.naturecodevoid.dev, https://github.com/naturecodevoid/weather.naturecodevoid.dev)",
    },
};

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function getForecast(url: string) {
    for (let i = 0; i < 5; i++) {
        try {
            const request = await fetch(url, init);
            const json = await request.json();
            if (request.status != 200) throw json.detail;
            return json.properties.periods as Forecast[];
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
    const dailyForecast = await getForecast(points.properties.forecast);
    const hourlyForecast = await getForecast(points.properties.forecastHourly);

    return { dailyForecast, hourlyForecast };
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
