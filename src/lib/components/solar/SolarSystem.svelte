<script lang="ts">
	import { onMount } from 'svelte';
	import { Canvas, T } from '@threlte/core';
	import { initInput } from '$lib/stores/input.svelte';
	import { initProjects, getAllProjects } from '$lib/stores/projects.svelte';
	import type { ProjectMeta, ProjectEntry } from '$lib/types/project';
	import CameraRig from './CameraRig.svelte';
	import Sun from './Sun.svelte';
	import ProjectPlanet from './ProjectPlanet.svelte';
	import AsteroidBelt from './AsteroidBelt.svelte';
	import AboutMoon from './AboutMoon.svelte';
	import ContactComet from './ContactComet.svelte';
	import Starfield from '$lib/components/space/Starfield.svelte';

	onMount(() => {
		const cleanupInput = initInput();
		const projectModules = import.meta.glob<{ metadata: ProjectMeta; default: unknown }>(
			'/src/projects/*.{svx,md}',
			{ eager: false }
		);
		const entries: ProjectEntry[] = Object.entries(projectModules).map(([path, loader]) => {
			const slug = path
				.split('/')
				.pop()!
				.replace(/\.(svx|md)$/, '');
			return {
				slug,
				metadata: { title: slug, description: '', category: 'other' as const, tags: [] },
				load: async () => {
					const mod = await loader();
					return { metadata: mod.metadata, default: mod.default };
				}
			};
		});
		initProjects(entries);
		for (const [path, loader] of Object.entries(projectModules)) {
			const slug = path
				.split('/')
				.pop()!
				.replace(/\.(svx|md)$/, '');
			loader().then((mod) => {
				const entry = getAllProjects().find((p) => p.slug === slug);
				if (entry && mod.metadata) entry.metadata = mod.metadata;
			});
		}
		return () => cleanupInput();
	});
</script>

<div class="solar-canvas-wrapper">
	<Canvas>
		<T.PerspectiveCamera makeDefault position={[9, 8, 18]} fov={55} near={0.1} far={120} />
		<CameraRig />
		<Starfield count={1200} radius={40} />
		<T.AmbientLight intensity={0.3} />
		<T.PointLight position={[0, 0, 0]} intensity={3.5} distance={120} decay={1.5} castShadow />
		<Sun />
		<!-- Concentric zones out from the Sun: About (inner) → belt → Projects → Contact -->
		<T.Group position={[4, 0.5, 0]}>
			<AboutMoon />
		</T.Group>
		<AsteroidBelt />
		<T.Group position={[11.5, 0, 0]}>
			<ProjectPlanet />
		</T.Group>
		<T.Group position={[16.5, 0.5, 3]}>
			<ContactComet />
		</T.Group>
	</Canvas>
</div>

<style>
	.solar-canvas-wrapper {
		position: fixed;
		inset: 0;
		z-index: 0;
		pointer-events: none;
	}
	.solar-canvas-wrapper :global(canvas) {
		width: 100% !important;
		height: 100% !important;
		pointer-events: all;
	}
</style>
