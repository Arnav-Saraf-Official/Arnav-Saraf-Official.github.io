<script lang="ts">
	import { T } from '@threlte/core';
	import * as THREE from 'three';

	let groupRef = $state<THREE.Group | undefined>(undefined);

	const moonGeom = new THREE.SphereGeometry(0.6, 32, 32);
	const moonMat = new THREE.MeshStandardMaterial({
		color: '#9a958a', // Warm grey rock — matches the tan ABOUT identity
		roughness: 0.8,
		metalness: 0.1,
		emissive: '#1a1a18',
		emissiveIntensity: 0.05
	});

	const atmoGeom = new THREE.SphereGeometry(0.65, 32, 32);
	const atmoMat = new THREE.MeshBasicMaterial({
		color: '#c9c2a8',
		transparent: true,
		opacity: 0.12,
		depthWrite: false,
		blending: THREE.AdditiveBlending
	});

	$effect(() => {
		if (!groupRef) return;
		let animId: number;
		function animate() {
			groupRef!.rotation.y += 0.002;
			animId = requestAnimationFrame(animate);
		}
		animId = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(animId);
	});
</script>

<T.Group bind:ref={groupRef}>
	<T.Mesh geometry={moonGeom} material={moonMat} />
	<T.Mesh geometry={atmoGeom} material={atmoMat} />
</T.Group>
