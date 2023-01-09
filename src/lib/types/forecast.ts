// TODO: update to https://www.weather.gov/documentation/services-web-api?prevfmt=application%2Fcap%2Bxml&prevopt=zone%3DCAC103#/default/zone_forecast GridpointForecastPoint
// TODO: don't use deprecated values (temperatureUnit)

/** some values not present in hourly forecasts */
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
