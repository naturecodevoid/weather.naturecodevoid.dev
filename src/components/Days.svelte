<script lang="ts">
    import dayjs from "dayjs";
    import { getContext, onMount } from "svelte";

    import type App from "../App.svelte";
    import { appContextKey } from "../lib/global";
    import { getHourlyForecastsBetweenStartAndEndTime } from "../lib/weather.gov";
    import type { Forecast } from "../lib/types/forecast";
    import Day from "./Day.svelte";

    const app = getContext(appContextKey) as App;

    onMount(() => {
        app.restoreScroll();
    });

    export let dailyForecast: Forecast[];
    export let hourlyForecast: Forecast[];
</script>

{#each dailyForecast as day}
    <Day
        name={day.name}
        startTime={day.startTime}
        endTime={day.endTime}
        daytime={day.isDaytime}
        tempHigh={day.temperature.toString()}
        tempUnit={day.temperatureUnit}
        windSpeed={day.windSpeed}
        windDirection={day.windDirection}
        shortForecast={day.shortForecast}
        detailedForecast={day.detailedForecast}
        iconLink={day.icon}
        hourlyForecast={getHourlyForecastsBetweenStartAndEndTime(hourlyForecast, dayjs(day.startTime), dayjs(day.endTime))} />
{/each}
