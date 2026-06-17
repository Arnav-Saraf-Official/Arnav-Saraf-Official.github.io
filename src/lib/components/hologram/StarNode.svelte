<script lang="ts">
	import { T } from '@threlte/core';
	import * as THREE from 'three';
	import { selectProject, startWarp, endWarp } from '$lib/stores/navigation.svelte';
	import { playClick } from '$lib/stores/audio.svelte';

	interface Props {
		id: string;
		position: [number, number, number];
		color: THREE.Color;
		radius?: number;
	}

	let { id, position, color, radius = 0.1 }: Props = $props();

	let isHovered = $state(false);

	let currentRadius = $derived(isHovered ? radius * 1.8 : radius);

	let sphereGeometry = new THREE.SphereGeometry(1, 16, 16);
	let coreMaterial = new THREE.MeshBasicMaterial({ color: '#ffffff' });
	let glowMaterial = new THREE.MeshBasicMaterial({
		color,
		transparent: true,
		opacity: 0.5
	});

	let pointLight = new THREE.PointLight(color, 0.8, 0.5);

	function handleClick() {
		playClick();
		startWarp();
		selectProject(id);
		setTimeout(() => endWarp(), 1000);
	}

	function handlePointerEnter() {
		isHovered = true;
		document.body.style.cursor = 'pointer';
	}

	function handlePointerLeave() {
		isHovered = false;
		document.body.style.cursor = '';
	}
</script>

<T.Mesh
	position={{ x: position[0], y: position[1], z: position[2] }}
	scale={{ x: currentRadius * 0.5, y: currentRadius * 0.5, z: currentRadius * 0.5 }}
	onpointerenter={handlePointerEnter}
	onpointerleave={handlePointerLeave}
	onclick={handleClick}
	onkeydown={(e) => e.key === 'Enter' && handleClick()}
>
	<T.Mesh geometry={sphereGeometry} material={coreMaterial} scale={0.6} />
	<T.Mesh geometry={sphereGeometry} material={glowMaterial} scale={1.4} />
</T.Mesh>

<T.PointLight ref={pointLight} position={{ x: position[0], y: position[1], z: position[2] }} />
