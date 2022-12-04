<script lang="ts">
    export let name: string;
    export let scale: number = 1;
    export let widthHeight: number = 112;
</script>

<i class="wi wi-{name}" style="font-size: {scale}rem; height: {widthHeight}px; width: {widthHeight}px;" />
