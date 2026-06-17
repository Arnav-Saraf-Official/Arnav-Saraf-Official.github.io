<script lang="ts">
	import { onMount } from 'svelte';
	import { Canvas } from '@threlte/core';
	import { T } from '@threlte/core';
	import * as THREE from 'three';
	import { advanceFromLaunch } from '$lib/stores/phase.svelte';
	import { initAudio, playLaunchMusic, stopLaunchMusic } from '$lib/stores/audio.svelte';
	import LaunchSkipButton from './LaunchSkipButton.svelte';

	// --- Refs ---
	let rocketGroup = $state<THREE.Group | undefined>(undefined);
	let boosterLeft = $state<THREE.Mesh | undefined>(undefined);
	let boosterRight = $state<THREE.Mesh | undefined>(undefined);
	let cameraRef = $state<THREE.PerspectiveCamera | undefined>(undefined);
	let plumeGroup = $state<THREE.Group | undefined>(undefined);
	let sceneBackground = $state(new THREE.Color('#87ceeb'));
	let earthRef = $state<THREE.Mesh | undefined>(undefined);
	let overlayOpacity = $state(0);

	// --- Timeline (8 seconds) ---
	let elapsed = $state(0);
	let started = $state(false);

	// Sky transition colors
	const skyStart = new THREE.Color('#87ceeb'); // light blue
	const skyMid = new THREE.Color('#2a1060'); // purple
	const skyEnd = new THREE.Color('#000008'); // near black

	// Rocket trajectory
	const rocketStartY = -6;
	const rocketOrbitY = 35;

	// Camera positions
	const camStart = new THREE.Vector3(2, -4, 10);
	const camMid = new THREE.Vector3(3, 8, 8);
	const camOrbit = new THREE.Vector3(0, 18, 25);

	function lerp(a: number, b: number, t: number): number {
		return a + (b - a) * t;
	}

	function lerpV3(
		out: THREE.Vector3,
		a: THREE.Vector3,
		b: THREE.Vector3,
		t: number
	): THREE.Vector3 {
		return out.set(lerp(a.x, b.x, t), lerp(a.y, b.y, t), lerp(a.z, b.z, t));
	}

	function easeInOut(t: number): number {
		return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
	}

	function clamp(t: number): number {
		return Math.max(0, Math.min(1, t));
	}

	onMount(() => {
		// Start after a tiny delay for canvas setup
		const startTimer = setTimeout(() => {
			started = true;
			initAudio();
			playLaunchMusic();
		}, 300);

		return () => clearTimeout(startTimer);
	});

	let animFrameId: number;

	$effect(() => {
		if (!started) return;
		let prevTime = performance.now();

		function tick(now: number) {
			const dt = (now - prevTime) / 1000;
			prevTime = now;
			elapsed += dt;

			const t = elapsed;
			const duration = 8.0;

			// --- Phase 1: Ignition (0 - 0.5s) ---
			const ignitionT = clamp(t / 0.5);

			// --- Phase 4: Staging + orbit (5 - 7s) ---
			const orbitT = clamp((t - 5.0) / 2.0);

			// --- Phase 5: Whiteout (7 - 8s) ---
			const whiteoutT = clamp((t - 7.0) / 1.0);

			// --- Apply to rocket ---
			if (rocketGroup) {
				if (t < 5.0) {
					// Ascent phase
					const y = lerp(rocketStartY, rocketOrbitY, easeInOut(clamp(t / 5.0)));
					rocketGroup.position.set(0, y, 0);
					rocketGroup.rotation.set(0, 0, 0);
					rocketGroup.scale.setScalar(lerp(1, 0.5, clamp((t - 3) / 2)));
				} else {
					// Orbit phase — gentle drift
					const driftY = rocketOrbitY + Math.sin(t * 0.3) * 0.3;
					rocketGroup.position.set(Math.sin(t * 0.2) * 0.5, driftY, Math.cos(t * 0.2) * 0.5);
				}

				// Ignition shake
				if (t < 0.5) {
					const shake = (1 - ignitionT) * 0.15;
					rocketGroup.position.x += Math.sin(t * 60) * shake;
				}
			}

			// --- Apply to boosters ---
			if (t >= 4.0 && t < 6.0) {
				const sep = easeInOut(clamp((t - 4.0) / 1.5));
				if (boosterLeft) {
					boosterLeft.position.set(-1.2 - sep * 6, -1.5 - sep * 3, sep * 2);
					boosterLeft.rotation.z = sep * 2;
				}
				if (boosterRight) {
					boosterRight.position.set(1.2 + sep * 6, -1.5 - sep * 3, sep * 2);
					boosterRight.rotation.z = -sep * 2;
				}
			}

			// --- Apply to camera ---
			if (cameraRef) {
				if (t < 5.0) {
					const camT = easeInOut(clamp(t / 5.0));
					const pos = new THREE.Vector3();
					lerpV3(pos, camStart, camMid, clamp(camT * 2));
					if (camT > 0.5) {
						lerpV3(pos, camMid, camOrbit, clamp((camT - 0.5) * 2));
					}
					cameraRef.position.copy(pos);
					cameraRef.lookAt(0, rocketGroup ? rocketGroup.position.y : 0, 0);
				} else {
					// Pull back for orbit view
					const pullBack = easeInOut(orbitT);
					const pos = new THREE.Vector3();
					lerpV3(pos, camOrbit, new THREE.Vector3(0, 20, 30), pullBack);
					cameraRef.position.copy(pos);
					cameraRef.lookAt(0, 20, 0);

					// FOV stretch for whiteout
					if (t > 7.0) {
						cameraRef.fov = lerp(60, 120, whiteoutT);
						cameraRef.updateProjectionMatrix();
					}
				}
			}

			// --- Background color ---
			const nextBg = new THREE.Color();
			if (t < 3.5) {
				nextBg.copy(skyStart).lerp(skyMid, clamp(t / 3.5));
			} else if (t < 5.0) {
				nextBg.copy(skyMid).lerp(skyEnd, clamp((t - 3.5) / 1.5));
			} else {
				nextBg.copy(skyEnd);
			}
			sceneBackground = nextBg;

			// --- Whiteout overlay ---
			if (t >= 7.0) {
				overlayOpacity = whiteoutT;
			}

			// --- Plume ---
			if (plumeGroup) {
				if (t < 5.0) {
					plumeGroup.visible = true;
				} else {
					plumeGroup.visible = false;
				}
			}

			// --- Earth visibility ---
			if (earthRef) {
				earthRef.visible = t > 4.0;
			}

			// --- Complete ---
			if (t >= duration) {
				stopLaunchMusic();
				advanceFromLaunch();
				return;
			}

			animFrameId = requestAnimationFrame(tick);
		}

		animFrameId = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(animFrameId);
	});
</script>

<LaunchSkipButton />

<!-- Whiteout overlay -->
<div
	style="position: fixed; inset: 0; z-index: 50; pointer-events: none; background: white; transition: none;"
	style:opacity={overlayOpacity}
></div>

<Canvas scene={{ background: sceneBackground }}>
	<T.PerspectiveCamera
		makeDefault
		position={[2, -4, 10]}
		fov={60}
		bind:ref={cameraRef}
	/>
	<!-- Earth (appears at orbit) -->
	<T.Mesh bind:ref={earthRef} visible={false} position={{ x: 10, y: -15, z: -30 }}>
		<T.SphereGeometry args={[8, 48, 48]} />
		<T.MeshStandardMaterial color="#2266cc" roughness={0.7} />
	</T.Mesh>

	<!-- Atmosphere ring around Earth -->
	<T.Mesh visible={false} position={{ x: 10, y: -15, z: -30 }}>
		<T.SphereGeometry args={[8.15, 48, 48]} />
		<T.MeshBasicMaterial color="#4488ff" transparent opacity={0.15} />
	</T.Mesh>

	<!-- Ambient light -->
	<T.AmbientLight intensity={0.5} />
	<T.DirectionalLight position={{ x: 5, y: 10, z: 2 }} intensity={1.5} />

	<!-- Rocket -->
	<T.Group bind:ref={rocketGroup}>
		<!-- Main body -->
		<T.Mesh position={{ x: 0, y: 0, z: 0 }}>
			<T.CylinderGeometry args={[0.25, 0.4, 2.2, 16]} />
			<T.MeshStandardMaterial color="#dddddd" metalness={0.7} roughness={0.3} />
		</T.Mesh>

		<!-- Nose cone -->
		<T.Mesh position={{ x: 0, y: 1.3, z: 0 }}>
			<T.ConeGeometry args={[0.25, 0.7, 16]} />
			<T.MeshStandardMaterial color="#ee3333" metalness={0.3} roughness={0.5} />
		</T.Mesh>

		<!-- Engine nozzle -->
		<T.Mesh position={{ x: 0, y: -1.3, z: 0 }}>
			<T.CylinderGeometry args={[0.2, 0.35, 0.3, 16]} />
			<T.MeshStandardMaterial color="#333333" metalness={0.9} roughness={0.2} />
		</T.Mesh>

		<!-- Fins -->
		<T.Mesh position={{ x: 0.35, y: -0.8, z: 0 }} rotation={{ x: 0, y: 0, z: 0.15 }}>
			<T.BoxGeometry args={[0.08, 0.6, 0.2]} />
			<T.MeshStandardMaterial color="#cccccc" metalness={0.5} roughness={0.4} />
		</T.Mesh>
		<T.Mesh position={{ x: -0.35, y: -0.8, z: 0 }} rotation={{ x: 0, y: 0, z: -0.15 }}>
			<T.BoxGeometry args={[0.08, 0.6, 0.2]} />
			<T.MeshStandardMaterial color="#cccccc" metalness={0.5} roughness={0.4} />
		</T.Mesh>
		<T.Mesh position={{ x: 0, y: -0.8, z: 0.35 }}>
			<T.BoxGeometry args={[0.08, 0.6, 0.2]} />
			<T.MeshStandardMaterial color="#cccccc" metalness={0.5} roughness={0.4} />
		</T.Mesh>

		<!-- Boosters -->
		<T.Mesh bind:ref={boosterLeft} position={{ x: -1.2, y: -1.5, z: 0 }}>
			<T.CylinderGeometry args={[0.12, 0.18, 1.4, 12]} />
			<T.MeshStandardMaterial color="#ff8844" metalness={0.4} roughness={0.5} />
		</T.Mesh>
		<T.Mesh bind:ref={boosterRight} position={{ x: 1.2, y: -1.5, z: 0 }}>
			<T.CylinderGeometry args={[0.12, 0.18, 1.4, 12]} />
			<T.MeshStandardMaterial color="#ff8844" metalness={0.4} roughness={0.5} />
		</T.Mesh>

		<!-- Plume particles -->
		<T.Group bind:ref={plumeGroup}>
			{#each [...Array(30).keys()] as i (i)}
				{@const angle = (i / 30) * Math.PI * 2}
				{@const radius = 0.1 + Math.random() * 0.2}
				<T.Mesh
					position={[Math.cos(angle) * radius, -1.8 - Math.random() * 1.5, Math.sin(angle) * radius]}
				>
					<T.SphereGeometry args={[0.06, 4, 4]} />
					<T.MeshBasicMaterial
						color={new THREE.Color().setHSL(0.1, 1, 0.5 + Math.random() * 0.5)}
						transparent
						opacity={0.7}
					/>
				</T.Mesh>
			{/each}
		</T.Group>
	</T.Group>
</Canvas>
