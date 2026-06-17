<script lang="ts">
	import { Canvas } from '@threlte/core';
	import * as THREE from 'three';
	import { getIsWarping } from '$lib/stores/navigation.svelte';
	import Starfield from '$lib/components/space/Starfield.svelte';
	import ShootingStars from '$lib/components/space/ShootingStars.svelte';
	import Nebula from '$lib/components/space/Nebula.svelte';
	import SpaceAmbient from '$lib/components/space/SpaceAmbient.svelte';

	const bgColor = new THREE.Color('#020408');
</script>

<div style="position: relative; width: 100%; height: 100%;">
	<Canvas
		camera={{
			position: [0, 0, 5],
			fov: 60
		}}
		scene={{
			background: bgColor
		}}
	>
		<Starfield />
		<Nebula />
		<ShootingStars />
		<SpaceAmbient />
	</Canvas>

	<!-- Warp flash overlay -->
	<div class="warp-flash" class:active={getIsWarping()}></div>
</div>
