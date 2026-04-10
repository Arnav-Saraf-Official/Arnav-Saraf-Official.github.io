<script lang="ts">
	import TempleScene from '$lib/scenes/TempleScene.svelte';
	import MarketScene from '$lib/scenes/MarketScene.svelte';
	import ScrollBar from '$lib/ScrollBar.svelte';

	// 'temple' — vertical scroll drives the temple approach animation
	// 'market' — market overlay slides in, page scroll locked, wheel captured by market
	let mode = $state<'temple' | 'market'>('temple');

	$effect(() => {
		// lock / unlock page scroll when entering / leaving market mode
		document.body.style.overflow = mode === 'market' ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	});
</script>

{#if mode === 'temple'}
	<ScrollBar />
{/if}

<!-- Temple scene lives in normal document flow so position:sticky + scroll work -->
<TempleScene onTurnRight={() => (mode = 'market')} />

<!--
  Market overlay: position:fixed, starts off-screen to the right (translateX 100vw),
  slides left to 0 when active. CSS transition handles the animated pan.
-->
<div class="market-overlay" class:active={mode === 'market'}>
	<MarketScene onTurnLeft={() => (mode = 'temple')} />
</div>

<style>
	:global(html) {
		scrollbar-width: none;
	}
	:global(html::-webkit-scrollbar) {
		display: none;
	}
	:global(body) {
		margin: 0;
		overflow-x: hidden;
	}

	.market-overlay {
		position: fixed;
		inset: 0;
		transform: translateX(100vw);
		transition: transform 0.75s cubic-bezier(0.4, 0, 0.2, 1);
		z-index: 10;
		/* prevent interaction while off-screen */
		pointer-events: none;
	}

	.market-overlay.active {
		transform: translateX(0);
		pointer-events: auto;
	}
</style>
