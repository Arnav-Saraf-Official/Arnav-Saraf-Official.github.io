<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { Canvas, T, useThrelte } from '@threlte/core';
	import * as THREE from 'three';
	import { endCutscene } from '$lib/stores/cutscene.svelte';

	interface Props {
		planetRoute: string;
		planetColor: string;
		planetName: string;
	}

	let { planetRoute, planetColor, planetName }: Props = $props();

	let rocketRef = $state<THREE.Group | undefined>(undefined);
	let overlayOpacity = $state(1);
	let bgColor = $state('#000008');
	let elapsed = $state(0);
	const DURATION = 3.0;

	onMount(() => {
		let startTime = performance.now();
		let animId: number;

		async function tick(now: number) {
			const dt = (now - startTime) / 1000;
			startTime = now;
			elapsed += dt;
			const t = Math.min(elapsed / DURATION, 1);

			// Rocket descends from high altitude
			if (rocketRef) {
				const y = 8 - t * 10;
				const wobble = Math.sin(t * 8) * (1 - t) * 0.3;
				rocketRef.position.set(wobble, y, Math.cos(t * 5) * (1 - t) * 0.2);
				rocketRef.rotation.z = wobble * 0.5;
			}

			// White overlay: quick fade in first 0.15s (re-entry flash)
			if (t < 0.15) {
				overlayOpacity = 1;
			} else if (t < 0.4) {
				const at = (t - 0.15) / 0.25;
				overlayOpacity = 1 - at;
			} else {
				overlayOpacity = 0;
			}

			// Background color transition: space → atmosphere → surface
			const nextBg = new THREE.Color('#000008');
			if (t < 0.35) {
				const at = t / 0.35;
				nextBg.lerp(new THREE.Color(planetColor), at * 0.4);
			} else if (t < 0.65) {
				const at = (t - 0.35) / 0.3;
				nextBg.copy(new THREE.Color(planetColor)).lerp(new THREE.Color('#ff6622'), at * 0.5);
			} else if (t < 0.9) {
				const at = (t - 0.65) / 0.25;
				nextBg.copy(new THREE.Color('#ff6622')).lerp(new THREE.Color(planetColor), at);
			} else {
				nextBg.copy(new THREE.Color(planetColor));
			}
			bgColor = '#' + nextBg.getHexString();

			if (t >= 1) {
				// eslint-disable-next-line svelte/no-navigation-without-resolve
				goto(planetRoute);
				return;
			}

			animId = requestAnimationFrame(tick);
		}

		animId = requestAnimationFrame(tick);
		return () => {
			cancelAnimationFrame(animId);
			endCutscene();
		};
	});

	const rocketGeom1 = new THREE.CylinderGeometry(0.15, 0.25, 1.2, 12);
	const rocketMat1 = new THREE.MeshBasicMaterial({ color: '#dddddd' });
	const rocketGeom2 = new THREE.ConeGeometry(0.15, 0.4, 12);
	const rocketMat2 = new THREE.MeshBasicMaterial({ color: '#ee3333' });
	const rocketGeom3 = new THREE.CylinderGeometry(0.1, 0.2, 0.2, 12);
	const rocketMat3 = new THREE.MeshBasicMaterial({ color: '#333333' });

	const plumeGeom = new THREE.SphereGeometry(0.04, 4, 4);
	const plumeMat = new THREE.MeshBasicMaterial({
		color: '#ff8800',
		transparent: true,
		opacity: 0.8
	});
</script>

<!-- Background driven by a colored div behind the canvas -->
<div class="cutscene-bg" style:background-color={bgColor}></div>

<!-- 3D scene rendered ABOVE the background -->
<div class="cutscene-canvas">
	<Canvas>
		<T.PerspectiveCamera makeDefault position={[0, 0, 6]} fov={50} />
		<T.AmbientLight intensity={0.8} />

		<T.Group bind:ref={rocketRef}>
			<T.Mesh geometry={rocketGeom1} material={rocketMat1} position={[0, 0, 0]} />
			<T.Mesh geometry={rocketGeom2} material={rocketMat2} position={[0, 0.8, 0]} />
			<T.Mesh geometry={rocketGeom3} material={rocketMat3} position={[0, -0.7, 0]} />

			<T.Group position={[0, -1, 0]}>
				{#each [0, 1, 2, 3, 4, 5, 6, 7] as i (i)}
					{@const angle = (i / 8) * Math.PI * 2}
					<T.Mesh
						geometry={plumeGeom}
						material={plumeMat}
						position={[Math.cos(angle) * 0.2, -0.1 - Math.random() * 0.5, Math.sin(angle) * 0.2]}
					/>
				{/each}
			</T.Group>
		</T.Group>
	</Canvas>
</div>

<!-- White flash overlay -->
<div class="cutscene-overlay" style:opacity={overlayOpacity}>
	<div class="cutscene-label">
		LANDING AT {planetName}...
	</div>
</div>

<style>
	.cutscene-bg {
		position: fixed;
		inset: 0;
		z-index: 38;
		transition: background-color 0.05s linear;
	}
	.cutscene-overlay {
		position: fixed;
		inset: 0;
		z-index: 39;
		pointer-events: none;
		background: white;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		padding-bottom: 60px;
	}
	.cutscene-label {
		font-family: 'Courier New', monospace;
		font-size: 12px;
		letter-spacing: 4px;
		color: rgba(0, 0, 0, 0.5);
	}
	.cutscene-canvas {
		position: fixed;
		inset: 0;
		z-index: 40;
		background: transparent;
	}
	.cutscene-canvas :global(canvas) {
		width: 100% !important;
		height: 100% !important;
		background: transparent !important;
	}
</style>
