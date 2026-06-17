<script lang="ts">
	import { onMount } from 'svelte';
	import { isMobile } from '$lib/utils/mobileDetect';

	onMount(() => {
		if (isMobile()) {
			window.location.href = 'https://google.com';
		}
	});
</script>

<svelte:head>
	<title>Redirecting...</title>
</svelte:head>

<div class="redirect">
	<p>Redirecting to desktop experience...</p>
</div>

<style>
	.redirect {
		width: 100vw;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #05081a;
		color: #c8e6ff;
		font-family: 'Courier New', monospace;
		font-size: 14px;
	}
</style>
