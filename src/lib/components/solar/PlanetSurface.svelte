<script lang="ts">
	import { onMount } from 'svelte';
	import { Canvas, T } from '@threlte/core';
	import type { Snippet } from 'svelte';
	import * as THREE from 'three';
	import StarfieldSmall from './StarfieldSmall.svelte';

	interface Props {
		planetName: string;
		skyColor: string;
		horizonColor: string;
		groundColor: string;
		cloudColor: string;
		starColor: string;
		particleColor: string;
		children: Snippet;
	}

	let {
		planetName,
		skyColor,
		horizonColor,
		groundColor,
		cloudColor,
		starColor,
		particleColor,
		children
	}: Props = $props();

	let cameraRef = $state<THREE.PerspectiveCamera | undefined>(undefined);

	// Walk state — scroll drives forward movement
	let sections = $state<HTMLElement[]>([]);
	let contentContainer = $state<HTMLElement | null>(null);
	let scrollIndex = $state(0);
	let targetScrollIndex = $state(0);

	function onWheel(e: WheelEvent) {
		if (sections.length === 0) return;
		e.preventDefault();
		targetScrollIndex += e.deltaY * 0.003;
		targetScrollIndex = Math.max(0, Math.min(sections.length - 1, targetScrollIndex));
	}

	let touchStartY = 0;
	function onTouchStart(e: TouchEvent) {
		touchStartY = e.touches[0].clientY;
	}

	function onTouchMove(e: TouchEvent) {
		if (sections.length === 0) return;
		const touchY = e.touches[0].clientY;
		const deltaY = touchStartY - touchY;
		touchStartY = touchY;
		targetScrollIndex += deltaY * 0.008;
		targetScrollIndex = Math.max(0, Math.min(sections.length - 1, targetScrollIndex));
	}

	onMount(() => {
		const wheelHandler = (e: WheelEvent) => onWheel(e);
		const touchStartHandler = (e: TouchEvent) => onTouchStart(e);
		const touchMoveHandler = (e: TouchEvent) => onTouchMove(e);

		window.addEventListener('wheel', wheelHandler, { passive: false });
		window.addEventListener('touchstart', touchStartHandler, { passive: true });
		window.addEventListener('touchmove', touchMoveHandler, { passive: false });

		return () => {
			window.removeEventListener('wheel', wheelHandler);
			window.removeEventListener('touchstart', touchStartHandler);
			window.removeEventListener('touchmove', touchMoveHandler);
		};
	});

	// Smooth interpolation
	let prevTime = 0;
	$effect(() => {
		let running = true;
		function tick(time: number) {
			if (!running) return;
			const dt = prevTime ? Math.min((time - prevTime) / 1000, 0.1) : 0;
			prevTime = time;
			scrollIndex += (targetScrollIndex - scrollIndex) * Math.min(10 * dt, 1);
			requestAnimationFrame(tick);
		}
		requestAnimationFrame(tick);
		return () => {
			running = false;
		};
	});

	// Query section tags
	$effect(() => {
		if (contentContainer) {
			sections = Array.from(contentContainer.querySelectorAll('section'));
		}
	});

	// Camera movement
	let cameraZ = $derived(8 - scrollIndex * 15);
	$effect(() => {
		if (cameraRef) {
			cameraRef.position.z = cameraZ;
			cameraRef.position.y = 3 + Math.sin(scrollIndex * Math.PI) * 0.15;
			cameraRef.lookAt(0, -1.5, cameraZ - 10);
		}
	});

	// Sections styling
	$effect(() => {
		sections.forEach((section, i) => {
			const d = i - scrollIndex;

			section.style.position = 'fixed';
			section.style.left = '50%';
			section.style.width = 'calc(100% - 32px)';
			section.style.maxWidth = '600px';
			section.style.pointerEvents = Math.abs(d) < 0.15 ? 'auto' : 'none';

			if (d > 1) {
				section.style.opacity = '0';
				section.style.transform = 'translate(-50%, -50%) scale(0.1)';
				section.style.top = '40%';
				section.style.filter = 'blur(10px)';
				section.style.visibility = 'hidden';
			} else if (d >= 0) {
				section.style.visibility = 'visible';
				const t = 1 - d;
				const scale = 0.25 + 0.75 * t;
				const opacity = t;
				const top = 40 + 8 * t;

				section.style.top = `${top}%`;
				section.style.transform = `translate(-50%, -50%) scale(${scale})`;
				section.style.opacity = `${opacity}`;
				section.style.filter = `blur(${(1 - t) * 6}px)`;
			} else if (d > -1) {
				section.style.visibility = 'visible';
				const t = -d;
				const scale = 1.0 + 3.0 * t;
				const opacity = Math.max(0, 1 - t * 1.5);
				const top = 48 + 12 * t;

				section.style.top = `${top}%`;
				section.style.transform = `translate(-50%, -50%) scale(${scale})`;
				section.style.opacity = `${opacity}`;
				section.style.filter = `blur(${t * 12}px)`;
			} else {
				section.style.opacity = '0';
				section.style.transform = 'translate(-50%, -50%) scale(4)';
				section.style.top = '60%';
				section.style.filter = 'blur(16px)';
				section.style.visibility = 'hidden';
			}
		});
	});

	// Cloud particles
	const cloudCount = 50;
	const cloudPositions = new Float32Array(cloudCount * 3);
	for (let i = 0; i < cloudCount; i++) {
		cloudPositions[i * 3] = (Math.random() - 0.5) * 40;
		cloudPositions[i * 3 + 1] = 5 + Math.random() * 14;
		cloudPositions[i * 3 + 2] = (Math.random() - 0.5) * 60 - 30;
	}
	const cloudGeom = new THREE.BufferGeometry();
	cloudGeom.setAttribute('position', new THREE.BufferAttribute(cloudPositions, 3));
	const cloudMat = new THREE.PointsMaterial({
		color: cloudColor,
		size: 1.5,
		transparent: true,
		opacity: 0.08,
		sizeAttenuation: true,
		depthWrite: false,
		blending: THREE.AdditiveBlending
	});

	// Floating dust
	const dustCount = 120;
	const dustPositions = new Float32Array(dustCount * 3);
	for (let i = 0; i < dustCount; i++) {
		dustPositions[i * 3] = (Math.random() - 0.5) * 20;
		dustPositions[i * 3 + 1] = Math.random() * 6;
		dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 60 - 10;
	}
	const dustGeom = new THREE.BufferGeometry();
	dustGeom.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
	const dustMat = new THREE.PointsMaterial({
		color: particleColor,
		size: 0.08,
		transparent: true,
		opacity: 0.5,
		sizeAttenuation: true,
		depthWrite: false
	});

	// Terrain — flat-shaded standard material
	const terrainGeom = new THREE.PlaneGeometry(120, 120, 80, 80);
	const tPos = terrainGeom.getAttribute('position');
	for (let i = 0; i < tPos.count; i++) {
		const x = tPos.getX(i);
		const y = tPos.getY(i);
		const h =
			(Math.sin(x * 0.12) * Math.cos(y * 0.12) * 3.2 +
				Math.sin(x * 0.3) * Math.cos(y * 0.3) * 1.2 +
				Math.cos(x * 0.6) * Math.sin(y * 0.6) * 0.5) *
			1.5;
		tPos.setZ(i, h);
	}
	terrainGeom.computeVertexNormals();
	terrainGeom.rotateX(-Math.PI / 2);

	const groundColorThree = new THREE.Color(groundColor);
	const terrainMat = new THREE.MeshStandardMaterial({
		color: groundColorThree,
		roughness: 0.75,
		metalness: 0.1,
		flatShading: true,
		emissive: groundColorThree,
		emissiveIntensity: 0.15
	});

	// Atmosphere fog dome
	const fogGeom = new THREE.SphereGeometry(45, 48, 48, 0, Math.PI * 2, 0, Math.PI / 2);
	const fogMat = new THREE.MeshBasicMaterial({
		color: horizonColor,
		transparent: true,
		opacity: 0.18,
		depthWrite: false,
		side: THREE.DoubleSide
	});

	// Walk progress
	let progress = $derived(sections.length > 0 ? scrollIndex / (sections.length - 1) : 0);
</script>

<div
	class="planet-surface-root planet-page"
	style="--sky-color: {skyColor}; --horizon-color: {horizonColor}; --ground-color: {groundColor};"
>
	<!-- 3D atmosphere background -->
	<div class="bg-canvas">
		<Canvas>
			<T.PerspectiveCamera makeDefault position={[0, 3, 8]} fov={60} bind:ref={cameraRef} />

			<!-- Lights for StandardMaterial terrain -->
			<T.AmbientLight intensity={0.4} />
			<T.DirectionalLight position={[15, 25, 5]} intensity={1.6} />

			<!-- Stars -->
			<StarfieldSmall color={starColor} />

			<!-- Clouds -->
			<T.Points geometry={cloudGeom} material={cloudMat} />

			<!-- Atmosphere dome -->
			<T.Mesh geometry={fogGeom} material={fogMat} position={[0, -5, -10]} />

			<!-- Terrain -->
			<T.Mesh geometry={terrainGeom} material={terrainMat} position={[0, -5, -10]} />

			<!-- Dust particles -->
			<T.Points geometry={dustGeom} material={dustMat} />

			<!-- Near ground plane -->
			<T.Mesh position={[0, -6.5, -10]} rotation={[-Math.PI / 2, 0, 0]}>
				<T.PlaneGeometry args={[100, 100]} />
				<T.MeshBasicMaterial color={groundColor} transparent opacity={0.35} depthWrite={false} />
			</T.Mesh>
		</Canvas>
	</div>

	<!-- Navigation -->
	<nav class="planet-nav">
		<a href="/" class="nav-link orbit-link" rel="external">&#x2190; RETURN TO ORBIT</a>
	</nav>

	<!-- Title HUD -->
	<div class="planet-hud-title">
		{planetName} STATION
	</div>

	<!-- Scroll hint -->
	<div class="walk-indicator" style:opacity={Math.max(0, 1 - progress * 2.5)}>
		<span>SCROLL TO EXPLORE</span>
		<span class="walk-arrow">&darr;</span>
	</div>

	<!-- Content -->
	<main bind:this={contentContainer} class="planet-content">
		{@render children()}
	</main>
</div>

<style>
	.planet-page {
		min-height: 100vh;
		position: relative;
		overflow: hidden;
		background: linear-gradient(
			to bottom,
			var(--sky-color) 0%,
			var(--horizon-color) 50%,
			var(--ground-color) 85%,
			#050810 100%
		);
	}

	.bg-canvas {
		position: fixed;
		inset: 0;
		z-index: 0;
		pointer-events: none;
	}
	.bg-canvas :global(canvas) {
		width: 100% !important;
		height: 100% !important;
		pointer-events: none !important;
	}

	.planet-nav {
		position: fixed;
		top: 24px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 10;
	}

	.orbit-link {
		font-family: 'Courier New', monospace;
		font-size: 11px;
		letter-spacing: 2px;
		color: rgba(200, 230, 255, 0.45);
		text-decoration: none;
		transition:
			color 0.3s,
			text-shadow 0.3s;
	}
	.orbit-link:hover {
		color: rgba(200, 230, 255, 0.9);
		text-shadow: 0 0 12px rgba(150, 200, 255, 0.5);
	}

	.planet-hud-title {
		position: fixed;
		top: 80px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 10;
		font-family: 'Courier New', monospace;
		font-size: 14px;
		letter-spacing: 6px;
		color: rgba(200, 230, 255, 0.65);
		text-shadow: 0 0 10px rgba(0, 200, 255, 0.4);
		pointer-events: none;
		text-transform: uppercase;
	}

	.walk-indicator {
		position: fixed;
		bottom: 40px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 10;
		pointer-events: none;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		font-family: 'Courier New', monospace;
		font-size: 11px;
		color: rgba(200, 230, 255, 0.3);
		letter-spacing: 3px;
		transition: opacity 0.5s;
	}
	.walk-arrow {
		animation: bounce-arrow 1.5s ease-in-out infinite;
		font-size: 14px;
	}
	@keyframes bounce-arrow {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(6px);
		}
	}

	.planet-content {
		position: fixed;
		inset: 0;
		z-index: 5;
		pointer-events: none;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
