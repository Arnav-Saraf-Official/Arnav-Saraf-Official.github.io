<script lang="ts">
	import { T } from '@threlte/core';
	import * as THREE from 'three';

	interface Props {
		count?: number;
		radius?: number;
	}

	let { count = 800, radius = 50 }: Props = $props();

	let positions = $derived.by(() => {
		const arr = new Float32Array(count * 3);
		for (let i = 0; i < count; i++) {
			const theta = Math.random() * Math.PI * 2;
			const phi = Math.acos(2 * Math.random() - 1);
			const r = radius * (0.5 + Math.random() * 0.5);
			arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
			arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
			arr[i * 3 + 2] = r * Math.cos(phi);
		}
		return arr;
	});

	let geometry = $derived(new THREE.BufferGeometry());
	$effect(() => {
		geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
	});

	let material = new THREE.PointsMaterial({
		color: '#ffffff',
		size: 0.08,
		transparent: true,
		opacity: 0.8,
		sizeAttenuation: true
	});

	// Rotate slowly
	let starfieldRef = $state<THREE.Points | null>(null);
	let lastTime = $state(0);

	$effect(() => {
		if (!starfieldRef) return;
		let animId: number;
		function animate(time: number) {
			if (!starfieldRef) return;
			const dt = lastTime ? (time - lastTime) / 1000 : 0;
			lastTime = time;
			starfieldRef.rotation.y += dt * 0.02;
			starfieldRef.rotation.x += dt * 0.005;
			animId = requestAnimationFrame(animate);
		}
		animId = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(animId);
	});
</script>

<T.Points bind:ref={starfieldRef} {geometry} {material} />
