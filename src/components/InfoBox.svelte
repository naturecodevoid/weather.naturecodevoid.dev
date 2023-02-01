<script lang="ts">
    import type { Dayjs } from "dayjs";
    import { onMount } from "svelte";

    import { latLon, placeInput, placeOutput } from "../lib/global";

    export let lastRefreshed: Dayjs;

    let box: HTMLDivElement;
    let location: HTMLSpanElement;

    let trimmedLatLon = "";
    onMount(() => {
        latLon.subscribe((val) => {
            trimmedLatLon = val.replace(",", ", ");
            adjustLocationFontSize();
        });
        placeOutput.subscribe((_) => {
            adjustLocationFontSize();
        });
    });

    function getLocation() {
        return `Location: ${($placeOutput && !$placeInput && `${$placeOutput} (${trimmedLatLon})`) || $placeOutput || trimmedLatLon || "Not specified"}`;
    }

    function adjustLocationFontSize() {
        if (!location) return console.log("skipping adjustment");
        location.textContent = getLocation();
        location.style.fontSize = "0.95em";
        const boxWidth = box.getBoundingClientRect().width;
        if (location.getBoundingClientRect().width < boxWidth) return console.log("text fits in box");

        let currentFontSize = Number.parseFloat(getComputedStyle(location).fontSize);

        while (location.getBoundingClientRect().width > boxWidth) {
            currentFontSize -= 1;
            location.style.fontSize = currentFontSize.toString() + "px";
            if (currentFontSize < 5) break;
        }

        console.log(`adjusted text to ${location.style.fontSize}`);
    }
</script>

<div class="location-last-refreshed" style="left: calc(50% - 125px);" bind:this={box}>
    <h4 style="padding-top: 7px">Last refreshed: {lastRefreshed == null ? "Never" : lastRefreshed.format("M/D h:mm:ss A")}</h4>
    <h4>
        <span style="font-size: 0.95em; width: unset" bind:this={location}>{getLocation()}</span>
    </h4>
</div>

<style>
    div.location-last-refreshed {
        width: 250px;
        height: 70px;
        position: fixed;
        top: calc(100% - 90px);
        z-index: 8;
        background-color: var(--bg-color);
        border: 1px solid var(--bg-shadow-color);
        border-radius: 12px;
    }

    div.location-last-refreshed > h4 {
        margin-block-start: 0px;
        margin-block-end: 0px;
        padding: 4px;
        font-size: 0.95em;
        white-space: nowrap;
    }
</style>
