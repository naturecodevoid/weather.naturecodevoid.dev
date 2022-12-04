export function linkToIcon(iconLink: string, daytime: boolean) {
    switch (iconLink.replace("https://", "").split("/")[4].split(",")[0].split("?")[0]) {
        case "skc":
            return daytime ? "day-sunny" : "night-clear";
        case "few":
            return daytime ? "day-sunny-overcast" : "night-alt-partly-cloudy";
        case "sct":
            return daytime ? "day-sunny-overcast" : "night-alt-partly-cloudy";
        case "bkn":
            return daytime ? "day-cloudy" : "night-alt-cloudy";
        case "ovc":
            return daytime ? "day-sunny-overcast" : "night-alt-partly-cloudy";
        case "wind_skc":
            return daytime ? "day-light-wind" : "windy";
        case "wind_few":
            return daytime ? "day-cloudy-windy" : "night-alt-cloudy-windy";
        case "wind_sct":
            return daytime ? "day-cloudy-windy" : "night-alt-cloudy-windy";
        case "wind_bkn":
            return daytime ? "day-cloudy-windy" : "night-alt-cloudy-windy";
        case "wind_ovc":
            return daytime ? "day-cloudy-windy" : "night-alt-cloudy-windy";
        case "snow":
            return daytime ? "day-snow" : "night-alt-snow";
        case "rain_snow":
            return daytime ? "day-rain-mix" : "night-alt-rain-mix";
        case "rain_sleet":
            return daytime ? "day-rain-mix" : "night-alt-rain-mix";
        case "snow_sleet":
            return daytime ? "day-sleet" : "night-alt-sleet";
        case "fzra":
            return daytime ? "day-sleet" : "night-alt-sleet";
        case "rain_fzra":
            return daytime ? "day-sleet" : "night-alt-sleet";
        case "snow_fzra":
            return daytime ? "day-snow" : "night-alt-snow";
        case "sleet":
            return daytime ? "day-sleet" : "night-alt-sleet";
        case "rain":
            return daytime ? "day-rain" : "night-alt-rain";
        case "rain_showers":
            return daytime ? "day-rain" : "night-alt-rain";
        case "rain_showers_hi":
            return daytime ? "day-rain" : "night-alt-rain";
        case "tsra":
            return daytime ? "day-thunderstorm" : "night-alt-thunderstorm";
        case "tsra_sct":
            return daytime ? "day-thunderstorm" : "night-alt-thunderstorm";
        case "tsra_hi":
            return daytime ? "day-thunderstorm" : "night-alt-thunderstorm";
        case "tornado":
            return "tornado";
        case "hurricane":
            return "hurricane-warning";
        case "tropical_storm":
            return "storm-warning";
        case "dust":
            return "dust";
        case "smoke":
            return "smoke";
        case "haze":
            return "day-haze";
        case "hot":
            return "wi-hot";
        case "cold":
            return "snowflake-cold";
        case "blizzard":
            return daytime ? "day-snow-wind" : "night-alt-snow-wind";
        case "fog":
            return daytime ? "day-fog" : "night-fog";
    }
    return "na";
}
