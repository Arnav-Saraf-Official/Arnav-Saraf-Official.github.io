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

	const { camera } = useThrelte();

	$effect(() => {
		setSharedCamera(camera.current);
	});

	let yaw = $state(0);
	let velX = $state(0);
	let velY = $state(0);
	let velZ = $state(0);
	let angVel = $state(0);
	let prevTime = 0;

	const THRUST = 12;
	const DRAG = 1.8;
	const MAX_SPEED = 5;
	const ROT_THRUST = 4;
	const ROT_DRAG = 3;
	const MAX_ANG_SPEED = 2;
	const MIN_Y = 0.5;
	const MAX_Y = 12;

	const targetPositions: Record<string, THREE.Vector3> = {
		sun: new THREE.Vector3(0, 2, 4),
		projects: new THREE.Vector3(6, 2, 3),
		about: new THREE.Vector3(2.5, 1.5, 2),
		contact: new THREE.Vector3(9, 1.5, 4)
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

			// --- FREE FLIGHT ---
			if (isKeyDown('KeyQ')) angVel += ROT_THRUST * dt;
			if (isKeyDown('KeyE')) angVel -= ROT_THRUST * dt;

			if (Math.abs(angVel) > 0.001) {
				const dragForce = ROT_DRAG * Math.abs(angVel) * dt;
				angVel = Math.sign(angVel) * Math.max(0, Math.abs(angVel) - dragForce);
			} else {
				angVel = 0;
			}
			angVel = Math.max(-MAX_ANG_SPEED, Math.min(MAX_ANG_SPEED, angVel));
			yaw += angVel * dt;

			const fwdX = -Math.sin(yaw);
			const fwdZ = -Math.cos(yaw);
			const rightX = Math.cos(yaw);
			const rightZ = -Math.sin(yaw);

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

			cam.position.x += velX * dt;
			cam.position.y += velY * dt;
			cam.position.z += velZ * dt;
			cam.position.y = Math.max(MIN_Y, Math.min(MAX_Y, cam.position.y));

			const lookTarget = cam.position.clone();
			lookTarget.x += fwdX * 8;
			lookTarget.z += fwdZ * 8;
			cam.lookAt(lookTarget);

			landingStartPos.copy(cam.position);
			landingStartLook.copy(lookTarget);

			requestAnimationFrame(tick);
		}

		requestAnimationFrame(tick);
		return () => {
			running = false;
		};
	});
</script>
