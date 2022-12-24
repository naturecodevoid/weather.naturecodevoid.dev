<script lang="ts">
    export let name: string;
    export let extraStyles = "";
</script>

<img src="/feather-icons/{name}.svg" alt={name[0].toUpperCase() + name.substring(1)} style={extraStyles} />
<slot />

<style>
    img {
        position: relative;
        top: 5px;
    }
</style>
