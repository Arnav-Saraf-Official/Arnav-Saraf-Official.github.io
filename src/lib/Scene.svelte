<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		ref = $bindable<HTMLElement | null>(null),
		class: className = '',
		style: styleProp = ''
	}: {
		children: Snippet;
		ref?: HTMLElement | null;
		class?: string;
		style?: string;
	} = $props();
</script>

<section bind:this={ref} class="scene {className}" style={styleProp}>
	{@render children()}
</section>

<style>
	.scene {
		position: relative;
		min-height: 100vh;
		width: 100%;
		/* clip instead of hidden so position:sticky works through this boundary */
		overflow: clip;
	}
</style>
