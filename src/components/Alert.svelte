<script lang="ts">
    import dayjs from "dayjs";

    import type { MessageType, Severity } from "../lib/types/alert";
    import FeatherIcon from "./icons/FeatherIcon.svelte";
    import Modal from "./Modal.svelte";

    const dayjsFormat = "M/D h:mm A";

    export let areaDesc: string;
    export let effective: string;
    export let expires: string;
    export let messageType: MessageType;
    export let category: string;
    export let severity: Severity;
    export let certainty: string;
    export let urgency: string;
    export let event: string;
    export let headline: string | undefined;
    export let description: string;
    export let instruction: string | undefined;

    let infoModal: Modal;

    let backgroundColor = `var(--bg-${messageType.toLowerCase()})`;
    let shadowColor = `var(--bg-shadow-${messageType.toLowerCase()})`;

    function showInfo() {
        infoModal.show();
    }

    // https://remarkablemark.org/blog/2019/11/29/javascript-sanitize-html/
    function sanitizeHTML(text: string) {
        const element = document.createElement("div");
        element.innerText = text;
        return element.innerHTML.replaceAll("\n\n", "\n").replaceAll("\n", "<br />");
    }
</script>

<div style="background: {backgroundColor}; box-shadow: {shadowColor} 2px 2px">
    <h2>{messageType}</h2>
    <h2>{event}</h2>
    <h4>
        {dayjs(effective).format(dayjsFormat)} - {dayjs(expires).format(dayjsFormat)}
    </h4>
    <h4>Severity: {severity}</h4>
    <h4>Certainty: {certainty}</h4>
    <h4>Urgency: {urgency}</h4>
    <h4>Category: {category}</h4>
    <h4 class="no">Area: {areaDesc}</h4>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <h4 style="margin-block: 0 0.5em; cursor: pointer;" on:click={showInfo}>
        More info
        <FeatherIcon name="info" />
    </h4>
    <Modal bind:this={infoModal} bgColor={backgroundColor} {shadowColor}>
        {#if headline}
            <h2>{headline}</h2>
        {/if}
        <h4>{@html sanitizeHTML(description)}</h4>
        {#if instruction}
            <br />
            <h4>{@html sanitizeHTML(instruction)}</h4>
        {/if}
        <br />
    </Modal>
</div>

<style>
    h4 {
        margin-block: 0 0.25em;
    }

    h4.no {
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
