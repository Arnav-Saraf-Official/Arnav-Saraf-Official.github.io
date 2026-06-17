<script lang="ts">
	import { getIsLanded, getLandingTarget, takeOff } from '$lib/stores/landing.svelte';
	import type { PlanetTarget } from '$lib/stores/landing.svelte';
	import { getAllProjects, getFilteredProjects } from '$lib/stores/projects.svelte';
	import { selectProject } from '$lib/stores/navigation.svelte';

	let target = $derived(getLandingTarget());
	let isLanded = $derived(getIsLanded());

	let projects = $derived(getAllProjects());

	const pageContent: Record<string, { title: string; subtitle: string }> = {
		sun: { title: 'ARNAV SARAF', subtitle: 'Creative Technologist & Developer' },
		projects: { title: 'PROJECTS', subtitle: 'Orbital missions and builds' },
		about: { title: 'ABOUT', subtitle: 'The astronaut behind the visor' },
		contact: { title: 'CONTACT', subtitle: 'Open a comms channel' }
	};

	let content = $derived(target ? pageContent[target] : null);
</script>

{#if isLanded && target && content}
	<div class="surface-overlay">
		<div class="surface-sky"></div>

		<div class="surface-content">
			<h1 class="surface-title">{content.title}</h1>
			<p class="surface-subtitle">{content.subtitle}</p>

			{#if target === 'sun'}
				<div class="bio-section">
					<div class="bio-stat">
						<span class="stat-label">ROLE</span>
						<span class="stat-value">Full-Stack Developer</span>
					</div>
					<div class="bio-stat">
						<span class="stat-label">SPECIALTY</span>
						<span class="stat-value">3D Web, ML, Creative Tools</span>
					</div>
					<div class="bio-stat">
						<span class="stat-label">LOCATION</span>
						<span class="stat-value">Earth, Sol System</span>
					</div>
				</div>
			{:else if target === 'projects'}
				<div class="project-list">
					{#each projects as project (project.slug)}
						<button
							class="project-card"
							onclick={() => selectProject(project.slug)}
							onkeydown={(e: KeyboardEvent) => e.key === 'Enter' && selectProject(project.slug)}
						>
							<span class="proj-name">{project.metadata.title}</span>
							<span class="proj-cat">{project.metadata.category}</span>
						</button>
					{/each}
					{#if projects.length === 0}
						<p class="empty-msg">No missions deployed yet. Add .svx files to src/projects/</p>
					{/if}
				</div>
			{:else if target === 'about'}
				<div class="about-text">
					<p>
						Developer and creative technologist passionate about building at the intersection of 3D
						graphics, machine learning, and web engineering.
					</p>
					<p>
						This portfolio is a real-time 3D solar system. Fly around. Explore. Everything you see
						runs in the browser.
					</p>
				</div>
			{:else if target === 'contact'}
				<div class="contact-links">
					<a
						class="contact-link"
						href="https://github.com/arnav-saraf-official"
						target="_blank"
						rel="external noopener">GITHUB</a
					>
					<a class="contact-link" href="mailto:contact@arnavsaraf.dev">EMAIL</a>
				</div>
			{/if}
		</div>

		<div class="surface-ground"></div>
	</div>
{/if}

<style>
	.surface-overlay {
		position: fixed;
		inset: 0;
		z-index: 20;
		pointer-events: all;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		font-family: 'Courier New', monospace;
	}
	.surface-sky {
		flex: 1;
		background: linear-gradient(to bottom, #010108 0%, #0a0a20 60%, #1a1a30 100%);
	}
	.surface-content {
		padding: 40px 32px 120px;
		background: linear-gradient(to bottom, transparent, rgba(5, 8, 20, 0.95) 30%);
	}
	.surface-title {
		font-size: 32px;
		color: #c8e6ff;
		font-weight: normal;
		letter-spacing: 6px;
		margin: 0 0 4px;
	}
	.surface-subtitle {
		font-size: 13px;
		color: rgba(200, 230, 255, 0.45);
		letter-spacing: 2px;
		margin: 0 0 32px;
	}
	.surface-ground {
		height: 40px;
		background: linear-gradient(to bottom, #1a1a30, #0a0a14);
		border-top: 1px solid rgba(255, 255, 255, 0.05);
	}

	.bio-section {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.bio-stat {
		display: flex;
		gap: 16px;
		align-items: baseline;
	}
	.stat-label {
		font-size: 11px;
		color: rgba(200, 230, 255, 0.35);
		letter-spacing: 3px;
		min-width: 90px;
	}
	.stat-value {
		font-size: 14px;
		color: #c8e6ff;
	}

	.project-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
		max-width: 500px;
	}
	.project-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px 16px;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.06);
		cursor: pointer;
		text-align: left;
		font-family: inherit;
		transition:
			background 0.2s,
			border-color 0.2s;
	}
	.project-card:hover {
		background: rgba(0, 200, 255, 0.06);
		border-color: rgba(0, 200, 255, 0.2);
	}
	.proj-name {
		font-size: 14px;
		color: #c8e6ff;
	}
	.proj-cat {
		font-size: 11px;
		color: rgba(200, 230, 255, 0.35);
		text-transform: uppercase;
		letter-spacing: 2px;
	}
	.empty-msg {
		font-size: 12px;
		color: rgba(200, 230, 255, 0.3);
	}

	.about-text {
		max-width: 560px;
	}
	.about-text p {
		font-size: 13px;
		color: rgba(200, 230, 255, 0.5);
		line-height: 1.7;
		margin-bottom: 12px;
	}

	.contact-links {
		display: flex;
		gap: 24px;
	}
	.contact-link {
		padding: 10px 24px;
		border: 1px solid rgba(0, 200, 255, 0.3);
		color: #00ddff;
		text-decoration: none;
		font-size: 13px;
		letter-spacing: 3px;
		transition: all 0.2s;
	}
	.contact-link:hover {
		background: rgba(0, 200, 255, 0.1);
		text-shadow: 0 0 10px rgba(0, 200, 255, 0.5);
	}
</style>
