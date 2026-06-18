<script lang="ts">
	import { T } from '@threlte/core';
	import * as THREE from 'three';

	let nucleusRef = $state<THREE.Mesh | undefined>(undefined);
	let groupRef = $state<THREE.Group | undefined>(undefined);

	const nucleusGeom = new THREE.IcosahedronGeometry(0.3, 1);
	const nucleusMat = new THREE.MeshStandardMaterial({
		color: '#ccccdd',
		roughness: 0.5,
		metalness: 0.2,
		emissive: '#222244',
		emissiveIntensity: 0.5
	});

	const glowGeom = new THREE.SphereGeometry(0.45, 16, 16);
	const glowMat = new THREE.MeshBasicMaterial({
		color: '#8899ff',
		transparent: true,
		opacity: 0.3
	});

	const TRAIL_LENGTH = 4;
	const awayFromSun = new THREE.Vector3(16.5, 0.5, 3).normalize();

	// Each particle has a phase along the tail (0 = head, 1 = far tip) plus a
	// fixed sideways jitter. The phase scrolls every frame so the dust appears
	// to stream outward and recycle at the head, keeping the streak shape fixed.
	const trailCount = 80;
	const trailPositions = new Float32Array(trailCount * 3);
	const trailPhase = new Float32Array(trailCount);
	const trailJitter = new Float32Array(trailCount * 2);
	const sideA = new THREE.Vector3();
	const sideB = new THREE.Vector3();
	// Two axes perpendicular to the tail direction, for spreading the jitter.
	sideA.set(0, 1, 0).cross(awayFromSun).normalize();
	sideB.copy(awayFromSun).cross(sideA).normalize();

	for (let i = 0; i < trailCount; i++) {
		trailPhase[i] = i / trailCount;
		trailJitter[i * 2] = (Math.random() - 0.5) * 0.3;
		trailJitter[i * 2 + 1] = (Math.random() - 0.5) * 0.3;
	}

	function writeTrail() {
		for (let i = 0; i < trailCount; i++) {
			const t = trailPhase[i];
			const jA = trailJitter[i * 2] * t;
			const jB = trailJitter[i * 2 + 1] * t;
			trailPositions[i * 3] = awayFromSun.x * t * TRAIL_LENGTH + sideA.x * jA + sideB.x * jB;
			trailPositions[i * 3 + 1] = awayFromSun.y * t * TRAIL_LENGTH + sideA.y * jA + sideB.y * jB;
			trailPositions[i * 3 + 2] = awayFromSun.z * t * TRAIL_LENGTH + sideA.z * jA + sideB.z * jB;
		}
	}
	writeTrail();

	const trailGeom = new THREE.BufferGeometry();
	trailGeom.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
	const trailMat = new THREE.PointsMaterial({
		color: '#8899ff',
		size: 0.06,
		transparent: true,
		opacity: 0.7,
		sizeAttenuation: true
	});

	$effect(() => {
		let animId: number;
		let start = 0;
		function animate(time: number) {
			if (!start) start = time;
			const elapsed = (time - start) / 1000;

			if (nucleusRef) nucleusRef.rotation.y += 0.003;

			// Gently bob the whole comet so it drifts rather than sits frozen.
			if (groupRef) groupRef.position.y = Math.sin(elapsed * 0.6) * 0.15;

			// Scroll every particle's phase outward; recycle past the tip to head.
			for (let i = 0; i < trailCount; i++) {
				trailPhase[i] = (trailPhase[i] + 0.004) % 1;
			}
			writeTrail();
			trailGeom.attributes.position.needsUpdate = true;

			animId = requestAnimationFrame(animate);
		}
		animId = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(animId);
	});
</script>

<T.Group bind:ref={groupRef}>
	<T.Mesh bind:ref={nucleusRef} geometry={nucleusGeom} material={nucleusMat} />
	<T.Mesh geometry={glowGeom} material={glowMat} />
	<T.Points geometry={trailGeom} material={trailMat} />
</T.Group>
