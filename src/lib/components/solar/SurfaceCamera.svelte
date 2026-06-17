<script lang="ts">
	import { useThrelte } from '@threlte/core';
	import * as THREE from 'three';

	const { camera } = useThrelte();

	$effect(() => {
		const cam = camera.current as THREE.PerspectiveCamera;
		if (cam) {
			cam.lookAt(0, -2, -5);
		}
	});
</script>
