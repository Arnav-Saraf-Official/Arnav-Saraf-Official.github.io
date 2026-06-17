<script lang="ts">
	import { T } from '@threlte/core';
	import * as THREE from 'three';

	const ASTEROID_COUNT = 300;
	const BELT_RADIUS_INNER = 5;
	const BELT_RADIUS_OUTER = 8;

	const positions = new Float32Array(ASTEROID_COUNT * 3);
	const sizes = new Float32Array(ASTEROID_COUNT);

	for (let i = 0; i < ASTEROID_COUNT; i++) {
		const angle = Math.random() * Math.PI * 2;
		const radius = BELT_RADIUS_INNER + Math.random() * (BELT_RADIUS_OUTER - BELT_RADIUS_INNER);
		const height = (Math.random() - 0.5) * 1.2;
		positions[i * 3] = Math.cos(angle) * radius;
		positions[i * 3 + 1] = height;
		positions[i * 3 + 2] = Math.sin(angle) * radius;
		sizes[i] = 0.05 + Math.random() * 0.2;
	}

	const geom = new THREE.BufferGeometry();
	geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
	geom.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

	const mat = new THREE.PointsMaterial({
		color: '#8899aa',
		size: 0.08,
		transparent: true,
		opacity: 0.8,
		sizeAttenuation: true
	});

	let beltRef = $state<THREE.Points | undefined>(undefined);

	$effect(() => {
		if (!beltRef) return;
		let animId: number;
		function animate() {
			beltRef!.rotation.y += 0.0002;
			animId = requestAnimationFrame(animate);
		}
		animId = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(animId);
	});
</script>

<T.Points bind:ref={beltRef} geometry={geom} material={mat} />
