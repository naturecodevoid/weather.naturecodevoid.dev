<script lang="ts">
    import { getContext } from "svelte";

    import type App from "../App.svelte";
    import { appContextKey, placeInput, latLon } from "../lib/global";
    import Changelog from "./Changelog.svelte";

    const app = getContext(appContextKey) as App;

    let div: HTMLDivElement;
    let placeInputElement: HTMLInputElement;

    export function show() {
        document.body.classList.add("modal-visible");
        document.body.classList.add("modal-bg-visible");
        div.classList.add("modal-visible");
        setTimeout(() => placeInputElement.focus(), 1000);
    }

    function hide() {
        clearTimeout(throttleId);
        getLatLonFromPlace().finally(() => app.refresh());
        document.body.classList.remove("modal-visible");
        document.body.classList.remove("modal-bg-visible");
        div.classList.remove("modal-visible");
    }

    let dataPromise: Promise<{
        latitude: number;
        longitude: number;
        name: string;
    }> = getLatLonFromPlace();

    async function getLatLonFromPlace() {
        if (!$placeInput) throw "Invalid location input";

        let data: {
            latitude: number;
            longitude: number;
            name: string;
        };

        try {
            data = await (await fetch(`https://s.naturecodevoid.dev/arcgis/${$placeInput}`)).json();
        } catch (e) {
            latLon.set("");
            throw "Invalid location input";
        }

        latLon.set(`${data.latitude},${data.longitude}`);

        return data;
    }

    let throttleId: number;

    function onLocationInput() {
        if (throttleId) clearTimeout(throttleId);
        throttleId = setTimeout(() => {
            latLon.set("");
            dataPromise = getLatLonFromPlace();
        }, 750);
    }
</script>

<div id="settings" bind:this={div}>
    <div class="content">
        <h4>
            Location input:<br />
            <input
                bind:this={placeInputElement}
                bind:value={$placeInput}
                on:input={onLocationInput}
                on:keypress={(e) => {
                    if (e.key == "Enter" && $placeInput) {
                        clearTimeout(throttleId);
                        latLon.set("");
                        dataPromise = getLatLonFromPlace();
                    }
                }}
                placeholder="Washington DC" />
        </h4>

        <details style="padding-bottom: 5px;">
            <summary>Info on location to latitude and longitude conversion</summary>
            <h4>
                I have a Cloudflare worker running at s.naturecodevoid.dev and it uses <a
                    href="https://developers.arcgis.com/rest/geocode/api-reference/overview-world-geocoding-service.htm"
                    target="_blank"
                    rel="noreferrer">
                    ArcGIS/Esri's geocoding API
                </a>
                to convert a location to latitude and longitude. I cannot do this directly from the browser for security reasons, so the only thing that the worker does is make a request to the geocoding
                API and return the resulting latitude, longitude and place name. The worker does not do anything else with the data or input. However, you may want to look at
                <a href="https://www.esri.com/en-us/privacy/overview" target="_blank" rel="noreferrer">ArcGIS/Esri's privacy policy</a> for more info on what ArcGIS/Esri does with the data/input. If
                you don't trust ArcGIS/Esri or my Cloudflare worker, you can look in Advanced options for info on manually getting your latitude and longitude.
            </h4>
        </details>

        {#await dataPromise}
            <h4>Waiting for data...</h4>
        {:then data}
            <h4>Resulting location: {data.name}</h4>
            <h4>
                <a
                    href="https://www.openstreetmap.org/export/embed.html?marker={data.latitude},{data.longitude}&bbox={data.longitude - 0.05},{data.latitude - 0.05},{data.longitude +
                        0.05},{data.latitude + 0.05}"
                    target="_blank"
                    rel="noreferrer">View on map</a>
            </h4>
            <h4>The location displayed in the info box may differ from the resulting location since the value in the info box is the location according to the weather.gov API.</h4>
        {:catch error}
            <h4 style="color: red;">{error}</h4>
        {/await}

        <details>
            <summary>Advanced options</summary>
            <h4>
                Latitude and Longitude:<br />
                <input bind:value={$latLon} placeholder="latitude,longitude" />
            </h4>
            <h4>
                The easiest way to manually get your latitude and longitude is to go to Google Maps, find your location and copy the latitude and longitude values from the URL (after the @, only the
                first 2 numbers). A comma should separate them. <strong
                    >If you do manually get your latitude and longitude, make sure that the location input at the top of settings is empty or the manually entered latitude and longitude will be reset.</strong>
            </h4>
        </details>

        <details style="padding-bottom: 30px;">
            <summary>Changelog</summary>
            <Changelog includeAll={true} />
        </details>

        <button on:click={hide}>Close</button>
    </div>
</div>

<style>
    #settings {
        position: fixed;
        left: 0;
        top: 100%;
        width: 100vw;
        height: 100vh;
        padding: 1em;
        z-index: 11;
        background: var(--bg-color);
        visibility: hidden;
        opacity: 0;
        transition: all 1s ease-in-out;
        display: flex;
        flex-flow: column;
        overflow-y: hidden;
    }

    .content {
        flex: 1;
        overflow-y: scroll;
        max-width: calc(100vw - 2em);
        padding-bottom: 3em;
    }

    details {
        padding-bottom: 25px;
    }

    summary {
        cursor: pointer;
    }

    input {
        border: 1px solid var(--bg-shadow-color);
    }
</style>
