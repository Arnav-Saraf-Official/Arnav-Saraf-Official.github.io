<script lang="ts">
	import { T } from '@threlte/core';
	import * as THREE from 'three';

	const ASTEROID_COUNT = 900;
	const BELT_RADIUS_INNER = 5.5;
	const BELT_RADIUS_OUTER = 7.6;

	const positions = new Float32Array(ASTEROID_COUNT * 3);
	const sizes = new Float32Array(ASTEROID_COUNT);

	for (let i = 0; i < ASTEROID_COUNT; i++) {
		const angle = Math.random() * Math.PI * 2;
		// Bias toward the band centre so the ring has a dense core and soft edges
		const t = (Math.random() + Math.random()) * 0.5;
		const radius = BELT_RADIUS_INNER + t * (BELT_RADIUS_OUTER - BELT_RADIUS_INNER);
		const height = (Math.random() - 0.5) * 0.5;
		positions[i * 3] = Math.cos(angle) * radius;
		positions[i * 3 + 1] = height;
		positions[i * 3 + 2] = Math.sin(angle) * radius;
		sizes[i] = 0.05 + Math.random() * 0.2;
	}

	const geom = new THREE.BufferGeometry();
	geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
	geom.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

	// Crisp little rock grain: a solid bright core that holds its edge, with only
	// a thin antialiasing falloff at the rim. Reads as lit rock, not a soft blob.
	function buildMoteSprite(hex: string): THREE.CanvasTexture {
		const c = document.createElement('canvas');
		c.width = c.height = 64;
		const g = c.getContext('2d')!;
		const r = parseInt(hex.slice(1, 3), 16);
		const gg = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		const mix = (v: number) => Math.round(v + (255 - v) * 0.35);
		const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
		grad.addColorStop(0, `rgba(${mix(r)},${mix(gg)},${mix(b)},1)`);
		grad.addColorStop(0.6, `rgba(${r},${gg},${b},1)`);
		grad.addColorStop(0.8, `rgba(${r},${gg},${b},0.85)`);
		grad.addColorStop(1, `rgba(${r},${gg},${b},0)`);
		g.fillStyle = grad;
		g.fillRect(0, 0, 64, 64);
		const tex = new THREE.CanvasTexture(c);
		tex.needsUpdate = true;
		return tex;
	}

	const mat = new THREE.PointsMaterial({
		color: '#aeb8c6',
		map: buildMoteSprite('#828c9c'),
		size: 0.13,
		transparent: true,
		opacity: 1,
		sizeAttenuation: true,
		depthWrite: false
	});

	let beltRef = $state<THREE.Points | undefined>(undefined);

	$effect(() => {
		if (!beltRef) return;
		let animId: number;
		function animate() {
			beltRef!.rotation.y += 0.0002;
			animId = requestAnimationFrame(animate);
		}
		animId = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(animId);
	});
</script>

<T.Points bind:ref={beltRef} geometry={geom} material={mat} />
