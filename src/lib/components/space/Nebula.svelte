<script lang="ts">
	import { T } from '@threlte/core';
	import * as THREE from 'three';
	import { getDestinationType } from '$lib/stores/navigation.svelte';

	let nebulaColor = $derived.by(() => {
		const dest = getDestinationType();
		if (dest === 'station') return '#224488';
		if (dest === 'satellite') return '#442266';
		if (dest === 'nebula') return '#334466';
		return '#1a2233';
	});

	// Large sphere with inner gradient
	let geometry = new THREE.SphereGeometry(30, 32, 32);
	let material = new THREE.ShaderMaterial({
		uniforms: {
			uColor: { value: new THREE.Color(nebulaColor) },
			uTime: { value: 0 }
		},
		vertexShader: /* glsl */ `
			varying vec3 vPosition;
			void main() {
				vPosition = position;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
		`,
		fragmentShader: /* glsl */ `
			varying vec3 vPosition;
			uniform vec3 uColor;
			uniform float uTime;
			void main() {
				float dist = length(vPosition) / 30.0;
				float alpha = smoothstep(0.4, 1.0, dist) * 0.12;
				alpha += sin(dist * 8.0 + uTime * 0.1) * 0.03;
				gl_FragColor = vec4(uColor, alpha);
			}
		`,
		transparent: true,
		depthWrite: false
	});

	let meshRef = $state<THREE.Mesh | null>(null);

	$effect(() => {
		if (!meshRef) return;
		material.uniforms.uColor.value.set(nebulaColor);
	});

	// Gentle rotation
	$effect(() => {
		if (!meshRef) return;
		let animId: number;
		function animate(time: number) {
			if (!meshRef) return;
			meshRef.rotation.y += 0.0003;
			meshRef.rotation.x += 0.0001;
			material.uniforms.uTime.value = time * 0.001;
			animId = requestAnimationFrame(animate);
		}
		animId = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(animId);
	});
</script>

<T.Mesh bind:ref={meshRef} {geometry} {material} />
