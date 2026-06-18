<script lang="ts">
	import { useThrelte } from '@threlte/core';
	import * as THREE from 'three';
	import { isKeyDown } from '$lib/stores/input.svelte';
	import {
		getIsLanding,
		getLandingTarget,
		setLandingProgress,
		getIsLanded
	} from '$lib/stores/landing.svelte';
	import { setCamera as setSharedCamera } from '$lib/stores/camera.svelte';

	const { camera, renderer } = useThrelte();

	$effect(() => {
		setSharedCamera(camera.current);
	});

	// --- CAD / OnShape-style orbit state ---
	// The camera orbits a focus point. Right-drag rotates, middle-drag (or
	// Ctrl/Shift + right-drag) pans the focus, the wheel dollies in/out.
	let target = new THREE.Vector3(6, 0, 0);
	let radius = 20;
	let theta = 0.15; // azimuth around +y
	let phi = 1.15; // polar from +y axis

	const MIN_RADIUS = 3;
	const MAX_RADIUS = 55;
	const MIN_PHI = 0.15;
	const MAX_PHI = Math.PI - 0.15;

	// WASD still flies the focus point, with a little momentum for a spacey feel.
	let velX = $state(0);
	let velY = $state(0);
	let velZ = $state(0);
	let prevTime = 0;

	const THRUST = 12;
	const DRAG = 1.8;
	const MAX_SPEED = 5;
	const MIN_Y = -3;
	const MAX_Y = 8;

	// Attach pointer/wheel controls to the WebGL canvas.
	$effect(() => {
		const el = renderer?.domElement;
		if (!el) return;

		let mode: 'none' | 'rotate' | 'pan' = 'none';
		let lastX = 0;
		let lastY = 0;

		const onContextMenu = (e: MouseEvent) => e.preventDefault();

		const onPointerDown = (e: PointerEvent) => {
			if (e.button === 2) {
				mode = e.ctrlKey || e.shiftKey ? 'pan' : 'rotate';
			} else if (e.button === 1) {
				mode = 'pan';
			} else {
				return;
			}
			e.preventDefault();
			lastX = e.clientX;
			lastY = e.clientY;
			el.setPointerCapture?.(e.pointerId);
		};

		const onPointerMove = (e: PointerEvent) => {
			if (mode === 'none') return;
			const dx = e.clientX - lastX;
			const dy = e.clientY - lastY;
			lastX = e.clientX;
			lastY = e.clientY;

			if (mode === 'rotate') {
				theta -= dx * 0.005;
				phi = Math.max(MIN_PHI, Math.min(MAX_PHI, phi - dy * 0.005));
			} else {
				const cam = camera.current;
				if (!cam) return;
				const panScale = radius * 0.0016;
				const right = new THREE.Vector3().setFromMatrixColumn(cam.matrix, 0);
				const up = new THREE.Vector3().setFromMatrixColumn(cam.matrix, 1);
				target.addScaledVector(right, -dx * panScale);
				target.addScaledVector(up, dy * panScale);
			}
		};

		const onPointerUp = (e: PointerEvent) => {
			mode = 'none';
			el.releasePointerCapture?.(e.pointerId);
		};

		const onWheel = (e: WheelEvent) => {
			e.preventDefault();
			radius *= 1 + Math.sign(e.deltaY) * 0.08;
			radius = Math.max(MIN_RADIUS, Math.min(MAX_RADIUS, radius));
		};

		el.addEventListener('contextmenu', onContextMenu);
		el.addEventListener('pointerdown', onPointerDown);
		window.addEventListener('pointermove', onPointerMove);
		window.addEventListener('pointerup', onPointerUp);
		el.addEventListener('wheel', onWheel, { passive: false });

		return () => {
			el.removeEventListener('contextmenu', onContextMenu);
			el.removeEventListener('pointerdown', onPointerDown);
			window.removeEventListener('pointermove', onPointerMove);
			window.removeEventListener('pointerup', onPointerUp);
			el.removeEventListener('wheel', onWheel);
		};
	});

	const targetPositions: Record<string, THREE.Vector3> = {
		sun: new THREE.Vector3(0, 2, 4.5),
		projects: new THREE.Vector3(11.5, 1.5, 4),
		about: new THREE.Vector3(4, 1, 2),
		contact: new THREE.Vector3(16.5, 1.5, 5)
	};

	let landingStartPos = new THREE.Vector3();
	let landingStartLook = new THREE.Vector3();
	let landingElapsed = 0;
	const LANDING_DURATION = 2.5;

	$effect(() => {
		let running = true;

		function tick(time: number) {
			if (!running || !camera.current) {
				requestAnimationFrame(tick);
				return;
			}

			const dt = prevTime ? Math.min((time - prevTime) / 1000, 0.1) : 0;
			prevTime = time;
			const cam = camera.current as THREE.PerspectiveCamera;

			// --- LANDING MODE ---
			if (getIsLanding()) {
				const targetId = getLandingTarget();
				const target = targetId ? targetPositions[targetId] : null;
				if (!target) {
					requestAnimationFrame(tick);
					return;
				}

				landingElapsed += dt;
				const t = Math.min(landingElapsed / LANDING_DURATION, 1);
				setLandingProgress(t);

				const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
				const midPoint = landingStartPos.clone().add(target).multiplyScalar(0.5);
				midPoint.y += 3;

				const p0 = landingStartPos;
				const p1 = midPoint;
				const p2 = target;
				const u = 1 - ease;
				cam.position.set(
					u * u * p0.x + 2 * u * ease * p1.x + ease * ease * p2.x,
					u * u * p0.y + 2 * u * ease * p1.y + ease * ease * p2.y,
					u * u * p0.z + 2 * u * ease * p1.z + ease * ease * p2.z
				);
				cam.lookAt(target);
				requestAnimationFrame(tick);
				return;
			}

			// --- LANDED MODE (SurfaceWalk takes over) ---
			if (getIsLanded()) {
				requestAnimationFrame(tick);
				return;
			}

			// --- FREE FLIGHT (orbit camera; WASD pans the focus point) ---
			// Forward/right on the ground plane, derived from the orbit azimuth.
			const fwdX = -Math.sin(theta);
			const fwdZ = -Math.cos(theta);
			const rightX = Math.cos(theta);
			const rightZ = -Math.sin(theta);

			let ax = 0,
				az = 0;
			if (isKeyDown('KeyW')) {
				ax += fwdX;
				az += fwdZ;
			}
			if (isKeyDown('KeyS')) {
				ax -= fwdX;
				az -= fwdZ;
			}
			if (isKeyDown('KeyA')) {
				ax -= rightX;
				az -= rightZ;
			}
			if (isKeyDown('KeyD')) {
				ax += rightX;
				az += rightZ;
			}
			const thrustLen = Math.sqrt(ax * ax + az * az);
			if (thrustLen > 0.001) {
				ax /= thrustLen;
				az /= thrustLen;
			}
			velX += ax * THRUST * dt;
			velZ += az * THRUST * dt;

			if (isKeyDown('ShiftLeft') || isKeyDown('ShiftRight')) velY -= THRUST * 0.5 * dt;
			if (isKeyDown('Space')) velY += THRUST * 0.5 * dt;

			const hSpeed = Math.sqrt(velX * velX + velZ * velZ);
			if (hSpeed > 0.001) {
				const dragForce = DRAG * hSpeed * dt;
				const newSpeed = Math.max(0, hSpeed - dragForce);
				velX *= newSpeed / hSpeed;
				velZ *= newSpeed / hSpeed;
			} else {
				velX = 0;
				velZ = 0;
			}

			if (Math.abs(velY) > 0.001) {
				const dragForce = DRAG * Math.abs(velY) * dt;
				velY = Math.sign(velY) * Math.max(0, Math.abs(velY) - dragForce);
			} else {
				velY = 0;
			}

			const speed = Math.sqrt(velX * velX + velZ * velZ);
			if (speed > MAX_SPEED) {
				velX *= MAX_SPEED / speed;
				velZ *= MAX_SPEED / speed;
			}

			target.x += velX * dt;
			target.y += velY * dt;
			target.z += velZ * dt;
			target.y = Math.max(MIN_Y, Math.min(MAX_Y, target.y));

			// Place the camera on its orbit sphere around the focus point.
			const sinPhi = Math.sin(phi);
			cam.position.set(
				target.x + radius * sinPhi * Math.sin(theta),
				target.y + radius * Math.cos(phi),
				target.z + radius * sinPhi * Math.cos(theta)
			);
			cam.lookAt(target);

			landingStartPos.copy(cam.position);
			landingStartLook.copy(target);

			requestAnimationFrame(tick);
		}

		requestAnimationFrame(tick);
		return () => {
			running = false;
		};
	});
</script>
