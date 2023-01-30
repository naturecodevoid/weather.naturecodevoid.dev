<script lang="ts">
    import FeatherIcon from "./icons/FeatherIcon.svelte";

    export let left: string;
    export let name: string;
    export let onClick: () => void;
    export let bgColor = "var(--bg-color)";
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div style="left: {left}; background-color: {bgColor}" on:click={onClick}>
    <FeatherIcon
        {name}
        extraStyles={`
height: 42px;
width: 42px;
position: relative;
top: 50%;
left: 50%;
transform: translateX(-50%) translateY(-50%);
    `} />
</div>

<style>
    div {
        position: fixed;
        width: 70px;
        height: 70px;
        top: calc(100% - 90px);
        z-index: 8;
        display: grid;
        grid-template-areas: "settings";
        border: 1px solid var(--bg-shadow-color);
        border-radius: 50%;
        cursor: pointer;
        transition: opacity 1s ease-in-out, visibility 1s ease-in-out, background-color 0.25s ease-in-out !important;
    }
</style>
