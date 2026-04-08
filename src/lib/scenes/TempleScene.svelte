<script lang="ts">
	import Scene from '$lib/Scene.svelte';
	import ParallaxLayer from '$lib/ParallaxLayer.svelte';
	import { useScroll, viewportProgress } from '$lib/scroll.svelte';
	import { phaseProgress } from '$lib/motion.js';

	const scroll = useScroll();
	let el = $state<HTMLElement | null>(null);

	const p = $derived(viewportProgress(scroll.y, el));

	const revealP = $derived(phaseProgress(p, 0, 0.55));
	const pushP = $derived(phaseProgress(p, 0.45, 1.0));
	const pushScale = $derived(1 + pushP * 0.3);
</script>

<Scene bind:ref={el}>
	<!--
		zoom-frame wraps all layers and scales uniformly during the push phase.
		Individual layers still parallax independently during the reveal phase.
	-->
	<div class="zoom-frame" style="transform: scale({pushScale}); transform-origin: 50% 72%;">
		<ParallaxLayer
			progress={revealP}
			yOffset={-50}
			style="inset: -60px 0; background: linear-gradient(to bottom, #6a9fbe, #bdddf5);"
		/>

		<ParallaxLayer progress={revealP} yOffset={-110} style="display:flex; align-items:flex-end;">
			<div class="mountains"></div>
		</ParallaxLayer>

		<ParallaxLayer
			progress={revealP}
			yOffset={-240}
			style="display:flex; align-items:flex-end; justify-content:center;"
		>
			<div class="temple"></div>
		</ParallaxLayer>

		<!-- ground rises fastest — strongest depth cue during reveal -->
		<ParallaxLayer progress={revealP} yOffset={-400} style="display:flex; align-items:flex-end;">
			<div class="ground"></div>
		</ParallaxLayer>
	</div>
</Scene>

<style>
	.zoom-frame {
		position: absolute;
		inset: 0;
		will-change: transform;
	}

	.mountains {
		width: 100%;
		height: 28vh;
		background: linear-gradient(to top, #4a7a9a 55%, transparent);
		clip-path: polygon(
			0 100%,
			0 55%,
			8% 28%,
			16% 58%,
			24% 18%,
			32% 52%,
			40% 12%,
			48% 48%,
			56% 8%,
			64% 42%,
			72% 20%,
			80% 55%,
			88% 32%,
			96% 62%,
			100% 48%,
			100% 100%
		);
	}

	.temple {
		width: 160px;
		height: 56vh;
		background: #6a4820;
		/* 3-tier pagoda silhouette */
		clip-path: polygon(
			50% 0%,
			60% 8%,
			60% 12%,
			72% 16%,
			72% 20%,
			62% 20%,
			62% 28%,
			80% 33%,
			80% 37%,
			65% 37%,
			65% 50%,
			90% 55%,
			90% 59%,
			65% 59%,
			65% 100%,
			35% 100%,
			35% 59%,
			10% 59%,
			10% 55%,
			35% 50%,
			35% 37%,
			20% 37%,
			20% 33%,
			38% 28%,
			38% 20%,
			28% 20%,
			28% 16%,
			40% 12%,
			40% 8%
		);
	}

	.ground {
		width: 100%;
		height: 16vh;
		background: linear-gradient(to top, #4a3a1a, #7a6030);
	}
</style>
