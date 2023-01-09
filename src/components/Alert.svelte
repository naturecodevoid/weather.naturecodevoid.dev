<script lang="ts">
    import dayjs from "dayjs";

    import { linkToIcon } from "../lib/icons";
    import type { Forecast } from "../lib/types/forecast";
    import Hourly from "./Hourly.svelte";
    import FeatherIcon from "./icons/FeatherIcon.svelte";
    import WeatherIcon from "./icons/WeatherIcon.svelte";
    import Modal from "./Modal.svelte";

    const dayjsFormat = "M/D h:mm:ss A";

    export let areaDesc: string;
    export let affectedZones: string[];
    export let effective: string;
    export let expires: string;
    export let status: string;
    export let messageType: string;
    export let category: string;
    export let severity: string;
    export let certainty: string;
    export let urgency: string;
    export let event: string;
    export let headline: string | undefined;
    export let description: string;
    export let instruction: string | undefined;
    export let parameters: {
        NWSheadline: string[];
    }

    let infoModal: Modal;

    function showInfo() {
        infoModal.show();
    }
</script>

<div style="background: {daytime ? 'var(--bg-day)' : 'var(--bg-night)'}; box-shadow: {daytime ? 'var(--bg-day-shadow)' : 'var(--bg-night-shadow)'} 2px 2px">
    <h2>{name}</h2>
    <h4 style="margin-block: 0 0.25em;">
        {dayjs(startTime).format(dayjsFormat)} - {dayjs(endTime).format(dayjsFormat)}
    </h4>
    <h4 style="margin-block: 0 0.25em;">{daytime ? "High" : "Low"}: {tempHigh}°{tempUnit}</h4>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <h4 style="margin-block: 0 0.5em; cursor: pointer;" on:click={showInfo}>
        {shortForecast}
        <FeatherIcon name="info" />
    </h4>
    <h4>Wind: {windDirection} {windSpeed}</h4>
    <br />
    <WeatherIcon name={linkToIcon(iconLink, daytime)} scale={5} />
    <br />
    <button style="margin-bottom: 1em;" on:click={showHourlyForecast}>Show hourly forecast</button>
    <Modal bind:this={infoModal} bgColor={daytime ? "var(--bg-day)" : "var(--bg-night)"} shadowColor={daytime ? "var(--bg-day-shadow)" : "var(--bg-night-shadow)"}>
        <h2>{name}</h2>
        <h4>{detailedForecast}</h4>
    </Modal>
    <Modal bind:this={hourlyForecastModal} bgColor={daytime ? "var(--bg-day)" : "var(--bg-night)"} shadowColor={daytime ? "var(--bg-day-shadow)" : "var(--bg-night-shadow)"}>
        <Hourly {hourlyForecast} />
    </Modal>
</div>

<style>
    h4 {
        margin-block: 0 1.33em;
    }

    div {
        padding: 1em;
        margin-bottom: 3em;
        width: calc(100% - 2rem);
        border-radius: 1rem;
        outline: 2px solid transparent;
    }
</style>
