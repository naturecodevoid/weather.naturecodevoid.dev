<script lang="ts">
    import Day from "./components/Day.svelte";
    import ModalBackground from "./components/ModalBackground.svelte";
    import WeatherIcon from "./components/icons/WeatherIcon.svelte";
    import FeatherIcon from "./components/icons/FeatherIcon.svelte";
    import { dayjsFormat, getData, getHourlyForecastsBetweenStartAndEndTime, type Forecast } from "./lib/data";
    import Modal from "./components/Modal.svelte";
    import dayjs from "dayjs";
    import { onMount } from "svelte";
    import { isiOS } from "./lib/ios";

    let latLon: string;
    const storageKey = "latitude-longitude";

    if (localStorage.getItem(storageKey) != null) latLon = localStorage.getItem(storageKey);

    let latLonModal: Modal;
    let autoLatLonModal: Modal;
    let iOSHomeScreenModal: Modal;

    let lastRefreshed: dayjs.Dayjs = dayjs();
    let dataPromise: Promise<{
        dailyForecast: Forecast[];
        hourlyForecast: Forecast[];
    }> = getData(latLon);

    function saveLatLon() {
        localStorage.setItem(storageKey, latLon);
    }

    function refresh() {
        saveLatLon();
        lastRefreshed = dayjs();
        dataPromise = getData(latLon);
    }

    setInterval(refresh, 60 * 60 * 1000);

    onMount(() => {
        if (isiOS() && "standalone" in navigator && !navigator.standalone) iOSHomeScreenModal.show();
    });

    async function autoDetermineLatLon() {
        autoLatLonModal.hide();
        const data = await (await fetch(`https://s.naturecodevoid.dev/latitude-longitude`)).json();
        latLon = `${data.latitude},${data.longitude}`;
        refresh();
    }

    function showAutoLatLonInfo() {
        autoLatLonModal.show();
    }

    function showLatLonInfo() {
        latLonModal.show();
    }
</script>

<main>
    <div style="margin-bottom: 3em;">
        <h4>
            Latitude and Longitude:<br />
            <input
                bind:value={latLon}
                on:input={saveLatLon}
                placeholder="latitude,longitude"
                style="margin-bottom: 10px;"
            /><br /><br />
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <span style="margin-block: 0 0.5em; cursor: pointer;" on:click={showAutoLatLonInfo}>
                Automatically determine latitude and longitude
                <FeatherIcon name="info" alt="More info" />
            </span><br /><br />
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <span style="margin-block: 0 0.5em; cursor: pointer;" on:click={showLatLonInfo}>
                How to manually determine latitude and longitude
                <FeatherIcon name="info" alt="More info" />
            </span>
        </h4>
        <button class="refresh" on:click={refresh}>Refresh <WeatherIcon name="refresh" widthHeight={10} /></button>
        <h4 style="margin-top: 2em;">
            Last refreshed: {lastRefreshed == null ? "Never" : lastRefreshed.format(dayjsFormat)}
        </h4>
    </div>
    {#await dataPromise}
        <h4>Waiting for data...</h4>
    {:then data}
        {#each data.dailyForecast as day}
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
                hourlyForecast={getHourlyForecastsBetweenStartAndEndTime(
                    data.hourlyForecast,
                    dayjs(day.startTime),
                    dayjs(day.endTime),
                )}
            />
        {/each}
    {:catch error}
        <h4 style="color: red; margin-bottom: 3em;">An error occurred: {error}</h4>
    {/await}
    <div>
        <h4>
            Made by <a href="https://naturecodevoid.dev/" target="_blank" rel="noreferrer">naturecodevoid</a><br />
            Open source at
            <a href="https://github.com/naturecodevoid/weather.naturecodevoid.dev" target="_blank" rel="noreferrer">
                naturecodevoid/weather.naturecodevoid.dev
            </a><br />
            Data provided by <a href="https://www.weather.gov/" target="_blank" rel="noreferrer">weather.gov</a><br />
            Icons from
            <a href="https://github.com/erikflowers/weather-icons" target="_blank" rel="noreferrer">
                erikflowers/weather-icons
            </a>
        </h4>
    </div>
    <Modal bind:this={autoLatLonModal}>
        <h4>
            I have a Cloudflare worker running at s.naturecodevoid.dev and it uses <a
                href="https://developers.cloudflare.com/workers/runtime-apis/request#incomingrequestcfproperties"
                target="_blank"
                rel="noreferrer"
            >
                Cloudflare's latitude and longitude API
            </a>
            to automatically determine your latitude and longitude. The only thing it does with the data is return it with
            the request; it does not log anything. However, you may not trust it or
            <strong>the resulting latitude and longitude may not be 100% accurate</strong> so you may want to manually determine
            your latitude and longitude.
        </h4>
        <button style="margin-bottom: 1em;" on:click={autoDetermineLatLon}>
            Automatically determine latitude and longitude
        </button>
    </Modal>
    <Modal bind:this={latLonModal}>
        <h4>
            The easiest way to get your latitude and longitude is to go to Google Maps, find your location and copy the
            latitude and longitude values from the URL (after the @, only the first 2 numbers). A comma should seperate
            them.
        </h4>
    </Modal>
    <Modal bind:this={iOSHomeScreenModal}>
        <h4>
            If you're on iOS or iPadOS, you can add this website as an app to your homescreen for an even better
            experience! Just click the share icon and then Add to Home Screen.
        </h4>
    </Modal>
</main>
<ModalBackground />

<style>
    h4 {
        font-size: 1em;
        font-weight: 400;
        font-family: inherit;
    }

    button.refresh {
        border: 1px solid #3a3a3a;
        margin-block: 0.5em 0;
    }
</style>
