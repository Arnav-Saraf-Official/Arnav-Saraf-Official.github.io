<script lang="ts">
	import SolarSystem from '$lib/components/solar/SolarSystem.svelte';
	import BodyLabels from '$lib/components/solar/BodyLabels.svelte';
	import LandingCutscene from '$lib/components/solar/LandingCutscene.svelte';
	import { getCutscene } from '$lib/stores/cutscene.svelte';
</script>

<svelte:head>
	<title>Arnav Saraf — Portfolio</title>
</svelte:head>

<SolarSystem />
<BodyLabels />

{#if getCutscene()}
	{@const c = getCutscene()!}
	<LandingCutscene planetRoute={c.route} planetColor={c.color} planetName={c.name} />
{/if}
