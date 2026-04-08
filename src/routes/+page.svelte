<script lang="ts">
	import Scene from '$lib/Scene.svelte';
	import ParallaxLayer from '$lib/ParallaxLayer.svelte';
	import { useScroll, viewportProgress } from '$lib/scroll.svelte';
	import { createPan } from '$lib/usePan.svelte';

	const scroll = useScroll();

	let el0 = $state<HTMLElement | null>(null);
	let el1 = $state<HTMLElement | null>(null);
	let el2 = $state<HTMLElement | null>(null);
	let el3 = $state<HTMLElement | null>(null);

	const p0 = $derived(viewportProgress(scroll.y, el0));
	const p1 = $derived(viewportProgress(scroll.y, el1));
	const p2 = $derived(viewportProgress(scroll.y, el2));
	const p3 = $derived(viewportProgress(scroll.y, el3));

	// pan is local to scene 2 only
	const pan2 = createPan();
	$effect(() => {
		if (!el2) return;
		return pan2.attach(el2);
	});
</script>

<div class="progress-hud">y {scroll.y.toFixed(0)} · p0 {p0.toFixed(2)}</div>

<!-- scene 0: welcome -->
<Scene bind:ref={el0}>
	<!-- bg: inset extends past edges so translation never exposes a gap -->
	<ParallaxLayer progress={p0} yOffset={-120} style="inset: -80px 0; background: linear-gradient(to bottom, #5ba3d0, #c9e8f7);" />

	<!-- sun moves down more slowly than scroll (opposite direction to scene exit) -->
	<ParallaxLayer
		progress={p0}
		yOffset={-60}
		style="display:flex; align-items:flex-start; justify-content:center; padding-top:14vh; pointer-events:none;"
	>
		<div class="sun"></div>
	</ParallaxLayer>

	<!-- horizon shoots up fast — strong depth cue -->
	<ParallaxLayer progress={p0} yOffset={-300} style="display:flex; align-items:flex-end;">
		<div class="horizon"></div>
	</ParallaxLayer>

	<div class="scene-label">welcome</div>
</Scene>

<!-- scene 1: forest -->
<Scene bind:ref={el1}>
	<ParallaxLayer progress={p1} yOffset={-100} style="inset: -80px 0; background: linear-gradient(to bottom, #1a3a1a, #2d5a2d);" />

	<ParallaxLayer progress={p1} yOffset={-100} style="display:flex; align-items:flex-start;">
		<div class="tree-layer far"></div>
	</ParallaxLayer>

	<!-- near trees move much faster than far trees — depth effect -->
	<ParallaxLayer progress={p1} yOffset={-280} style="display:flex; align-items:flex-end;">
		<div class="tree-layer near"></div>
	</ParallaxLayer>

	<div class="scene-label">forest</div>
</Scene>

<!-- scene 2: market — scroll parallax + pointer pan -->
<Scene bind:ref={el2}>
	<!-- bg: least pan response, barely moves — feels far away -->
	<ParallaxLayer
		progress={p2}
		yOffset={-80}
		xShift={-pan2.x * 18}
		yShift={-pan2.y * 10}
		style="inset: -80px 0; background: linear-gradient(to bottom, #b06520, #e8a55a);"
	/>

	<!-- mid: moderate pan response -->
	<ParallaxLayer
		progress={p2}
		yOffset={-120}
		scaleDelta={0.08}
		xShift={-pan2.x * 48}
		yShift={-pan2.y * 22}
		style="display:flex; align-items:flex-end; justify-content:space-around;"
	>
		<div class="building" style="height:30vh;"></div>
		<div class="building" style="height:45vh;"></div>
		<div class="building" style="height:25vh;"></div>
		<div class="building" style="height:38vh;"></div>
	</ParallaxLayer>

	<!-- fg: most pan response -->
	<ParallaxLayer
		progress={p2}
		yOffset={-320}
		fade={[1, 0.7]}
		xShift={-pan2.x * 90}
		yShift={-pan2.y * 18}
		style="display:flex; align-items:flex-end;"
	>
		<div class="foreground-strip warm"></div>
	</ParallaxLayer>

	<div class="scene-label">market · move mouse</div>
</Scene>

<!-- scene 3: night -->
<Scene bind:ref={el3}>
	<ParallaxLayer progress={p3} yOffset={-60} style="inset: -80px 0; background: linear-gradient(to bottom, #05050f, #0d0d2b);" />

	<ParallaxLayer
		progress={p3}
		yOffset={-180}
		style="display:flex; justify-content:center; padding-top:14vh; pointer-events:none;"
	>
		<div class="moon"></div>
	</ParallaxLayer>

	<ParallaxLayer progress={p3} yOffset={-80} fade={[0.5, 1]} style="display:flex; align-items:flex-end;">
		<div class="silhouette"></div>
	</ParallaxLayer>

	<div class="scene-label">night</div>
</Scene>

<style>
	:global(html) {
		scroll-behavior: smooth;
	}
	:global(body) {
		margin: 0;
		overflow-x: hidden;
	}

	.progress-hud {
		position: fixed;
		top: 1rem;
		right: 1rem;
		z-index: 100;
		background: rgba(0, 0, 0, 0.5);
		color: #fff;
		font: 0.7rem/1 monospace;
		padding: 0.3rem 0.6rem;
		border-radius: 4px;
		pointer-events: none;
	}

	/* sits above all absolute parallax layers via dom order + z-index */
	.scene-label {
		position: absolute;
		z-index: 10;
		bottom: 2rem;
		left: 50%;
		transform: translateX(-50%);
		color: rgba(255, 255, 255, 0.45);
		font: 0.65rem/1 monospace;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		pointer-events: none;
	}

	.sun {
		width: 90px;
		height: 90px;
		border-radius: 50%;
		background: radial-gradient(circle, #fff8a0, #ffe44d);
		box-shadow: 0 0 80px 30px rgba(255, 220, 60, 0.4);
	}

	.horizon {
		width: 100%;
		height: 22vh;
		background: linear-gradient(to top, #3a7a3a, #6ab06a);
		border-radius: 50% 50% 0 0 / 20px 20px 0 0;
	}

	.tree-layer {
		width: 100%;
	}

	.tree-layer.far {
		height: 35vh;
		background: linear-gradient(to top, #1a4a1a 60%, transparent);
		clip-path: polygon(
			0 100%,
			5% 40%,
			10% 70%,
			15% 20%,
			20% 60%,
			25% 10%,
			30% 50%,
			35% 5%,
			40% 45%,
			45% 15%,
			50% 55%,
			55% 10%,
			60% 50%,
			65% 20%,
			70% 60%,
			75% 15%,
			80% 55%,
			85% 25%,
			90% 65%,
			95% 35%,
			100% 50%,
			100% 100%
		);
	}

	.tree-layer.near {
		height: 50vh;
		background: linear-gradient(to top, #0d2e0d 65%, transparent);
		clip-path: polygon(
			0 100%,
			3% 30%,
			8% 60%,
			13% 15%,
			18% 55%,
			23% 5%,
			28% 45%,
			33% 10%,
			38% 40%,
			43% 0%,
			48% 35%,
			53% 5%,
			58% 40%,
			63% 10%,
			68% 45%,
			73% 5%,
			78% 38%,
			83% 12%,
			88% 48%,
			93% 20%,
			98% 55%,
			100% 30%,
			100% 100%
		);
	}

	.building {
		width: 80px;
		background: rgba(0, 0, 0, 0.3);
		border-radius: 2px 2px 0 0;
	}

	.foreground-strip {
		width: 100%;
	}

	.foreground-strip.warm {
		height: 16vh;
		background: linear-gradient(to top, #6a2a08, #9a4518);
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
