<script lang="ts">
	import { onMount } from 'svelte';
	import PlanetSurface from '$lib/components/solar/PlanetSurface.svelte';
	import { initProjects, getAllProjects } from '$lib/stores/projects.svelte';
	import type { ProjectMeta, ProjectEntry } from '$lib/types/project';

	let projects = $derived(getAllProjects());

	onMount(() => {
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
	});
</script>

<PlanetSurface
	planetName="PROJECTS"
	skyColor="#0a1030"
	horizonColor="#1a3050"
	groundColor="#0f1a30"
	cloudColor="#335577"
	starColor="#aaccff"
	particleColor="#4488cc"
>
	<div class="content">
		<section>
			<h2>PROJECTS</h2>
			<p>
				Orbital missions and builds. Each one is a deployed experiment in making the web feel alive.
			</p>
		</section>
		<section class="project-grid-section" style="width: 100%;">
			<div class="project-grid">
				{#each projects as project (project.slug)}
					<a href="/projects/{project.slug}" class="project-card">
						<span class="proj-name">{project.metadata.title}</span>
						<span class="proj-cat">{project.metadata.category}</span>
						{#if project.metadata.description}
							<span class="proj-desc">{project.metadata.description}</span>
						{/if}
					</a>
				{/each}
				{#if projects.length === 0}
					<p class="empty">No missions deployed yet. Add .svx files to src/projects/</p>
				{/if}
			</div>
		</section>
	</div>
</PlanetSurface>

<style>
	.content {
		max-width: 640px;
		margin: 0 auto;
	}
	section {
		margin-bottom: 48px;
	}
	h2 {
		font-family: 'Courier New', monospace;
		font-size: 18px;
		color: rgba(200, 230, 255, 0.8);
		letter-spacing: 4px;
		margin: 0 0 12px;
		font-weight: normal;
	}
	p {
		font-family: 'Courier New', monospace;
		font-size: 13px;
		color: rgba(200, 230, 255, 0.45);
		line-height: 1.8;
		margin: 0;
	}
	.project-grid {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.project-card {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 14px 16px;
		background: rgba(255, 255, 255, 0.02);
		border: 1px solid rgba(255, 255, 255, 0.05);
		text-decoration: none;
		transition: all 0.2s;
	}
	.project-card:hover {
		background: rgba(0, 200, 255, 0.04);
		border-color: rgba(0, 200, 255, 0.15);
	}
	.proj-name {
		font-family: 'Courier New', monospace;
		font-size: 15px;
		color: #c8e6ff;
	}
	.proj-cat {
		font-family: 'Courier New', monospace;
		font-size: 10px;
		color: rgba(200, 230, 255, 0.3);
		text-transform: uppercase;
		letter-spacing: 2px;
	}
	.proj-desc {
		font-family: 'Courier New', monospace;
		font-size: 12px;
		color: rgba(200, 230, 255, 0.4);
		line-height: 1.5;
		margin-top: 4px;
	}
	.empty {
		font-family: 'Courier New', monospace;
		font-size: 12px;
		color: rgba(200, 230, 255, 0.25);
	}
</style>
