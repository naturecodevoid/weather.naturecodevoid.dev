<script lang="ts">
    import dayjs from "dayjs";
    import { onMount, setContext } from "svelte";

    import Alert from "./components/Alert.svelte";
    import Bubble from "./components/Bubble.svelte";
    import Changelog from "./components/Changelog.svelte";
    import Days from "./components/Days.svelte";
    import Modal from "./components/Modal.svelte";
    import ModalBackground from "./components/ModalBackground.svelte";
    import Settings from "./components/Settings.svelte";
    import WithLifecycle from "./components/WithLifecycle.svelte";
    import { getChangelog, latestVersion, latestVersionNumber } from "./lib/changelog";
    import { appContextKey, latLon, placeOutput, placeInput, standaloneShownKey } from "./lib/global";
    import { getData } from "./lib/weather.gov";

    setContext(appContextKey, {
        refresh,
        restoreScroll,
    });

    let iOSHomeScreenModal: Modal;
    let pwaModal: Modal;
    let updateModal: Modal;

    let settings: Settings;

    let lastRefreshed = dayjs();
    let dataPromise = getData($latLon);

    function refresh() {
        busy = true;
        lastRefreshed = dayjs();
        dataPromise = getData($latLon);
    }

    // https://stackoverflow.com/a/9039885
    function isiOS() {
        return ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(navigator.platform) || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
    }

    onMount(() => {
        if (isiOS() && "standalone" in navigator && !navigator.standalone) iOSHomeScreenModal.show();
        else if (!location.search.includes("standalone") && !localStorage.getItem(standaloneShownKey) && !isiOS()) {
            pwaModal.show();
            localStorage.setItem(standaloneShownKey, "true");
        }

        if (latestVersion.id > $latestVersionNumber) {
            updateModal.show();
            latestVersionNumber.set(latestVersion.id);
        }
    });

    setInterval(async () => {
        refresh();

        const changelog = await getChangelog();
        if (changelog.latest > $latestVersionNumber) location.reload();
    }, 60 * 60 * 1000);

    let currentScrolled = 0;
    let busy = true;

    function onScroll() {
        if (!busy) currentScrolled = document.documentElement.scrollTop;
    }

    function restoreScroll() {
        document.documentElement.scrollTo(0, currentScrolled);
        busy = false;
    }
</script>

<svelte:window on:scroll={onScroll} />

<main>
    <br />
    {#await dataPromise}
        <h4 style="margin-bottom: 3em;">Waiting for data...</h4>
    {:then { alerts, ...data }}
        {#each alerts as alert}
            <Alert {...alert} />
        {/each}
        {#if alerts.length > 0}
            <br />
            <hr style="margin-block-end: 1.25em;" />
            <br />
        {/if}
        <Days {...data} />
    {:catch error}
        <WithLifecycle mount={() => (busy = false)}><h4 style="color: red; margin-bottom: 3em;">{error}</h4></WithLifecycle>
    {/await}

    <div>
        <h4>
            Made by <a href="https://naturecodevoid.dev/" target="_blank" rel="noreferrer">naturecodevoid</a><br />
            Open source at
            <a href="https://github.com/naturecodevoid/weather.naturecodevoid.dev" target="_blank" rel="noreferrer">naturecodevoid/weather.naturecodevoid.dev</a> (if you have feedback or feature
            suggestions, please open an issue!)<br />
            Data provided by <a href="https://www.weather.gov/" target="_blank" rel="noreferrer">weather.gov</a><br />
            Icons from
            <a href="https://github.com/erikflowers/weather-icons" target="_blank" rel="noreferrer">erikflowers/weather-icons</a>
            and <a href="https://feathericons.com/" target="_blank" rel="noreferrer">feathericons</a>
        </h4>
    </div>

    <br />
    <br />

    <div class="location-last-refreshed" style="left: calc(50% - 125px);">
        <h4 style="padding-top: 7px">Last refreshed: {lastRefreshed == null ? "Never" : lastRefreshed.format("M/D h:mm:ss A")}</h4>
        <h4>Location: {($placeOutput && !$placeInput && `${$placeOutput} (${$latLon.replace(",", ", ")})`) || $placeOutput || $latLon || "Not specified"}</h4>
    </div>

    <Bubble left="20px" name="refresh" onClick={refresh} bgColor={busy ? "var(--bg-disabled)" : "var(--bg-color)"} />

    <Bubble left="calc(100% - 90px)" name="settings" onClick={() => settings.show()} />

    <Settings bind:this={settings} />

    <Modal bind:this={iOSHomeScreenModal}>
        <h4>You seem to be on iOS or iPadOS which means you can add this website as an app to your homescreen for an even better experience! Just click the share icon and then Add to Home Screen.</h4>
    </Modal>

    <Modal bind:this={pwaModal}>
        <h4>This website can be added as a PWA to your device. There should be a button somewhere to add it as an app. (this message will not be shown again)</h4>
    </Modal>

    <Modal bind:this={updateModal}>
        <h2>The app has been updated!</h2>
        <Changelog />
    </Modal>
</main>

<ModalBackground />

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
    }
</style>
