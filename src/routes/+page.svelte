<script lang="ts">
	import { onMount } from 'svelte';
	import SolarSystem from '$lib/components/solar/SolarSystem.svelte';
	import BodyLabels from '$lib/components/solar/BodyLabels.svelte';
	import LandingCutscene from '$lib/components/solar/LandingCutscene.svelte';
	import { getCutscene } from '$lib/stores/cutscene.svelte';

	let hintVisible = $state(true);
	let hintFading = $state(false);

	onMount(() => {
		const fade = () => {
			hintFading = true;
			setTimeout(() => {
				hintVisible = false;
			}, 900);
		};
		const timer = setTimeout(fade, 8000);
		const onKey = () => {
			clearTimeout(timer);
			fade();
		};
		window.addEventListener('keydown', onKey, { once: true });
		return () => {
			clearTimeout(timer);
			window.removeEventListener('keydown', onKey);
		};
	});
</script>

<svelte:head>
	<title>Arnav Saraf — Portfolio</title>
</svelte:head>

<SolarSystem />
<BodyLabels />

{#if hintVisible}
	<div class="controls-hint" class:fading={hintFading}>
		<div class="hint-title">CONTROLS</div>
		<div class="hint-rows">
			<div class="hint-row">
				<span class="hint-keys"><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd></span>
				<span class="hint-desc">fly</span>
			</div>
			<div class="hint-row">
				<span class="hint-keys"><kbd>Q</kbd><kbd>E</kbd></span>
				<span class="hint-desc">rotate</span>
			</div>
			<div class="hint-row">
				<span class="hint-keys"><kbd>SPACE</kbd><kbd>SHIFT</kbd></span>
				<span class="hint-desc">up / down</span>
			</div>
			<div class="hint-row">
				<span class="hint-keys hint-click"><kbd>CLICK LABEL</kbd></span>
				<span class="hint-desc">land on planet</span>
			</div>
		</div>
	</div>
{/if}

{#if getCutscene()}
	{@const c = getCutscene()!}
	<LandingCutscene planetRoute={c.route} planetColor={c.color} planetName={c.name} />
{/if}

<style>
	.controls-hint {
		position: fixed;
		bottom: 40px;
		right: 36px;
		z-index: 20;
		background: rgba(4, 7, 18, 0.78);
		border: 1px solid rgba(0, 150, 220, 0.22);
		backdrop-filter: blur(10px);
		padding: 14px 18px;
		font-family: 'Courier New', monospace;
		opacity: 1;
		transition: opacity 0.9s ease;
		pointer-events: none;
	}
	.controls-hint.fading {
		opacity: 0;
	}
	.hint-title {
		font-size: 9px;
		letter-spacing: 4px;
		color: rgba(0, 200, 255, 0.55);
		margin-bottom: 10px;
	}
	.hint-rows {
		display: flex;
		flex-direction: column;
		gap: 7px;
	}
	.hint-row {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.hint-keys {
		display: flex;
		gap: 3px;
		min-width: 108px;
	}
	.hint-click {
		min-width: 108px;
	}
	.hint-desc {
		font-size: 9px;
		letter-spacing: 1.5px;
		color: rgba(200, 230, 255, 0.38);
	}
	kbd {
		background: rgba(0, 140, 210, 0.1);
		border: 1px solid rgba(0, 150, 220, 0.28);
		padding: 2px 5px;
		font-family: 'Courier New', monospace;
		font-size: 9px;
		color: rgba(200, 230, 255, 0.72);
		letter-spacing: 0.5px;
		white-space: nowrap;
	}
</style>
