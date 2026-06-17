<script lang="ts">
	import { T } from '@threlte/core';
	import * as THREE from 'three';

	let groupRef = $state<THREE.Group | undefined>(undefined);

	const nucleusGeom = new THREE.IcosahedronGeometry(0.3, 1);
	const nucleusMat = new THREE.MeshStandardMaterial({
		color: '#ccccdd',
		roughness: 0.5,
		metalness: 0.2,
		emissive: '#222244',
		emissiveIntensity: 0.5
	});

	const glowGeom = new THREE.SphereGeometry(0.45, 16, 16);
	const glowMat = new THREE.MeshBasicMaterial({
		color: '#8899ff',
		transparent: true,
		opacity: 0.3
	});

	const trailCount = 80;
	const trailPositions = new Float32Array(trailCount * 3);
	for (let i = 0; i < trailCount; i++) {
		const t = i / trailCount;
		trailPositions[i * 3] = -t * 4;
		trailPositions[i * 3 + 1] = (Math.random() - 0.5) * 0.3 * t;
		trailPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.3 * t;
	}
	const trailGeom = new THREE.BufferGeometry();
	trailGeom.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
	const trailMat = new THREE.PointsMaterial({
		color: '#8899ff',
		size: 0.06,
		transparent: true,
		opacity: 0.7,
		sizeAttenuation: true
	});

	$effect(() => {
		let animId: number;
		function animate() {
			if (groupRef) groupRef.rotation.y += 0.003;
			animId = requestAnimationFrame(animate);
		}
		animId = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(animId);
	});
</script>

<T.Group bind:ref={groupRef}>
	<T.Mesh geometry={nucleusGeom} material={nucleusMat} />
	<T.Mesh geometry={glowGeom} material={glowMat} />
	<T.Points geometry={trailGeom} material={trailMat} />
</T.Group>
