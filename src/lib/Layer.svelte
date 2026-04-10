<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		transform = 'none',
		origin = '50% 50%',
		style = '',
		src = '',
		children
	}: {
		transform?: string;
		origin?: string;
		style?: string;
		src?: string;
		children?: Snippet;
	} = $props();
</script>

<div class="layer" style="transform:{transform};transform-origin:{origin};{style}">
	{#if src}
		<img {src} alt="" draggable="false" />
	{:else}
		{@render children?.()}
	{/if}
</div>

<style>
	.layer {
		position: absolute;
		inset: 0;
		will-change: transform;
	}

	img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		pointer-events: none;
		user-select: none;
	}
</style>
