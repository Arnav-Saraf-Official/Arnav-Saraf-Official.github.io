<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		progress = 0,
		yOffset = 0,
		xOffset = 0,
		scaleDelta = 0,
		scaleProgress,
		fade,
		xShift = 0,
		yShift = 0,
		class: className = '',
		style: styleProp = '',
		children
	}: {
		progress?: number;
		yOffset?: number;
		xOffset?: number;
		scaleDelta?: number;
		scaleProgress?: number;
		fade?: [number, number];
		xShift?: number;
		yShift?: number;
		class?: string;
		style?: string;
		children?: Snippet;
	} = $props();

	const ty = $derived(progress * yOffset + yShift);
	const tx = $derived(progress * xOffset + xShift);
	const sc = $derived(1 + (scaleProgress ?? progress) * scaleDelta);
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
