<script lang="ts">
	import { T } from '@threlte/core';
	import * as THREE from 'three';

	// Passive spacecraft and objects drifting in the distance
	let groupRef = $state<THREE.Group | null>(null);

	interface Drifter {
		mesh: THREE.Mesh;
		orbitRadius: number;
		orbitSpeed: number;
		orbitOffset: number;
		height: number;
	}

	let drifters = $state<Drifter[]>([]);

	$effect(() => {
		if (!groupRef) return;

		// Create a few simple distant objects
		const newDrifters: Drifter[] = [];
		const geometries = [
			new THREE.BoxGeometry(0.3, 0.1, 0.5),
			new THREE.ConeGeometry(0.2, 0.6, 4),
			new THREE.IcosahedronGeometry(0.2, 0)
		];

		for (let i = 0; i < 3; i++) {
			const geo = geometries[i];
			const mat = new THREE.MeshStandardMaterial({
				color: new THREE.Color().setHSL(0.55 + i * 0.15, 0.3, 0.5),
				metalness: 0.8,
				roughness: 0.4
			});
			const mesh = new THREE.Mesh(geo, mat);
			const orbitRadius = 6 + i * 2.5;
			const orbitOffset = Math.random() * Math.PI * 2;
			const height = (Math.random() - 0.5) * 4;
			mesh.position.set(
				Math.cos(orbitOffset) * orbitRadius,
				height,
				Math.sin(orbitOffset) * orbitRadius
			);
			groupRef.add(mesh);
			newDrifters.push({
				mesh,
				orbitRadius,
				orbitSpeed: 0.05 + Math.random() * 0.1,
				orbitOffset,
				height
			});
		}

		drifters = newDrifters;

		let animId: number;
		function animate(time: number) {
			const t = time * 0.001;
			for (const d of drifters) {
				const angle = d.orbitOffset + t * d.orbitSpeed;
				d.mesh.position.x = Math.cos(angle) * d.orbitRadius;
				d.mesh.position.z = Math.sin(angle) * d.orbitRadius;
				d.mesh.position.y = d.height + Math.sin(t * 0.3 + d.orbitOffset) * 0.5;
				d.mesh.rotation.y += 0.005;
			}
			animId = requestAnimationFrame(animate);
		}
		animId = requestAnimationFrame(animate);

		return () => {
			cancelAnimationFrame(animId);
			for (const d of drifters) {
				groupRef?.remove(d.mesh);
				d.mesh.geometry.dispose();
				(d.mesh.material as THREE.Material).dispose();
			}
		};
	});
</script>

<T.Group bind:ref={groupRef} />
