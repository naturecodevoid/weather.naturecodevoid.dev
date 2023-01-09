<script lang="ts">
    import { onMount } from "svelte";

    export let mount: () => void;

    onMount(mount)
</script>

<slot />