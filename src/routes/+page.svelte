<script lang="ts">
	import TempleScene from '$lib/scenes/TempleScene.svelte';
	import MarketScene from '$lib/scenes/MarketScene.svelte';
	import NightScene from '$lib/scenes/NightScene.svelte';
	import ScrollBar from '$lib/ScrollBar.svelte';
</script>

<ScrollBar />
<TempleScene />
<MarketScene />
<NightScene />

<style>
	:global(html) {
		/* hide native scrollbar */
		scrollbar-width: none;
	}
	:global(html::-webkit-scrollbar) {
		display: none;
	}
	:global(body) {
		margin: 0;
		overflow-x: hidden;
	}
</style>
