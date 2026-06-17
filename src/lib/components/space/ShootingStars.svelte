<script lang="ts">
	import { T } from '@threlte/core';
	import * as THREE from 'three';

	interface ShootingStar {
		mesh: THREE.Mesh;
		velocity: THREE.Vector3;
		life: number;
		maxLife: number;
	}

	let groupRef = $state<THREE.Group | null>(null);
	let stars = $state<ShootingStar[]>([]);
	let lastSpawn = $state(0);

	const MAX_STARS = 4;
	const SPAWN_INTERVAL = 3000;

	function spawnStar(): ShootingStar {
		const geometry = new THREE.CylinderGeometry(0.01, 0.03, 0.6, 4);
		const material = new THREE.MeshBasicMaterial({
			color: '#ffffff',
			transparent: true,
			opacity: 0.9
		});
		const mesh = new THREE.Mesh(geometry, material);

		const angle = Math.random() * Math.PI * 2;
		const radius = 8 + Math.random() * 10;
		mesh.position.set(
			Math.cos(angle) * radius,
			(Math.random() - 0.5) * 8,
			Math.sin(angle) * radius
		);
		mesh.rotation.z = Math.random() * Math.PI;
		mesh.rotation.y = Math.random() * Math.PI;

		const speed = 3 + Math.random() * 6;
		const dir = new THREE.Vector3(-Math.cos(angle), (Math.random() - 0.5) * 0.5, -Math.sin(angle))
			.normalize()
			.multiplyScalar(speed);

		return { mesh, velocity: dir, life: 0, maxLife: 2000 + Math.random() * 2000 };
	}

	$effect(() => {
		if (!groupRef) return;
		let animId: number;
		let prevTime = performance.now();

		function animate(time: number) {
			const dt = time - prevTime;
			prevTime = time;

			// Spawn
			if (time - lastSpawn > SPAWN_INTERVAL && stars.length < MAX_STARS) {
				const star = spawnStar();
				groupRef!.add(star.mesh);
				stars = [...stars, star];
				lastSpawn = time;
			}

			// Update
			let changed = false;
			let newStars = stars
				.map((s) => {
					const updated = { ...s, life: s.life + dt };
					updated.mesh.position.add(updated.velocity.clone().multiplyScalar(dt / 1000));
					updated.mesh.material.opacity = Math.max(0, 1 - updated.life / updated.maxLife);
					return updated;
				})
				.filter((s) => {
					if (s.life >= s.maxLife) {
						groupRef!.remove(s.mesh);
						s.mesh.geometry.dispose();
						(s.mesh.material as THREE.Material).dispose();
						changed = true;
						return false;
					}
					return true;
				});

			if (changed || newStars.length !== stars.length) {
				stars = newStars;
			}

			animId = requestAnimationFrame(animate);
		}

		animId = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(animId);
	});
</script>

<T.Group bind:ref={groupRef} />
