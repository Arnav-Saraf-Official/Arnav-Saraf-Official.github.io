<script lang="ts">
	import { useScroll } from '$lib/scroll.svelte';

	const scroll = useScroll();

	const progress = $derived(
		typeof document !== 'undefined'
			? Math.min(1, scroll.y / Math.max(1, document.body.scrollHeight - window.innerHeight))
			: 0
	);
</script>

<aside class="bar">
	<div class="track">
		<div class="fill" style="height: {progress * 100}%;"></div>
		<div class="pip" style="top: {progress * 100}%;"></div>
	</div>
</aside>

<style>
	.bar {
		position: fixed;
		right: 14px;
		top: 0;
		bottom: 0;
		display: flex;
		align-items: stretch;
		z-index: 500;
		pointer-events: none;
	}

	.track {
		width: 2px;
		margin: 20px 0;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 2px;
		position: relative;
		flex: 1;
	}

	.fill {
		width: 100%;
		background: rgba(255, 216, 120, 0.65);
		border-radius: 2px;
		will-change: height;
	}

	.pip {
		position: absolute;
		left: 50%;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #ffd878;
		transform: translateX(-50%) translateY(-50%);
		box-shadow:
			0 0 0 2px rgba(255, 216, 120, 0.25),
			0 0 10px 3px rgba(255, 190, 50, 0.55);
		will-change: top;
	}
</style>
