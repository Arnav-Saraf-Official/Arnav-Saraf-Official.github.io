<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		progress = 0,
		yOffset = 0,
		xOffset = 0,
		scaleDelta = 0,
		fade,
		// direct px offsets added on top of progress-driven motion (e.g. from pan)
		xShift = 0,
		yShift = 0,
		class: className = '',
		style: styleProp = '',
		children
	}: {
		// 0to1 percent scroll val
		progress?: number;
		// vertical movement in px at progress=1 (negative = moves up)
		yOffset?: number;
		xOffset?: number;
		// scale change at progress=1 (0.2 = scale reaches 1.2)
		scaleDelta?: number;
		// opacity [at-0, at-1]
		fade?: [number, number];
		xShift?: number;
		yShift?: number;
		class?: string;
		style?: string;
		children?: Snippet;
	} = $props();

	const ty = $derived(progress * yOffset + yShift);
	const tx = $derived(progress * xOffset + xShift);
	const sc = $derived(1 + progress * scaleDelta);
	const op = $derived(fade != null ? fade[0] + progress * (fade[1] - fade[0]) : null);
</script>

<div
	class="parallax-layer {className}"
	style="transform: translate3d({tx}px, {ty}px, 0) scale({sc}); {op != null ? `opacity: ${op};` : ''} {styleProp}"
>
	{#if children}{@render children()}{/if}
</div>

<style>
	.parallax-layer {
		position: absolute;
		inset: 0;
		will-change: transform;
	}
</style>
