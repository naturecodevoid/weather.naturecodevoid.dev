<script lang="ts">
    import dayjs from "dayjs";
    import { onMount, setContext } from "svelte";

    import Alert from "./components/Alert.svelte";
    import Days from "./components/Days.svelte";
    import WeatherIcon from "./components/icons/WeatherIcon.svelte";
    import Modal from "./components/Modal.svelte";
    import ModalBackground from "./components/ModalBackground.svelte";
    import SettingsBubble from "./components/SettingsBubble.svelte";
    import WithLifecycle from "./components/WithLifecycle.svelte";
    import { appContextKey, latLon, placeOutput } from "./lib/global";
    import { getData } from "./lib/weather.gov";

    setContext(appContextKey, {
        refresh,
        restoreScroll,
    });

    let iOSHomeScreenModal: Modal;
    let pwaModal: Modal;

    let lastRefreshed = dayjs();
    let dataPromise = getData($latLon);

    function refresh() {
        busy = true;
        lastRefreshed = dayjs();
        dataPromise = getData($latLon);
    }

    setInterval(refresh, 60 * 60 * 1000);

    // https://stackoverflow.com/a/9039885
    function isiOS() {
        return ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(navigator.platform) || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
    }

    onMount(() => {
        if (isiOS() && "standalone" in navigator && !navigator.standalone) iOSHomeScreenModal.show();
        else if (!location.search.includes("standalone") && !localStorage.getItem("standalone-shown") && !isiOS()) {
            pwaModal.show();
            localStorage.setItem("standalone-shown", "true");
        }
    });

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

    {#await dataPromise then { alerts }}
        {#each alerts as alert}
            <Alert {...alert} />
        {/each}
    {/await}

    <div style="margin-bottom: 3em;">
        <br />
        <button class="refresh" on:click={refresh} disabled={busy}>Refresh <WeatherIcon name="refresh" widthHeight={10} /></button>
        <h4 style="margin-top: 2em;">
            Last refreshed: {lastRefreshed == null ? "Never" : lastRefreshed.format("M/D h:mm:ss A")}
        </h4>
        <h4>Location: {$placeOutput || "Not specified"}</h4>
    </div>

    {#await dataPromise}
        <h4 style="margin-bottom: 3em;">Waiting for data...</h4>
    {:then { alerts, ...data }}
        <Days {...data} />
    {:catch error}
        <WithLifecycle mount={() => (busy = false)}><h4 style="color: red; margin-bottom: 3em;">{error}</h4></WithLifecycle>
    {/await}

    <div>
        <h4>
            Made by <a href="https://naturecodevoid.dev/" target="_blank" rel="noreferrer">naturecodevoid</a><br />
            Open source at
            <a href="https://github.com/naturecodevoid/weather.naturecodevoid.dev" target="_blank" rel="noreferrer">naturecodevoid/weather.naturecodevoid.dev</a><br />
            Data provided by <a href="https://www.weather.gov/" target="_blank" rel="noreferrer">weather.gov</a><br />
            Icons from
            <a href="https://github.com/erikflowers/weather-icons" target="_blank" rel="noreferrer">erikflowers/weather-icons</a>
            and <a href="https://feathericons.com/" target="_blank" rel="noreferrer">feathericons</a>
        </h4>
    </div>

    <SettingsBubble />

    <Modal bind:this={iOSHomeScreenModal}>
        <h4>You seem to be on iOS or iPadOS which means you can add this website as an app to your homescreen for an even better experience! Just click the share icon and then Add to Home Screen.</h4>
    </Modal>

    <Modal bind:this={pwaModal}>
        <h4>This website can be added as a PWA to your device. There should be a button somewhere to add it as an app. (this message will not be shown again)</h4>
    </Modal>
</main>

<ModalBackground />

<style>
    button.refresh {
        border: 1px solid #3a3a3a;
        margin-block: 0.5em 0;
    }
</style>
