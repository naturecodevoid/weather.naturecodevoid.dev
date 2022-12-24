<script lang="ts">
    import FeatherIcon from "./icons/FeatherIcon.svelte";
    import Settings from "./Settings.svelte";

    let settings: Settings;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div style="cursor: pointer;" on:click={settings.show}>
    <FeatherIcon
        name="settings"
        extraStyles={`
height: 42px;
width: 42px;
position: relative;
top: 50%;
left: 50%;
transform: translateX(-50%) translateY(-50%);
    `} />
</div>

<Settings bind:this={settings} />

<style>
    div {
        position: fixed;
        width: 70px;
        height: 70px;
        left: calc(100% - 90px);
        top: calc(100% - 90px);
        z-index: 8;
        background: var(--bg-color);
        display: grid;
        grid-template-areas: "settings";
        border: 1px solid var(--bg-shadow-color);
        border-radius: 50%;
    }
</style>
