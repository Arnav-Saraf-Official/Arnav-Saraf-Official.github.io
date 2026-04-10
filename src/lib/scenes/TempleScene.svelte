<script lang="ts">
	// scene 1, approach temple gate
	// Assets: static/scenes/scene-1/{sky,horizon,mountains-far,mountains-near,mist,temple,ground}.png
	import Scene from '$lib/Scene.svelte';
	import Layer from '$lib/Layer.svelte';
	import { useScroll, viewportProgress, useElementLayout } from '$lib/scroll.svelte';
	import { phaseProgress } from '$lib/motion.js';
	import { layerTransform, type Camera } from '$lib/camera.js';

	let { onTurnRight }: { onTurnRight?: () => void } = $props();

	const scroll = useScroll();
	let el = $state<HTMLElement | null>(null);
	const layout = useElementLayout(() => el);
	const p = $derived(viewportProgress(scroll.y, layout.offsetTop, layout.offsetHeight));

	const levelP = $derived(phaseProgress(p, 0, 0.45));

	const zoomP  = $derived(phaseProgress(p, 0.4, 1.0));

	const camera: Camera = $derived({
		panX: 0,
		panY: -(1 - levelP),  // -1 (looking up at sky) --> 0 (level)
		zoom: zoomP * 2.5,
	});

	const btnOpacity = $derived(Math.max(0, Math.min(1, (p - 0.65) / 0.2)));

	// all layers share the gate as transform-origin (50% 72% = gate arch area)
	const G = '50% 72%';
</script>

<Scene bind:ref={el} style="min-height:300vh;">
	<div class="viewport">
		<Layer transform={layerTransform(camera, 0.05)} origin={G} src="/scenes/scene-1/sky.png" />
		<Layer transform={layerTransform(camera, 0.12)} origin={G} src="/scenes/scene-1/horizon.png" />
		<Layer transform={layerTransform(camera, 0.28)} origin={G} src="/scenes/scene-1/mountains-far.png" />
		<Layer transform={layerTransform(camera, 0.52)} origin={G} src="/scenes/scene-1/mountains-near.png" />
		<Layer transform={layerTransform(camera, 0.65)} origin={G} src="/scenes/scene-1/mist.png" />
		<Layer transform={layerTransform(camera, 0.72)} origin={G} src="/scenes/scene-1/temple.png" />
		<Layer transform={layerTransform(camera, 0.88)} origin={G} src="/scenes/scene-1/ground.png" />

		{#if btnOpacity > 0}
			<button
				class="turn-right"
				style="opacity:{btnOpacity}"
				onclick={onTurnRight}
			>
				insert lucide icon here
			</button>
		{/if}
	</div>
</Scene>

<style>
	.viewport {
		position: sticky;
		top: 0;
		height: 100vh;
		overflow: hidden;
	}

	.turn-right {
		position: absolute;
		bottom: 40px;
		right: 48px;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.35);
		color: #fff;
		font-size: 1rem;
		letter-spacing: 0.08em;
		padding: 10px 22px;
		border-radius: 4px;
		cursor: pointer;
		backdrop-filter: blur(6px);
		transition: background 0.2s;
		pointer-events: auto;
		z-index: 20;
	}

	.turn-right:hover {
		background: rgba(255, 255, 255, 0.22);
	}
</style>
