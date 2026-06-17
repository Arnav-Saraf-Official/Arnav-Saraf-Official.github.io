<script lang="ts">
	import { Canvas } from '@threlte/core';
	import StarChart from '$lib/components/hologram/StarChart.svelte';
</script>

<Canvas
	camera={{
		position: [0, 2.5, 7],
		fov: 42
	}}
>
	<StarChart />
</Canvas>
