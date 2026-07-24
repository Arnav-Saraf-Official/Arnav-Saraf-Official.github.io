<script lang="ts">
	import { onMount } from 'svelte';
	import { useThrelte } from '@threlte/core';
	import * as THREE from 'three';

	let {
		scrollIndex,
		terrainGeom,
		terrainMat,
		rocks,
		groundColor,
		terrainW,
		terrainL
	}: {
		scrollIndex: number;
		terrainGeom: THREE.PlaneGeometry;
		terrainMat: THREE.MeshStandardMaterial;
		rocks: Array<{
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
		}>;
		groundColor: string;
		terrainW: number;
		terrainL: number;
	} = $props();

	const { scene } = useThrelte();
	const group = new THREE.Group();

	// Terrain mesh at z=-10 within group
	const tMesh = new THREE.Mesh(terrainGeom, terrainMat);
	tMesh.position.set(0, -5, -10);
	group.add(tMesh);

	// Rocks
	for (const rock of rocks) {
		const rGeom = new THREE.IcosahedronGeometry(1, 1);
		const rMat = new THREE.MeshStandardMaterial({
			color: rock.color,
			roughness: 0.82,
			flatShading: true
		});
		const rMesh = new THREE.Mesh(rGeom, rMat);
		rMesh.position.set(rock.x, rock.y, rock.z);
		rMesh.rotation.set(rock.rx, rock.ry, rock.rz);
		rMesh.scale.set(rock.sx, rock.sy, rock.sz);
		group.add(rMesh);
	}

	// Under-plane
	const uGeom = new THREE.PlaneGeometry(terrainW + 10, terrainL);
	const uMat = new THREE.MeshBasicMaterial({
		color: groundColor,
		transparent: true,
		opacity: 0.4,
		depthWrite: false
	});
	const uPlane = new THREE.Mesh(uGeom, uMat);
	uPlane.position.set(0, -6.5, -10);
	uPlane.rotation.set(-Math.PI / 2, 0, 0);
	group.add(uPlane);

	onMount(() => {
		scene.add(group);
		return () => {
			scene.remove(group);
		};
	});

	// Scroll terrain past the camera
	$effect(() => {
		group.position.z = scrollIndex * 25;
	});
</script>
