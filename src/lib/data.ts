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

export const dayjsFormat = "MM/DD/YYYY h:mm:ss A";
export const dayjsShortFormat = "M/D h A";
export const dayjsVeryShortFormat = "h A";

export async function getData(latLon: string) {
    const points = await (await fetch(`https://api.weather.gov/points/${latLon}`, init)).json();
    if (points.status == 404) throw "Invalid latitude/longitude. You may be outside of the US.";
    const dailyForecast: Forecast[] = (await (await fetch(points.properties.forecast, init)).json()).properties.periods;
    const hourlyForecast: Forecast[] = (await (await fetch(points.properties.forecastHourly, init)).json()).properties.periods;

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
