<script lang="ts">
	import { T } from '@threlte/core';
	import * as THREE from 'three';

	interface Props {
		radius: number;
		color: string;
		tilt?: number;
		rotation?: number;
	}

	let { radius, color, tilt = 0, rotation = 0 }: Props = $props();

	let ringGeometry = new THREE.TorusGeometry(radius, 0.015, 8, 128);
	let ringMaterial = new THREE.MeshBasicMaterial({
		color,
		transparent: true,
		opacity: 0.3
	});
</script>

<T.Mesh
	geometry={ringGeometry}
	material={ringMaterial}
	rotation={{ x: Math.PI / 2 + tilt, y: 0, z: rotation }}
/>
