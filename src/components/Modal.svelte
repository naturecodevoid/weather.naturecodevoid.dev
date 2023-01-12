<script lang="ts">
    let div: HTMLDivElement;
    export let bgColor: string = "var(--bg-color)";
    export let shadowColor: string = "var(--bg-shadow-color)";

    export function show() {
        document.querySelector("#modal-background").classList.add("modal-bg-visible");
        document.body.classList.add("modal-bg-visible");
        div.classList.add("modal-visible");
    }

    export function hide() {
        if (document.querySelectorAll(".modal-visible").length <= 1) {
            document.querySelector("#modal-background").classList.remove("modal-bg-visible");
            document.body.classList.remove("modal-bg-visible");
        }
        div.classList.remove("modal-visible");
    }
</script>

<div class="modal" bind:this={div} style="background: {bgColor}; box-shadow: {shadowColor} 2px 2px;">
    <div class="content">
        <slot />
        <button on:click={hide}>Close</button>
    </div>
</div>

<style>
    .modal {
        position: fixed;
        left: 50%;
        top: calc(100% + 400px);
        transform: translate(-50%, -50%);
        width: 18rem;
        padding: 1em;
        z-index: 10;
        border-radius: 0.75rem;
        visibility: hidden;
        opacity: 0;
        transition: all 0.4s ease-in-out;
        display: flex;
        flex-flow: column;
        max-height: calc(100% - 100px);
        overflow-y: hidden;
    }

    .content {
        flex: 1;
        overflow-y: scroll;
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    .content::-webkit-scrollbar {
        display: none;
    }
</style>
