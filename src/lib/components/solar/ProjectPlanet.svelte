<script lang="ts">
	import { T } from '@threlte/core';
	import * as THREE from 'three';
	import { getFilteredProjects } from '$lib/stores/projects.svelte';
	import ProjectSatellite from './ProjectSatellite.svelte';

	let groupRef = $state<THREE.Group | undefined>(undefined);

	const planetGeom = new THREE.SphereGeometry(1.8, 48, 48);
	const planetMat = new THREE.MeshStandardMaterial({
		color: '#1f3a5c', // Deep ocean blue — matches the PROJECTS label identity
		roughness: 0.7,
		metalness: 0.2,
		emissive: '#0a1a33',
		emissiveIntensity: 0.12
	});

	const atmoGeom = new THREE.SphereGeometry(1.95, 48, 48);
	const atmoMat = new THREE.MeshBasicMaterial({
		color: '#4488ff',
		transparent: true,
		opacity: 0.14,
		depthWrite: false,
		blending: THREE.AdditiveBlending
	});

	let time = $state(0);

	$effect(() => {
		let animId: number;
		function animate(t: number) {
			time = t * 0.001;
			if (groupRef) groupRef.rotation.y += 0.001;
			animId = requestAnimationFrame(animate);
		}
		animId = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(animId);
	});

	let projects = $derived(getFilteredProjects());
	const ORBIT_RADIUS_BASE = 2.8;
</script>

<T.Group bind:ref={groupRef}>
	<T.Mesh geometry={planetGeom} material={planetMat} />
	<T.Mesh geometry={atmoGeom} material={atmoMat} />

	{#each projects as project, i (project.slug)}
		{@const count = projects.length}
		{@const angle = (i / count) * Math.PI * 2}
		{@const orbitRadius = ORBIT_RADIUS_BASE + (i % 3) * 0.4}
		<ProjectSatellite
			{project}
			{orbitRadius}
			orbitAngle={angle}
			orbitSpeed={0.15 + i * 0.02}
			{time}
		/>
	{/each}

	<T.Mesh rotation={[Math.PI / 2, 0, 0]}>
		<T.TorusGeometry args={[ORBIT_RADIUS_BASE + 0.2, 0.02, 8, 128]} />
		<T.MeshBasicMaterial color="#334466" transparent opacity={0.3} depthWrite={false} />
	</T.Mesh>
</T.Group>
