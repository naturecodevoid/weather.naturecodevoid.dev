<script lang="ts">
    import { changelog, latestVersion } from "../lib/changelog";
    import ChangelogVersion from "./ChangelogVersion.svelte";

    export let includeAll = false;
</script>

{#if includeAll}
    {#each changelog.versions as version}
        <ChangelogVersion {version} />
    {/each}
{:else}
    <ChangelogVersion version={latestVersion} />
{/if}
