<script lang="ts">
    import type { Version } from "../lib/changelog";

    export let version: Version;
</script>

<h3>{version.date}</h3>

<ul>
    {#each version.changelog as change}
        <li><h4>- {change}</h4></li>
    {/each}
</ul>

<style>
    ul {
        padding-inline-start: 0px;
        list-style-type: "";
    }

    li > h4 {
        margin-block-start: 10px;
        margin-block-end: 10px;
    }
</style>
