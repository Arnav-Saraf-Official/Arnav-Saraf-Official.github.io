<script lang="ts">
	import TempleScene from '$lib/scenes/TempleScene.svelte';
	import MarketScene from '$lib/scenes/MarketScene.svelte';
	import Scene from '$lib/Scene.svelte';
	import ParallaxLayer from '$lib/ParallaxLayer.svelte';
	import { useScroll, viewportProgress } from '$lib/scroll.svelte';

	const scroll = useScroll();

	// simple scenes that don't warrant their own component yet
	let elNight = $state<HTMLElement | null>(null);
	const pNight = $derived(viewportProgress(scroll.y, elNight));
</script>

<TempleScene />

<MarketScene />

<!-- night: simple vertical parallax placeholder -->
<Scene bind:ref={elNight}>
	<ParallaxLayer
		progress={pNight}
		yOffset={-60}
		style="inset: -80px 0; background: linear-gradient(to bottom, #05050f, #0d0d2b);"
	/>

	<ParallaxLayer
		progress={pNight}
		yOffset={-180}
		style="display:flex; justify-content:center; padding-top:14vh; pointer-events:none;"
	>
		<div class="moon"></div>
	</ParallaxLayer>

	<ParallaxLayer progress={pNight} yOffset={-80} fade={[0.5, 1]} style="display:flex; align-items:flex-end;">
		<div class="silhouette"></div>
	</ParallaxLayer>
</Scene>

<style>
	:global(html) {
		scroll-behavior: smooth;
	}
	:global(body) {
		margin: 0;
		overflow-x: hidden;
	}

	.moon {
		width: 60px;
		height: 60px;
		border-radius: 50%;
		background: radial-gradient(circle at 35% 35%, #fffbe0, #e8d880);
		box-shadow: 0 0 50px 15px rgba(255, 240, 120, 0.2);
	}

	.silhouette {
		width: 100%;
		height: 36vh;
		background: #08080f;
		clip-path: polygon(
			0 100%,
			0 60%,
			5% 60%,
			5% 40%,
			10% 40%,
			10% 50%,
			15% 50%,
			15% 30%,
			20% 30%,
			20% 55%,
			25% 55%,
			25% 45%,
			30% 45%,
			30% 20%,
			35% 20%,
			35% 50%,
			40% 50%,
			40% 35%,
			45% 35%,
			45% 55%,
			50% 55%,
			50% 25%,
			55% 25%,
			55% 50%,
			60% 50%,
			60% 40%,
			65% 40%,
			65% 60%,
			70% 60%,
			70% 45%,
			75% 45%,
			75% 30%,
			80% 30%,
			80% 55%,
			85% 55%,
			85% 42%,
			90% 42%,
			90% 58%,
			95% 58%,
			95% 48%,
			100% 48%,
			100% 100%
		);
	}
</style>
