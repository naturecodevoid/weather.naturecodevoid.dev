<script lang="ts">
    import dayjs from "dayjs";

    import { linkToIcon } from "../lib/icons";
    import type { Forecast } from "../lib/types/forecast";
    import WeatherIcon from "./icons/WeatherIcon.svelte";

    export let hourlyForecast: Forecast[];
</script>

{#each hourlyForecast as hour, i}
    <div>
        <h4 style="margin-block: 0 0.25em;">
            {dayjs(hour.startTime).format("h A")} -
            {hour.isDaytime ? "High" : "Low"}: {hour.temperature}°{hour.temperatureUnit} - Wind: {hour.windDirection}
            {hour.windSpeed}
        </h4>
        <h4 style="margin-block: 0 0.25em;">
            {hour.shortForecast}
            <WeatherIcon name={linkToIcon(hour.icon, hour.isDaytime)} scale={1.3} widthHeight={28} />
        </h4>
        {#if i < hourlyForecast.length - 1}
            <hr style="border-bottom: 1px solid var(--color);" />
        {/if}
    </div>
{/each}

<style>
    h4 {
        font-size: 1em;
        font-weight: 400;
        font-family: inherit;
    }
</style>
