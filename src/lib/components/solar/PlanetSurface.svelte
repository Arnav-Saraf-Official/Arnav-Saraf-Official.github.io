<script lang="ts">
	import { onMount } from 'svelte';
	import { Canvas, T } from '@threlte/core';
	import * as THREE from 'three';
	import type { Snippet } from 'svelte';
	import StarfieldSmall from './StarfieldSmall.svelte';
	import ScrollingTerrain from './ScrollingTerrain.svelte';

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

	// ── Walk state ──
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
		const delta = touchStartY - e.touches[0].clientY;
		touchStartY = e.touches[0].clientY;
		targetScrollIndex += delta * 0.008;
		targetScrollIndex = Math.max(0, Math.min(sections.length - 1, targetScrollIndex));
	}

	onMount(() => {
		const wh = (e: WheelEvent) => onWheel(e);
		const ts = (e: TouchEvent) => onTouchStart(e);
		const tm = (e: TouchEvent) => onTouchMove(e);
		window.addEventListener('wheel', wh, { passive: false });
		window.addEventListener('touchstart', ts, { passive: true });
		window.addEventListener('touchmove', tm, { passive: false });
		return () => {
			window.removeEventListener('wheel', wh);
			window.removeEventListener('touchstart', ts);
			window.removeEventListener('touchmove', tm);
		};
	});

	// ── 2D particle dust field ──
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
	const FIELD_DEPTH = 9;
	const FIELD_NEAR = 0.16;
	const FOCAL = 0.85;
	const field: Mote[] = Array.from({ length: MOTE_COUNT }, () => ({
		x: Math.random() * 2 - 1,
		y: Math.random() * 2 - 1,
		z: Math.random() * FIELD_DEPTH,
		size: 0.45 + Math.random() * 1.4,
		bright: 0.35 + Math.random() * 0.65,
		phase: Math.random() * Math.PI * 2,
		tw: 0.6 + Math.random() * 1.8
	}));

	let overlayCanvas = $state<HTMLCanvasElement | null>(null);
	let moteSprite: HTMLCanvasElement | null = null;

	function buildSprite() {
		const c = document.createElement('canvas');
		c.width = c.height = 64;
		const g = c.getContext('2d');
		if (!g) return null;
		const m = particleColor.replace('#', '');
		const hex =
			m.length === 3
				? m
						.split('')
						.map((ch) => ch + ch)
						.join('')
				: m;
		const n = parseInt(hex, 16);
		const r = (n >> 16) & 255;
		const gg = (n >> 8) & 255;
		const b = n & 255;
		const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
		const mix = (c: number) => Math.round(c + (255 - c) * 0.55);
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
				if (cvs.width !== cvs.offsetWidth) cvs.width = cvs.offsetWidth;
				if (cvs.height !== cvs.offsetHeight) cvs.height = cvs.offsetHeight;
				const ctx = cvs.getContext('2d');
				if (ctx && moteSprite) {
					const w = cvs.width;
					const h = cvs.height;
					ctx.clearRect(0, 0, w, h);
					driftDepth += dt * 0.09;
					const camDepth = scrollIndex * 2.4 + driftDepth;
					const cx = w * 0.5;
					const cy = h * 0.46;
					const spread = Math.min(w, h) * 0.5;
					ctx.globalCompositeOperation = 'lighter';
					for (const p of field) {
						let dz = (((p.z - camDepth - FIELD_NEAR) % FIELD_DEPTH) + FIELD_DEPTH) % FIELD_DEPTH;
						const dn = dz / FIELD_DEPTH;
						dz += FIELD_NEAR;
						const s = FOCAL / dz;
						const sx = cx + p.x * spread * s;
						const sy = cy + p.y * spread * s;
						let op: number;
						if (dn > 0.8) op = (1 - dn) / 0.2;
						else if (dn < 0.07) op = dn / 0.07;
						else op = 1;
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

	// ── Query sections ──
	$effect(() => {
		if (contentContainer) {
			sections = Array.from(contentContainer.querySelectorAll('section'));
		}
	});

	// ── Camera: fixed position, terrain scrolls past ──
	$effect(() => {
		if (cameraRef) {
			cameraRef.position.set(0, 3, 8);
			cameraRef.lookAt(0, -1.5, -10);
		}
	});

	// ── Section transforms — light blur ──
	const MAX_BLUR = 3;
	const FAR_BLUR = 5;

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
				section.style.transform = 'translate(-50%, -50%) scale(0.06)';
				section.style.top = '38%';
				section.style.filter = `blur(${FAR_BLUR}px)`;
				section.style.visibility = 'hidden';
			} else if (d >= 0) {
				section.style.visibility = 'visible';
				const t = 1 - d;
				const scale = t < 0.5 ? 0.06 + 0.14 * (t / 0.5) : 0.2 + 0.8 * ((t - 0.5) / 0.5);
				const opacity = t < 0.4 ? 0 : Math.pow((t - 0.4) / 0.6, 1.5);
				const blur = (1 - t) * MAX_BLUR;
				section.style.top = `${36 + 12 * t}%`;
				section.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(3)})`;
				section.style.opacity = `${Math.min(1, opacity).toFixed(3)}`;
				section.style.filter = blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : '';
			} else if (d > -1) {
				section.style.visibility = 'visible';
				const t = -d;
				const scale = 1.0 + 0.6 * t;
				const opacity = Math.max(0, 1 - t * 1.6);
				const blur = t * MAX_BLUR;
				section.style.top = `${48 + 7 * t}%`;
				section.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(3)})`;
				section.style.opacity = `${opacity.toFixed(3)}`;
				section.style.filter = blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : '';
			} else {
				section.style.opacity = '0';
				section.style.transform = 'translate(-50%, -50%) scale(1.6)';
				section.style.top = '55%';
				section.style.filter = `blur(${MAX_BLUR}px)`;
				section.style.visibility = 'hidden';
			}
		});
	});

	// ── Cloud particles ──
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

	// ════════════════════════════════════════
	// CANYON TERRAIN — level plain, rocky cliffs on sides
	// ════════════════════════════════════════
	const PLAIN_HALF = 6;
	const CLIFF_START = 9;
	const CLIFF_FULL = 14;
	const TERRAIN_W = 44;
	const TERRAIN_L = 320;
	const SEGS_X = 64;
	const SEGS_Z = 200;

	const terrainGeom = new THREE.PlaneGeometry(TERRAIN_W, TERRAIN_L, SEGS_X, SEGS_Z);
	const tPos = terrainGeom.getAttribute('position');
	for (let i = 0; i < tPos.count; i++) {
		const x = tPos.getX(i);
		const z = tPos.getY(i); // becomes world Z after rotateX

		const ax = Math.abs(x);
		let cliff: number;
		if (ax < PLAIN_HALF) {
			cliff = 0.01;
		} else if (ax < CLIFF_START) {
			const t = (ax - PLAIN_HALF) / (CLIFF_START - PLAIN_HALF);
			cliff = 0.01 + 0.14 * t;
		} else if (ax < CLIFF_FULL) {
			const t = (ax - CLIFF_START) / (CLIFF_FULL - CLIFF_START);
			cliff = 0.15 + 0.85 * t * t;
		} else {
			cliff = 1.0;
		}

		const h =
			cliff *
			(Math.sin(x * 0.32 + z * 0.08) * 5.0 +
				Math.cos(x * 0.22 + z * 0.11) * 3.5 +
				Math.sin(z * 0.06) * 3.0 +
				Math.cos(x * 0.55 + z * 0.04) * 2.2 +
				Math.sin(x * 0.85) * Math.cos(z * 0.22) * 1.8 +
				(cliff > 0.4 ? Math.sin(x * 1.3 + z * 0.55) * 1.6 + Math.cos(x * 0.7 + z * 0.3) * 1.2 : 0));

		tPos.setZ(i, h);
	}
	terrainGeom.computeVertexNormals();
	terrainGeom.rotateX(-Math.PI / 2);

	const groundC = new THREE.Color(groundColor);
	const terrainMat = new THREE.MeshStandardMaterial({
		color: groundC,
		roughness: 0.72,
		metalness: 0.08,
		flatShading: true,
		emissive: groundC,
		emissiveIntensity: 0.4
	});

	// ── Rocks scattered on cliff sides ──
	interface Rock {
		x: number;
		z: number;
		y: number;
		sx: number;
		sy: number;
		sz: number;
		rx: number;
		ry: number;
		rz: number;
		color: string;
	}
	const ROCKS_PER_SIDE = 30;
	const rocks: Rock[] = [];
	for (let side = -1; side <= 1; side += 2) {
		for (let i = 0; i < ROCKS_PER_SIDE; i++) {
			const z = (Math.random() - 0.5) * TERRAIN_L * 0.88;
			const x = side * (CLIFF_START + Math.random() * (TERRAIN_W / 2 - CLIFF_START - 1));
			const size = 0.5 + Math.random() * 3.2;
			const rc = groundC.clone();
			rc.r = Math.max(0, Math.min(1, rc.r + (Math.random() - 0.5) * 0.18));
			rc.g = Math.max(0, Math.min(1, rc.g + (Math.random() - 0.5) * 0.18));
			rc.b = Math.max(0, Math.min(1, rc.b + (Math.random() - 0.5) * 0.18));
			rocks.push({
				x,
				z,
				y: -3.2 + Math.random() * 2.0,
				sx: size * (0.4 + Math.random() * 0.7),
				sy: size * (0.25 + Math.random() * 0.85),
				sz: size * (0.4 + Math.random() * 0.7),
				rx: Math.random() * Math.PI * 0.45,
				ry: Math.random() * Math.PI * 2,
				rz: Math.random() * Math.PI * 0.45,
				color: `#${rc.getHexString()}`
			});
		}
	}

	// ── Atmosphere fog dome ──
	const fogGeom = new THREE.SphereGeometry(45, 48, 48, 0, Math.PI * 2, 0, Math.PI / 2);
	const fogMat = new THREE.MeshBasicMaterial({
		color: horizonColor,
		transparent: true,
		opacity: 0.18,
		depthWrite: false,
		side: THREE.DoubleSide
	});

	let progress = $derived(sections.length > 0 ? scrollIndex / (sections.length - 1) : 0);
</script>

<div
	class="planet-surface-root planet-page"
	style="--sky-color: {skyColor}; --horizon-color: {horizonColor}; --ground-color: {groundColor};"
>
	<!-- 3D atmosphere -->
	<div class="bg-canvas">
		<Canvas>
			<T.PerspectiveCamera makeDefault position={[0, 3, 8]} fov={60} bind:ref={cameraRef} />

			<T.AmbientLight intensity={0.7} />
			<T.DirectionalLight position={[15, 25, 5]} intensity={1.6} />

			<StarfieldSmall color={starColor} />
			<T.Points geometry={cloudGeom} material={cloudMat} />
			<T.Mesh geometry={fogGeom} material={fogMat} position={[0, -5, -10]} />

			<ScrollingTerrain
				{scrollIndex}
				{terrainGeom}
				{terrainMat}
				{rocks}
				{groundColor}
				terrainW={TERRAIN_W}
				terrainL={TERRAIN_L}
			/>
		</Canvas>
	</div>

	<!-- 2D particle overlay -->
	<canvas bind:this={overlayCanvas} class="particle-overlay"></canvas>

	<!-- Navigation -->
	<nav class="planet-nav">
		<a href="/" class="nav-link orbit-link" rel="external">&#x2190; RETURN TO ORBIT</a>
	</nav>

	<!-- HUD title -->
	<div class="planet-hud-title">{planetName} STATION</div>

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
