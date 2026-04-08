<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		ref = $bindable<HTMLElement | null>(null),
		class: className = ''
	}: {
		children: Snippet;
		ref?: HTMLElement | null;
		class?: string;
	} = $props();
</script>

<section bind:this={ref} class="scene {className}">
	{@render children()}
</section>

<style>
	.scene {
		position: relative;
		min-height: 100vh;
		width: 100%;
		overflow: hidden;
	}
</style>
