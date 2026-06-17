<script lang="ts">
	import { T } from '@threlte/core';
	import * as THREE from 'three';
	import type { ProjectEntry } from '$lib/types/project';
	import { selectProject } from '$lib/stores/navigation.svelte';
	import { playClick } from '$lib/stores/audio.svelte';

	interface Props {
		project: ProjectEntry;
		orbitRadius: number;
		orbitAngle: number;
		orbitSpeed: number;
		time: number;
	}

	let { project, orbitRadius, orbitAngle, orbitSpeed, time }: Props = $props();

	let hovered = $state(false);

	let posX = $derived(Math.cos(orbitAngle + time * orbitSpeed) * orbitRadius);
	let posZ = $derived(Math.sin(orbitAngle + time * orbitSpeed) * orbitRadius);
	let posY = $derived(Math.sin(orbitAngle * 2 + time * 0.3) * 0.3);

	const dotGeom = new THREE.SphereGeometry(0.08, 16, 16);
	const dotMat = new THREE.MeshBasicMaterial({ color: '#00ddff' });
	const glowGeom = new THREE.SphereGeometry(0.14, 16, 16);
	const glowMat = new THREE.MeshBasicMaterial({
		color: '#00ddff',
		transparent: true,
		opacity: 0.4
	});
	const ringGeom = new THREE.TorusGeometry(0.2, 0.02, 8, 16);
	const ringMat = new THREE.MeshBasicMaterial({
		color: '#00ddff',
		transparent: true,
		opacity: 0.5
	});

	function handleClick() {
		playClick();
		selectProject(project.slug);
	}
</script>

<T.Group position={[posX, posY, posZ]}>
	<T.Mesh
		geometry={dotGeom}
		material={dotMat}
		scale={hovered ? [1.5, 1.5, 1.5] : [1, 1, 1]}
		onpointerenter={() => (hovered = true)}
		onpointerleave={() => (hovered = false)}
		onclick={handleClick}
	>
		<T.Mesh geometry={glowGeom} material={glowMat} />
		<T.Mesh geometry={ringGeom} material={ringMat} />
		<T.Sprite scale={[0.6, 0.15, 1]} position={[0, 0.25, 0]}>
			<T.SpriteMaterial color="#ffffff" transparent opacity={0.8} />
		</T.Sprite>
	</T.Mesh>
</T.Group>
