<script lang="ts">
	import { T } from '@threlte/core';
	import * as THREE from 'three';

	interface Props {
		color?: string;
	}
	let { color = '#ffffff' }: Props = $props();

	const count = 200;
	const positions = new Float32Array(count * 3);
	for (let i = 0; i < count; i++) {
		positions[i * 3] = (Math.random() - 0.5) * 30;
		positions[i * 3 + 1] = Math.random() * 15;
		positions[i * 3 + 2] = (Math.random() - 0.5) * 15 - 3;
	}
	const geom = new THREE.BufferGeometry();
	geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
	const mat = new THREE.PointsMaterial({
		color,
		size: 0.04,
		transparent: true,
		opacity: 0.6,
		sizeAttenuation: true
	});
</script>

<T.Points geometry={geom} material={mat} />
