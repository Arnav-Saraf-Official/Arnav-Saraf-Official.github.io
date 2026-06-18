<script lang="ts">
	import { T } from '@threlte/core';
	import * as THREE from 'three';

	let groupRef = $state<THREE.Group | undefined>(undefined);

	// Solid sun body — warm cream, not blown-out white
	const sunGeom = new THREE.SphereGeometry(2.5, 64, 64);
	const sunMat = new THREE.MeshBasicMaterial({ color: '#ffe9b0' });

	// Soft radial halo as a single camera-facing sprite, so the glow falls off
	// smoothly instead of stacking into a hard-edged muddy band. Kept subtle.
	function buildGlowSprite(): THREE.CanvasTexture {
		const c = document.createElement('canvas');
		c.width = c.height = 128;
		const g = c.getContext('2d')!;
		const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
		grad.addColorStop(0.0, 'rgba(255, 226, 160, 0.55)');
		grad.addColorStop(0.18, 'rgba(255, 196, 110, 0.32)');
		grad.addColorStop(0.45, 'rgba(255, 150, 70, 0.10)');
		grad.addColorStop(1.0, 'rgba(255, 130, 60, 0)');
		g.fillStyle = grad;
		g.fillRect(0, 0, 128, 128);
		const tex = new THREE.CanvasTexture(c);
		tex.needsUpdate = true;
		return tex;
	}

	const haloMat = new THREE.SpriteMaterial({
		map: buildGlowSprite(),
		transparent: true,
		depthWrite: false,
		blending: THREE.AdditiveBlending
	});

	$effect(() => {
		if (!groupRef) return;
		let animId: number;
		function animate() {
			groupRef!.rotation.y += 0.0008;
			animId = requestAnimationFrame(animate);
		}
		animId = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(animId);
	});
</script>

<T.Group bind:ref={groupRef}>
	<T.Mesh geometry={sunGeom} material={sunMat} />
	<T.Sprite material={haloMat} scale={[11, 11, 11]} />
</T.Group>
