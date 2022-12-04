<script lang="ts">
    import dayjs from "dayjs";
    import { dayjsShortFormat, type Forecast } from "../lib/data";
    import { linkToIcon } from "../lib/icons";
    import FeatherIcon from "./icons/FeatherIcon.svelte";
    import Hourly from "./Hourly.svelte";
    import Modal from "./Modal.svelte";
    import WeatherIcon from "./icons/WeatherIcon.svelte";

    export let name: string;
    export let startTime: string;
    export let endTime: string;
    export let daytime: boolean;
    export let tempHigh: string;
    export let tempUnit: string;
    export let windSpeed: string;
    export let windDirection: string;
    export let shortForecast: string;
    export let detailedForecast: string;
    export let iconLink: string;
    export let hourlyForecast: Forecast[];

    let modal: Modal;
    let hourlyForecastModal: Modal;

    function showDetailedForecast() {
        modal.show();
    }

    function showHourlyForecast() {
        hourlyForecastModal.show();
    }
</script>

<div
    style="background: {daytime ? 'var(--bg-day)' : 'var(--bg-night)'}; box-shadow: {daytime
        ? 'var(--bg-day-shadow)'
        : 'var(--bg-night-shadow)'} 2px 2px"
>
    <h2>{name}</h2>
    <h4 style="margin-block: 0 0.25em;">
        {dayjs(startTime).format(dayjsShortFormat)} - {dayjs(endTime).format(dayjsShortFormat)}
    </h4>
    <h4 style="margin-block: 0 0.25em;">{daytime ? "High" : "Low"}: {tempHigh}°{tempUnit}</h4>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <h4 style="margin-block: 0 0.5em; cursor: pointer;" on:click={showDetailedForecast}>
        {shortForecast}
        <FeatherIcon name="info" alt="More info" />
    </h4>
    <h4>Wind: {windDirection} {windSpeed}</h4>
    <br />
    <WeatherIcon name={linkToIcon(iconLink, daytime)} scale={5} />
    <br />
    <button style="margin-bottom: 1em;" on:click={showHourlyForecast}>Show hourly forecast</button>
    <Modal
        bind:this={modal}
        bgColor={daytime ? "var(--bg-day)" : "var(--bg-night)"}
        shadowColor={daytime ? "var(--bg-day-shadow)" : "var(--bg-night-shadow)"}
    >
        <h2>{name}</h2>
        <h4>{detailedForecast}</h4>
    </Modal>
    <Modal
        bind:this={hourlyForecastModal}
        bgColor={daytime ? "var(--bg-day)" : "var(--bg-night)"}
        shadowColor={daytime ? "var(--bg-day-shadow)" : "var(--bg-night-shadow)"}
    >
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
