<script lang="ts">
	import { onMount } from 'svelte';
	import { getIsLanded, getLandingTarget } from '$lib/stores/landing.svelte';
	import { getCamera } from '$lib/stores/camera.svelte';
	import { getAllProjects } from '$lib/stores/projects.svelte';
	// selectProject available via navigation store when needed
	import * as THREE from 'three';

	let walkZ = $state(0);
	let targetWalkZ = $state(0);

	const STOP_SPACING = 14;
	const WALK_SPEED = 20;
	let prevTime = 0;

	let isLanded = $derived(getIsLanded());
	let target = $derived(getLandingTarget());
	let projects = $derived(getAllProjects());

	// Content stops — render as HTML panels projected from 3D markers
	interface ContentStop {
		worldPos: THREE.Vector3;
		title: string;
		body: string;
		links?: { label: string; url: string }[];
		action?: string;
	}

	let stops = $derived.by((): ContentStop[] => {
		const t = target;
		const base: ContentStop[] = [];

		if (t === 'sun') {
			base.push(
				{
					worldPos: new THREE.Vector3(0, 1, 0),
					title: 'ARNAV SARAF',
					body: 'Creative Technologist & Full-Stack Developer',
					action: 'HOME'
				},
				{
					worldPos: new THREE.Vector3(0, 1.5, STOP_SPACING),
					title: 'WHAT I DO',
					body: 'I build at the intersection of 3D graphics, machine learning, and web engineering. From real-time shaders to neural networks — I make things that push the browser to its limits.'
				},
				{
					worldPos: new THREE.Vector3(0, 1, STOP_SPACING * 2),
					title: 'THIS PORTFOLIO',
					body: 'Is a real-time 3D solar system. Fly a spacecraft. Land on planets. Everything you see renders in your browser using WebGL.'
				},
				{
					worldPos: new THREE.Vector3(0, 1.2, STOP_SPACING * 3),
					title: 'TECH STACK',
					body: 'SvelteKit · Three.js · Threlte · Theatre.js · Tailwind CSS · TypeScript · Python · TensorFlow · Unity'
				}
			);
		} else if (t === 'projects') {
			for (let i = 0; i < projects.length; i++) {
				const p = projects[i];
				base.push({
					worldPos: new THREE.Vector3(2 * ((i % 3) - 1), 1 + i * 0.1, STOP_SPACING * (i + 0.5)),
					title: p.metadata.title,
					body: p.metadata.description || 'No description',
					links: [
						...(p.metadata.liveUrl ? [{ label: 'LIVE', url: p.metadata.liveUrl }] : []),
						...(p.metadata.sourceUrl ? [{ label: 'SOURCE', url: p.metadata.sourceUrl }] : [])
					]
				});
			}
			if (projects.length === 0) {
				base.push({
					worldPos: new THREE.Vector3(0, 1, STOP_SPACING),
					title: 'NO PROJECTS YET',
					body: 'Add .svx files to src/projects/'
				});
			}
		} else if (t === 'about') {
			base.push(
				{
					worldPos: new THREE.Vector3(0, 1, 0),
					title: 'ABOUT ME',
					body: 'Arnav Saraf. Developer. Creator. Space explorer.'
				},
				{
					worldPos: new THREE.Vector3(0, 1, STOP_SPACING),
					title: 'BACKGROUND',
					body: 'Full-stack developer with deep experience in 3D web technologies. I care about craft — every pixel, every shader, every animation.'
				},
				{
					worldPos: new THREE.Vector3(0, 1.5, STOP_SPACING * 2),
					title: 'PHILOSOPHY',
					body: 'The web should feel alive. Not flat pages — living worlds. Every project is a universe.'
				}
			);
		} else if (t === 'contact') {
			base.push(
				{ worldPos: new THREE.Vector3(0, 1, 0), title: 'CONTACT', body: 'Open a comms channel.' },
				{
					worldPos: new THREE.Vector3(0, 1, STOP_SPACING),
					title: 'GITHUB',
					body: 'github.com/arnav-saraf-official',
					links: [{ label: 'VISIT', url: 'https://github.com/arnav-saraf-official' }]
				},
				{
					worldPos: new THREE.Vector3(0, 1.5, STOP_SPACING * 2),
					title: 'EMAIL',
					body: 'contact@arnavsaraf.dev'
				}
			);
		}
		return base;
	});

	interface ScreenPanel {
		x: number;
		y: number;
		visible: boolean;
		opacity: number;
		stop: ContentStop;
		distance: number;
	}

	let panels = $state<ScreenPanel[]>([]);
	const tempVec2 = new THREE.Vector3();

	// Walk animation + screen projection
	$effect(() => {
		if (!isLanded) return;
		let running = true;

		function tick(time: number) {
			if (!running) return;
			const dt = prevTime ? Math.min((time - prevTime) / 1000, 0.1) : 0;
			prevTime = time;

			// Smooth walk toward target
			walkZ += (targetWalkZ - walkZ) * Math.min(WALK_SPEED * dt, 1);

			const cam = getCamera();
			if (!cam) {
				requestAnimationFrame(tick);
				return;
			}

			// Update camera position for walking
			cam.position.z = walkZ;
			cam.position.y = 2 + Math.sin(walkZ * 0.1) * 0.3;
			cam.lookAt(0, 1.5, walkZ + 10);

			// Project stop positions to screen
			const newPanels: ScreenPanel[] = stops.map((stop) => {
				const worldPos = stop.worldPos.clone();
				worldPos.z += walkZ; // Offset by current walk position
				tempVec2.copy(worldPos);
				tempVec2.project(cam);

				const x = (tempVec2.x * 0.5 + 0.5) * window.innerWidth;
				const y = (-tempVec2.y * 0.5 + 0.5) * window.innerHeight;
				const behind = tempVec2.z > 1;
				const dist = cam.position.distanceTo(worldPos);

				// Opacity based on distance to camera center
				const screenDist =
					Math.abs(x - window.innerWidth / 2) / (window.innerWidth / 2) +
					Math.abs(y - window.innerHeight * 0.4) / (window.innerHeight * 0.4);
				const opacity = behind
					? 0
					: Math.max(0, Math.min(1, 1 - screenDist * 2)) *
						Math.max(0, Math.min(1, 1 - Math.abs(dist - 2) / 8));

				return {
					x,
					y,
					visible: !behind && dist < 30 && opacity > 0.02,
					opacity,
					stop,
					distance: dist
				};
			});

			panels = newPanels;
			requestAnimationFrame(tick);
		}

		requestAnimationFrame(tick);
		return () => {
			running = false;
		};
	});

	// Scroll handler
	function onWheel(e: WheelEvent) {
		if (!isLanded) return;
		e.preventDefault();
		targetWalkZ -= e.deltaY * 0.05;
		targetWalkZ = Math.max(0, targetWalkZ);
	}

	onMount(() => {
		window.addEventListener('wheel', onWheel, { passive: false });
		return () => window.removeEventListener('wheel', onWheel);
	});
</script>

{#if isLanded}
	{#each panels as panel (panel.stop.title + panel.stop.worldPos.z)}
		{#if panel.visible}
			<div
				class="float-panel"
				style="left: {panel.x}px; top: {panel.y}px; opacity: {panel.opacity};"
			>
				<div class="fp-title">{panel.stop.title}</div>
				<div class="fp-body">{panel.stop.body}</div>
				{#if panel.stop.links}
					<div class="fp-links">
						{#each panel.stop.links as link}
							<a href={link.url} target="_blank" rel="external noopener">{link.label}</a>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	{/each}

	<!-- Scroll hint -->
	<div class="scroll-hint">SCROLL TO EXPLORE &darr;</div>
{/if}

<style>
	.float-panel {
		position: fixed;
		z-index: 15;
		pointer-events: none;
		transform: translate(-50%, -50%);
		font-family: 'Courier New', monospace;
		text-align: center;
		transition: opacity 0.3s;
		max-width: 400px;
	}
	.fp-title {
		font-size: 18px;
		color: #c8e6ff;
		letter-spacing: 4px;
		margin-bottom: 8px;
		text-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
	}
	.fp-body {
		font-size: 12px;
		color: rgba(200, 230, 255, 0.55);
		line-height: 1.7;
		text-shadow: 0 0 12px rgba(0, 0, 0, 0.9);
	}
	.fp-links {
		margin-top: 10px;
		display: flex;
		gap: 12px;
		justify-content: center;
	}
	.fp-links a {
		pointer-events: all;
		color: #00ddff;
		font-size: 11px;
		text-decoration: none;
		letter-spacing: 2px;
		padding: 4px 12px;
		border: 1px solid rgba(0, 200, 255, 0.3);
		transition: all 0.2s;
	}
	.fp-links a:hover {
		background: rgba(0, 200, 255, 0.1);
		text-shadow: 0 0 10px rgba(0, 200, 255, 0.5);
	}

	.scroll-hint {
		position: fixed;
		bottom: 32px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 15;
		pointer-events: none;
		font-family: 'Courier New', monospace;
		font-size: 11px;
		color: rgba(200, 230, 255, 0.3);
		letter-spacing: 2px;
		animation: pulse-hint 2s ease-in-out infinite;
	}
	@keyframes pulse-hint {
		0%,
		100% {
			opacity: 0.3;
		}
		50% {
			opacity: 0.7;
		}
	}
</style>
