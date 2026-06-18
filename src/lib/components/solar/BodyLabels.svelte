<script lang="ts">
	import * as THREE from 'three';
	import { getCamera } from '$lib/stores/camera.svelte';
	import { startCutscene } from '$lib/stores/cutscene.svelte';

	interface Label {
		worldPos: [number, number, number];
		name: string;
		color: string;
		route: string;
	}

	const labels: Label[] = [
		{ worldPos: [0, 0, 0], name: 'HOME', color: '#ff8800', route: '/' },
		{ worldPos: [11.5, 0, 0], name: 'PROJECTS', color: '#4488ff', route: '/projects' },
		{ worldPos: [4, 0.5, 0], name: 'ABOUT', color: '#bbbbaa', route: '/about' },
		{ worldPos: [16.5, 0.5, 3], name: 'CONTACT', color: '#8899ff', route: '/contact' }
	];

	interface ScreenLabel {
		x: number;
		y: number;
		visible: boolean;
		distance: number;
		label: Label;
	}

	let screenLabels = $state<ScreenLabel[]>(
		labels.map((l) => ({
			x: 0,
			y: 0,
			visible: false,
			distance: 0,
			label: l
		}))
	);

	const tempVec = new THREE.Vector3();

	$effect(() => {
		let running = true;
		function update() {
			if (!running) return;
			const cam = getCamera();
			if (!cam) {
				requestAnimationFrame(update);
				return;
			}

			const newLabels: ScreenLabel[] = labels.map((label) => {
				tempVec.set(...label.worldPos);
				tempVec.project(cam);
				const x = (tempVec.x * 0.5 + 0.5) * window.innerWidth;
				const y = (-tempVec.y * 0.5 + 0.5) * window.innerHeight;
				const behindCamera = tempVec.z > 1;
				const dist = cam.position.distanceTo(new THREE.Vector3(...label.worldPos));
				return { x, y, visible: !behindCamera && dist < 60, distance: dist, label };
			});
			screenLabels = newLabels;
			requestAnimationFrame(update);
		}
		requestAnimationFrame(update);
		return () => {
			running = false;
		};
	});

	function handleClick(label: Label) {
		if (label.route === '/') return; // Already on home
		startCutscene({ route: label.route, color: label.color, name: label.name });
	}
</script>

{#each screenLabels as sl (sl.label.name)}
	{#if sl.visible}
		{@const l = sl.label}
		{@const scale = Math.max(0.6, Math.min(1.4, 8 / Math.max(sl.distance, 1)))}
		<button
			class="body-label"
			style="left: {sl.x}px; top: {sl.y}px; transform: translate(-50%, -50%) scale({scale}); border-color: {l.color}; color: {l.color};"
			onclick={() => handleClick(l)}
			onkeydown={(e: KeyboardEvent) => e.key === 'Enter' && handleClick(l)}
		>
			{l.name}
		</button>
	{/if}
{/each}

{#each screenLabels as sl (sl.label.name + '-dot')}
	{#if sl.visible}
		<div
			class="body-dot"
			style="left: {sl.x}px; top: {sl.y}px; background: {sl.label.color}; box-shadow: 0 0 {6 *
				Math.max(0.6, 8 / Math.max(sl.distance, 1))}px {sl.label.color};"
		></div>
	{/if}
{/each}

<style>
	.body-label {
		position: fixed;
		z-index: 10;
		pointer-events: all;
		background: rgba(5, 8, 20, 0.7);
		border: 1px solid;
		padding: 4px 12px;
		font-family: 'Courier New', monospace;
		font-size: 11px;
		letter-spacing: 2px;
		cursor: pointer;
		backdrop-filter: blur(4px);
		transition: transform 0.1s;
		white-space: nowrap;
	}
	.body-label:hover {
		background: rgba(5, 8, 20, 0.9);
		text-shadow: 0 0 8px currentColor;
	}
	.body-dot {
		position: fixed;
		z-index: 9;
		pointer-events: none;
		width: 4px;
		height: 4px;
		border-radius: 50%;
		transform: translate(-50%, -50%);
	}
</style>
