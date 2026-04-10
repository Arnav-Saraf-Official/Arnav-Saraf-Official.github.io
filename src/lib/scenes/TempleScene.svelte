<script lang="ts">
	// scene 1
	// Assets: static/scenes/scene-1/{sky,horizon,mountains-far,mountains-near,mist,temple,ground}.png
	import Scene from '$lib/Scene.svelte';
	import Layer from '$lib/Layer.svelte';
	import { useScroll, viewportProgress, useElementLayout } from '$lib/scroll.svelte';
	import { phaseProgress } from '$lib/motion.js';
	import { layerTransform, type Camera } from '$lib/camera.js';

	const scroll = useScroll();
	let el = $state<HTMLElement | null>(null);
	const layout = useElementLayout(() => el);
	const p = $derived(viewportProgress(scroll.y, layout.offsetTop, layout.offsetHeight));

	const approachP = $derived(phaseProgress(p, 0, 0.6));
	const pushP     = $derived(phaseProgress(p, 0.5, 1.0));

	const camera: Camera = $derived({
		panX: 0,
		panY: approachP * 0.1,
		zoom: approachP * 0.35 + pushP,
	});

	const G = '50% 72%';
</script>

<Scene bind:ref={el}>
	<Layer transform={layerTransform(camera, 0.05)} origin={G} src="/scenes/scene-1/sky.png" />
	<Layer transform={layerTransform(camera, 0.12)} origin={G} src="/scenes/scene-1/horizon.png" />
	<Layer transform={layerTransform(camera, 0.28)} origin={G} src="/scenes/scene-1/mountains-far.png" />
	<Layer transform={layerTransform(camera, 0.52)} origin={G} src="/scenes/scene-1/mountains-near.png" />
	<Layer transform={layerTransform(camera, 0.65)} origin={G} src="/scenes/scene-1/mist.png" />
	<Layer transform={layerTransform(camera, 0.72)} origin={G} src="/scenes/scene-1/temple.png" />
	<Layer transform={layerTransform(camera, 0.88)} origin={G} src="/scenes/scene-1/ground.png" />
</Scene>
