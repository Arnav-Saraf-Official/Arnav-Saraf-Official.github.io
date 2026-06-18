<script lang="ts">
	import { onMount } from 'svelte';
	import { Canvas, T } from '@threlte/core';
	import * as THREE from 'three';
	import type { Snippet } from 'svelte';
	import StarfieldSmall from './StarfieldSmall.svelte';

	let {
		planetName,
		skyColor,
		horizonColor,
		groundColor,
		cloudColor,
		starColor,
		particleColor,
		children
	}: {
		planetName: string;
		skyColor: string;
		horizonColor: string;
		groundColor: string;
		cloudColor: string;
		starColor: string;
		particleColor: string;
		children: Snippet;
	} = $props();

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

	//3d dust field
	type Mote = {
		x: number;
		y: number;
		z: number;
		size: number;
		bright: number;
		phase: number;
		tw: number;
	};
	const MOTE_COUNT = 150;
	const FIELD_DEPTH = 9; // z-span of the field (world units)
	const FIELD_NEAR = 0.16; // closest a mote gets before it recycles
	const FOCAL = 0.85; // perspective focal length (spread strength)
	const field: Mote[] = Array.from({ length: MOTE_COUNT }, () => ({
		x: Math.random() * 2 - 1,
		y: Math.random() * 2 - 1,
		z: Math.random() * FIELD_DEPTH,
		size: 0.45 + Math.random() * 1.4,
		bright: 0.35 + Math.random() * 0.65,
		phase: Math.random() * Math.PI * 2, // twinkle phase offset
		tw: 0.6 + Math.random() * 1.8 // twinkle speed
	}));
	let overlayCanvas = $state<HTMLCanvasElement | null>(null);

	// soft particle sprite, prerendered
	let moteSprite: HTMLCanvasElement | null = null;
	function buildSprite() {
		const c = document.createElement('canvas');
		c.width = c.height = 64;
		const g = c.getContext('2d');
		if (!g) return null;
		const m = particleColor.replace('#', '');
		const hex = m.length === 3
			? m.split('').map((ch) => ch + ch).join('')
			: m;
		const n = parseInt(hex, 16);
		const r = (n >> 16) & 255;
		const gg = (n >> 8) & 255;
		const b = n & 255;

		const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
		const mix = (c: number) => Math.round(c + (255 - c) * 0.55); // tint core toward white
		grad.addColorStop(0, `rgba(${mix(r)},${mix(gg)},${mix(b)},1)`);
		grad.addColorStop(0.08, `rgba(${r},${gg},${b},0.95)`);
		grad.addColorStop(0.22, `rgba(${r},${gg},${b},0.4)`);
		grad.addColorStop(0.5, `rgba(${r},${gg},${b},0.08)`);
		grad.addColorStop(1, `rgba(${r},${gg},${b},0)`);
		g.fillStyle = grad;
		g.fillRect(0, 0, 64, 64);
		return c;
	}

	let driftDepth = 0;

	// RAF: smooth scroll interp + 2D particle overlay draw
	let prevTime = 0;
	$effect(() => {
		let running = true;
		function tick(time: number) {
			if (!running) return;
			const dt = prevTime ? Math.min((time - prevTime) / 1000, 0.1) : 0;
			prevTime = time;
			scrollIndex += (targetScrollIndex - scrollIndex) * Math.min(10 * dt, 1);

			const cvs = overlayCanvas;
			if (cvs) {
				if (!moteSprite) moteSprite = buildSprite();
				// Keep canvas resolution in sync with display size
				if (cvs.width !== cvs.offsetWidth) cvs.width = cvs.offsetWidth;
				if (cvs.height !== cvs.offsetHeight) cvs.height = cvs.offsetHeight;
				const ctx = cvs.getContext('2d');
				if (ctx && moteSprite) {
					const w = cvs.width;
					const h = cvs.height;
					ctx.clearRect(0, 0, w, h);

					// Camera depth: scroll drives the bulk of travel, plus a gentle constant drift
					driftDepth += dt * 0.09;
					const camDepth = scrollIndex * 2.4 + driftDepth;

					const cx = w * 0.5;
					const cy = h * 0.46;
					const spread = Math.min(w, h) * 0.5;
					ctx.globalCompositeOperation = 'lighter';

					for (const p of field) {
						// Wrap depth continuously into [NEAR, NEAR + DEPTH)
						let dz = (((p.z - camDepth - FIELD_NEAR) % FIELD_DEPTH) + FIELD_DEPTH) % FIELD_DEPTH;
						const dn = dz / FIELD_DEPTH; // 0 = at camera, 1 = far
						dz += FIELD_NEAR;

						const s = FOCAL / dz; // perspective scale
						const sx = cx + p.x * spread * s;
						const sy = cy + p.y * spread * s;

						// Depth opacity: fade in from the distance, fade out as it sweeps past
						let op: number;
						if (dn > 0.8) op = (1 - dn) / 0.2;
						else if (dn < 0.07) op = dn / 0.07;
						else op = 1;
						// Twinkle: gentle per-mote brightness flicker so they sparkle like stars
						const twinkle = 0.75 + 0.25 * Math.sin(time * 0.001 * p.tw + p.phase);
						op *= p.bright * 0.55 * twinkle;
						if (op < 0.004) continue;

						const size = p.size * s * 13;
						if (sx < -size || sx > w + size || sy < -size || sy > h + size) continue;

						ctx.globalAlpha = op;
						ctx.drawImage(moteSprite, sx - size * 0.5, sy - size * 0.5, size, size);
					}
					ctx.globalAlpha = 1;
					ctx.globalCompositeOperation = 'source-over';
				}
			}

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

	// Sections styling — depth layers sweeping toward and past the camera
	$effect(() => {
		sections.forEach((section, i) => {
			const d = i - scrollIndex;

			section.style.position = 'fixed';
			section.style.left = '50%';
			section.style.width = 'calc(100% - 32px)';
			section.style.maxWidth = '600px';
			section.style.pointerEvents = Math.abs(d) < 0.15 ? 'auto' : 'none';

			if (d > 1) {
				// Far ahead — tiny invisible speck
				section.style.opacity = '0';
				section.style.transform = 'translate(-50%, -50%) scale(0.06)';
				section.style.top = '38%';
				section.style.filter = 'blur(16px)';
				section.style.visibility = 'hidden';
			} else if (d >= 0) {
				// Approaching: emerges from a distant speck, resolves sharply at d=0
				section.style.visibility = 'visible';
				const t = 1 - d;
				const scale = t < 0.5 ? 0.06 + 0.14 * (t / 0.5) : 0.2 + 0.8 * ((t - 0.5) / 0.5);
				const opacity = t < 0.4 ? 0 : Math.pow((t - 0.4) / 0.6, 1.5);
				const blur = (1 - t) * 14;

				section.style.top = `${36 + 12 * t}%`;
				section.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(3)})`;
				section.style.opacity = `${Math.min(1, opacity).toFixed(3)}`;
				section.style.filter = blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : '';
			} else if (d > -1) {
				// Passing through: grows and fades as camera flies through the layer
				section.style.visibility = 'visible';
				const t = -d;
				const scale = 1.0 + 0.6 * t;
				const opacity = Math.max(0, 1 - t * 1.6);
				const blur = t * 14;

				section.style.top = `${48 + 7 * t}%`;
				section.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(3)})`;
				section.style.opacity = `${opacity.toFixed(3)}`;
				section.style.filter = blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : '';
			} else {
				// Far past — gone behind camera
				section.style.opacity = '0';
				section.style.transform = 'translate(-50%, -50%) scale(1.6)';
				section.style.top = '55%';
				section.style.filter = 'blur(14px)';
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

			<!-- Near ground plane -->
			<T.Mesh position={[0, -6.5, -10]} rotation={[-Math.PI / 2, 0, 0]}>
				<T.PlaneGeometry args={[100, 100]} />
				<T.MeshBasicMaterial color={groundColor} transparent opacity={0.35} depthWrite={false} />
			</T.Mesh>
		</Canvas>
	</div>

	<!-- 2D rock particle overlay — drawn in sync with text section transforms -->
	<canvas bind:this={overlayCanvas} class="particle-overlay"></canvas>

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

	.particle-overlay {
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100%;
		z-index: 4;
		pointer-events: none;
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
		gap: 6px;
		font-family: 'Courier New', monospace;
		font-size: 11px;
		letter-spacing: 3px;
		transition: opacity 0.6s;
		animation: hint-pulse 2.4s ease-in-out infinite;
	}
	.walk-indicator span:first-child {
		color: rgba(200, 230, 255, 0.75);
		text-shadow: 0 0 10px rgba(100, 180, 255, 0.5);
	}
	@keyframes hint-pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.55;
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
