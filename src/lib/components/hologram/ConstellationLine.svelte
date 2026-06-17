<script lang="ts">
	import { T } from '@threlte/core';
	import * as THREE from 'three';

	interface Props {
		from: [number, number, number];
		to: [number, number, number];
		color?: string;
	}

	let { from, to, color = '#4488ff' }: Props = $props();

	let points = $derived([new THREE.Vector3(...from), new THREE.Vector3(...to)]);
	let geometry = $derived(new THREE.BufferGeometry().setFromPoints(points));
	let material = new THREE.LineBasicMaterial({
		color,
		transparent: true,
		opacity: 0.35
	});
</script>

<T.Line {geometry} {material} />
