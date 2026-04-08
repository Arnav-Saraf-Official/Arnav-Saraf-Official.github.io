<script lang="ts">
	import Scene from '$lib/Scene.svelte';
	import { useScroll, stickyProgress } from '$lib/scroll.svelte';
	import { createPan } from '$lib/usePan.svelte';

	// scene is 4x viewport tall — gives ~3 viewport-heights of sticky travel range
	const SCENE_HEIGHT = '400vh';

	const scroll = useScroll();
	let el = $state<HTMLElement | null>(null);

	// stickyProgress maps 0→1 exactly to the range where .viewport is pinned to the top
	const p = $derived(stickyProgress(scroll.y, el));

	const pan = createPan();
	$effect(() => {
		if (!el) return;
		return pan.attach(el);
	});
</script>

<!--
	Scene is taller than the viewport, which gives scroll room for traversal.
	Inside, .viewport is sticky so the visible frame stays fixed while the
	scene scrolls. The horizontal content layers move based on p.
-->
<Scene bind:ref={el} style="min-height: {SCENE_HEIGHT};">
	<div class="viewport">
		<!-- sky: barely shifts — feels like a distant backdrop -->
		<div
			class="layer bg"
			style="transform: translateX(calc({p} * -12vw)) translate3d({-pan.x * 18}px, {-pan.y * 10}px, 0);"
		></div>

		<!-- far building row: slow horizontal movement, 260vw wide -->
		<div
			class="layer row far"
			style="transform: translateX(calc({p} * -60vw)) translate3d({-pan.x * 42}px, {-pan.y * 20}px, 0);"
		>
			{#each Array(14) as _, i}
				<div class="building" style="height: {28 + (i * 41 % 32)}vh;"></div>
				<div style="width: {30 + (i * 27 % 55)}px; flex-shrink:0;"></div>
			{/each}
		</div>

		<!-- mid stalls: medium movement, content starts at 30vw so it enters from the right -->
		<div
			class="layer row mid"
			style="transform: translateX(calc({p} * -140vw)) translate3d({-pan.x * 70}px, {-pan.y * 28}px, 0);"
		>
			<div style="width: 30vw; flex-shrink:0;"></div>
			{#each Array(8) as _, i}
				<div class="stall" style="height: {22 + (i * 31 % 20)}vh; width: {100 + (i * 19 % 60)}px;">
					<div class="stall-awning" style="background: hsl({20 + i * 22}, 65%, {35 + i * 4 % 20}%);"></div>
				</div>
				<div style="width: {60 + (i * 33 % 80)}px; flex-shrink:0;"></div>
			{/each}
		</div>

		<!-- foreground strip: fastest, closest — full traversal width -->
		<div
			class="layer fg"
			style="width: calc(100vw + {p} * 200vw); transform: translateX(calc({p} * -200vw)) translate3d({-pan.x * 90}px, {-pan.y * 16}px, 0);"
		></div>
	</div>
</Scene>

<style>
	.viewport {
		position: sticky;
		top: 0;
		height: 100vh;
		overflow: hidden;
	}

	.layer {
		position: absolute;
		inset: 0;
		will-change: transform;
	}

	.bg {
		background: linear-gradient(to bottom, #b06520, #e8a55a);
		inset: -40px 0;
	}

	.row {
		display: flex;
		align-items: flex-end;
		/* wide enough that traversal never exposes empty space */
		width: 360vw;
		inset: 0;
	}

	.far {
		padding-bottom: 16vh;
	}

	.building {
		width: 65px;
		flex-shrink: 0;
		background: rgba(0, 0, 0, 0.28);
		border-radius: 2px 2px 0 0;
		align-self: flex-end;
	}

	.mid {
		padding-bottom: 16vh;
	}

	.stall {
		flex-shrink: 0;
		position: relative;
		background: rgba(0, 0, 0, 0.15);
		border-radius: 2px 2px 0 0;
		align-self: flex-end;
		display: flex;
		flex-direction: column;
	}

	.stall-awning {
		height: 18px;
		width: 110%;
		margin-left: -5%;
		border-radius: 1px;
	}

	.fg {
		height: 16vh;
		bottom: 0;
		top: auto;
		background: linear-gradient(to top, #6a2a08, #9a4518);
	}
</style>
