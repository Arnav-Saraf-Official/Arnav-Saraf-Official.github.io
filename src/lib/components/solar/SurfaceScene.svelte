<script lang="ts">
	import { T } from '@threlte/core';
	import * as THREE from 'three';
	import { getIsLanded, getLandingTarget } from '$lib/stores/landing.svelte';

	// Only render when landed
	let isLanded = $derived(getIsLanded());
	let target = $derived(getLandingTarget());

	// Ground colors per planet
	const groundColors: Record<string, string> = {
		sun: '#331a00',
		projects: '#1a2a40',
		about: '#2a2a28',
		contact: '#1a1a2a'
	};

	let color = $derived(groundColors[target || 'sun'] || '#1a1a1a');

	const groundGeom = new THREE.PlaneGeometry(80, 80, 64, 64);
	groundGeom.rotateX(-Math.PI / 2);

	// Displace vertices for terrain
	const posAttr = groundGeom.getAttribute('position');
	for (let i = 0; i < posAttr.count; i++) {
		const x = posAttr.getX(i);
		const y = posAttr.getY(i);
		const h =
			(Math.sin(x * 0.8) * Math.cos(y * 0.6) * 0.5 +
				Math.sin(x * 1.7 + 1.3) * Math.cos(y * 1.1) * 0.3 +
				Math.cos(x * 2.3) * Math.sin(y * 1.9) * 0.2) *
			1.2;
		posAttr.setZ(i, h);
	}
	groundGeom.computeVertexNormals();

	const groundMat = new THREE.MeshStandardMaterial({
		color: new THREE.Color('#1a1a1a'),
		roughness: 0.9,
		metalness: 0.1,
		flatShading: true
	});

	// Atmosphere fog dome
	const fogGeom = new THREE.SphereGeometry(20, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
	const fogMat = new THREE.ShaderMaterial({
		uniforms: {
			uColor: { value: new THREE.Color('#334466') },
			uCameraY: { value: 1.5 }
		},
		vertexShader: /* glsl */ `
			varying vec3 vWorldPos;
			varying float vHeight;
			void main() {
				vec4 worldPos = modelMatrix * vec4(position, 1.0);
				vWorldPos = worldPos.xyz;
				vHeight = position.y;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
		`,
		fragmentShader: /* glsl */ `
			varying vec3 vWorldPos;
			varying float vHeight;
			uniform vec3 uColor;
			uniform float uCameraY;
			void main() {
				float h = max(vHeight, 0.0);
				float alpha = smoothstep(0.0, 15.0, h) * 0.5 * smoothstep(0.0, 3.0, uCameraY);
				gl_FragColor = vec4(uColor, alpha);
			}
		`,
		transparent: true,
		depthWrite: false,
		side: THREE.DoubleSide
	});

	// Distant mountains ring
	const mountGeom = new THREE.TorusGeometry(20, 3, 16, 64);
	mountGeom.rotateX(-Math.PI / 2);
	const mountMat = new THREE.MeshStandardMaterial({
		color: '#111122',
		roughness: 0.95,
		flatShading: true
	});
</script>

{#if isLanded}
	<!-- Ground -->
	<T.Mesh geometry={groundGeom} material={groundMat} position={[0, -3, 0]} />

	<!-- Atmosphere dome -->
	<T.Mesh geometry={fogGeom} material={fogMat} position={[0, -3, 0]} />

	<!-- Distant mountains -->
	<T.Mesh geometry={mountGeom} material={mountMat} position={[0, -2, 0]} />

	<!-- Fog via scene background depth -->
{/if}
