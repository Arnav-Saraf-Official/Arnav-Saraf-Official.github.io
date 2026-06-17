<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import type { ProjectMeta } from '$lib/types/project';
	import type { Component } from 'svelte';

	const projectModules = import.meta.glob<{ metadata: ProjectMeta; default: Component }>(
		'/src/projects/*.{svx,md}',
		{ eager: false }
	);

	let projectTitle = $state<string>('');
	let ProjectContent = $state<Component | null>(null);
	let notFound = $state(false);

	onMount(async () => {
		const slug = $page.params.slug;
		const match = Object.entries(projectModules).find(([path]) => {
			const s = path
				.split('/')
				.pop()!
				.replace(/\.(svx|md)$/, '');
			return s === slug;
		});

		if (!match) {
			notFound = true;
			return;
		}

		try {
			const [, loader] = match;
			const mod = await loader();
			projectTitle = mod.metadata?.title || slug;
			ProjectContent = mod.default;
		} catch {
			notFound = true;
		}
	});
</script>

<svelte:head>
	<title>{projectTitle || 'Project'} — Arnav Saraf</title>
</svelte:head>

{#if notFound}
	<div class="not-found">
		<h1>Signal Lost</h1>
		<p>This project does not exist in this star system.</p>
		<a href="/" rel="external">Return to Capsule</a>
	</div>
{:else if ProjectContent}
	<div class="project-page">
		<article class="prose">
			<ProjectContent />
		</article>
		<a href="/" class="back-link" rel="external">&laquo; Return to Capsule</a>
	</div>
{:else}
	<div class="loading">Acquiring signal...</div>
{/if}

<style>
	.not-found,
	.loading {
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: var(--capsule-bg);
		color: var(--text-primary);
		font-family: var(--font-mono);
		gap: 16px;
	}
	.not-found a,
	.back-link {
		color: var(--accent-cyan);
		text-decoration: none;
		font-family: var(--font-mono);
	}
	.not-found a:hover,
	.back-link:hover {
		text-shadow: var(--glow-cyan);
	}
	.project-page {
		max-width: 800px;
		margin: 0 auto;
		padding: 60px 24px;
		background: var(--capsule-bg);
		min-height: 100vh;
		color: var(--text-primary);
		font-family: var(--font-mono);
	}
	.project-page :global(h1) {
		color: var(--accent-cyan);
		font-size: 28px;
		margin-bottom: 8px;
	}
	.project-page :global(h2) {
		color: var(--text-bright);
		font-size: 18px;
		margin-top: 32px;
		margin-bottom: 8px;
	}
	.project-page :global(p) {
		color: var(--text-dim);
		font-size: 14px;
		line-height: 1.7;
	}
	.project-page :global(ul) {
		color: var(--text-dim);
		font-size: 14px;
		line-height: 1.7;
		padding-left: 20px;
	}
	.back-link {
		display: inline-block;
		margin-top: 40px;
		font-size: 14px;
	}
	.loading {
		font-size: 14px;
		color: var(--text-dim);
	}
</style>
