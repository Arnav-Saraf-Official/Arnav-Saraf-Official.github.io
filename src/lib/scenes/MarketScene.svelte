<script lang="ts">
	// scene 2 — market corridor traversal
	// Assets: static/scenes/scene-2/{sky,far-end,overhead,stalls-left,stalls-right,ground}.png
	import Scene from '$lib/Scene.svelte';
	import Layer from '$lib/Layer.svelte';
	import { useScroll, stickyProgress } from '$lib/scroll.svelte';
	import { createPan } from '$lib/usePan.svelte';

	const scroll = useScroll();
	let el = $state<HTMLElement | null>(null);
	const traversal = $derived(stickyProgress(scroll.y, el));

	const pan = createPan();
	$effect(() => {
		if (!el) return;
		return pan.attach(el);
	});

	const Z = 0.4;
	function mkT(depth: number): string {
		const sc = (1 + traversal * depth * Z).toFixed(5);
		const tx = (-pan.x * depth * 50).toFixed(1);
		return `translate3d(${tx}px,0,0) scale(${sc})`;
	}

	const skyT      = $derived(mkT(0.04));
	const farT      = $derived(mkT(0.18));
	const overheadT = $derived(mkT(0.36));
	const stallT    = $derived(mkT(0.72));
	const groundT   = $derived(mkT(0.90));
</script>

<Scene bind:ref={el} style="min-height:400vh;">
	<div class="viewport">
		<Layer transform={skyT}      origin="50% 50%"   src="/scenes/scene-2/sky.png" />
		<Layer transform={farT}      origin="50% 100%"  src="/scenes/scene-2/far-end.png" />
		<Layer transform={overheadT} origin="50% 0%"    src="/scenes/scene-2/overhead.png" />
		<Layer transform={stallT}    origin="0% 100%"   src="/scenes/scene-2/stalls-left.png" />
		<Layer transform={stallT}    origin="100% 100%" src="/scenes/scene-2/stalls-right.png" />
		<Layer transform={groundT}   origin="50% 100%"  src="/scenes/scene-2/ground.png" />
	</div>
</Scene>

<style>
	.viewport {
		position: sticky;
		top: 0;
		height: 100vh;
		overflow: hidden;
	}
</style>
