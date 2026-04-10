<script lang="ts">
	// scene 3
	// Assets: static/scenes/scene-3/{sky,stars,aurora,moon,city-far,ground-mist,silhouette}.png
	import Scene from '$lib/Scene.svelte';
	import Layer from '$lib/Layer.svelte';
	import { useScroll, viewportProgress, useElementLayout } from '$lib/scroll.svelte';
	import { layerTransform, type Camera } from '$lib/camera.js';

	const scroll = useScroll();
	let el = $state<HTMLElement | null>(null);
	const layout = useElementLayout(() => el);
	const p = $derived(viewportProgress(scroll.y, layout.offsetTop, layout.offsetHeight));

	const camera: Camera = $derived({ panX: 0, panY: p, zoom: 0 });
	const cityOp = $derived(0.4 + p * 0.5);
	const silhOp = $derived(0.5 + p * 0.5);
</script>

<Scene bind:ref={el}>
	<Layer transform={layerTransform(camera, 0.23)}  origin="50% 50%"                          src="/scenes/scene-3/sky.png" />
	<Layer transform={layerTransform(camera, 0.115)} origin="50% 50%"                          src="/scenes/scene-3/stars.png" />
	<Layer transform={layerTransform(camera, 0.19)}  origin="50% 50%"                          src="/scenes/scene-3/aurora.png" />
	<Layer transform={layerTransform(camera, 0.73)}  origin="50% 50%"                          src="/scenes/scene-3/moon.png" />
	<Layer transform={layerTransform(camera, 0.35)}  origin="50% 50%" style="opacity:{cityOp}" src="/scenes/scene-3/city-far.png" />
	<Layer transform={layerTransform(camera, 0.21)}  origin="50% 50%"                          src="/scenes/scene-3/ground-mist.png" />
	<Layer transform={layerTransform(camera, 0.31)}  origin="50% 50%" style="opacity:{silhOp}" src="/scenes/scene-3/silhouette.png" />
</Scene>
