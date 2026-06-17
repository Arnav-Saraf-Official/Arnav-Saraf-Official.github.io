<script lang="ts">
	import { T } from '@threlte/core';
	import * as THREE from 'three';

	let groupRef = $state<THREE.Group | undefined>(undefined);

	// Simple visible sun — MeshBasicMaterial always renders, no lights needed
	const sunGeom = new THREE.SphereGeometry(2.5, 64, 64);
	const sunMat = new THREE.MeshBasicMaterial({ color: '#fff9e6' });

	// Corona glow shell
	const coronaGeom = new THREE.SphereGeometry(3.2, 48, 48);
	const coronaMat = new THREE.MeshBasicMaterial({
		color: '#ffaa00',
		transparent: true,
		opacity: 0.28,
		depthWrite: false,
		blending: THREE.AdditiveBlending
	});

	// Outer glow
	const outerGeom = new THREE.SphereGeometry(4.0, 32, 32);
	const outerMat = new THREE.MeshBasicMaterial({
		color: '#ff4400',
		transparent: true,
		opacity: 0.12,
		depthWrite: false,
		blending: THREE.AdditiveBlending
	});

	$effect(() => {
		if (!groupRef) return;
		let animId: number;
		function animate() {
			groupRef!.rotation.y += 0.0008;
			animId = requestAnimationFrame(animate);
		}
		animId = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(animId);
	});
</script>

<T.Group bind:ref={groupRef}>
	<T.Mesh geometry={sunGeom} material={sunMat} />
	<T.Mesh geometry={coronaGeom} material={coronaMat} />
	<T.Mesh geometry={outerGeom} material={outerMat} />
</T.Group>
