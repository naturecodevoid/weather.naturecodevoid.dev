<script lang="ts">
    export let name: string;
    export let alt: string;
</script>

<img src="/feather-icons/{name}.svg" {alt} />

<style>
    img {
        position: relative;
        top: 5px;
    }
</style>
