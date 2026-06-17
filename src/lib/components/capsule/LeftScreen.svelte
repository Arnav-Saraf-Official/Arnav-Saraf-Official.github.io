<script lang="ts">
	import { getSelectedSection, getSelectedProjectId } from '$lib/stores/navigation.svelte';
	import { getAllProjects } from '$lib/stores/projects.svelte';

	let currentProject = $derived.by(() => {
		if (!getSelectedProjectId()) return null;
		return getAllProjects().find((p) => p.slug === getSelectedProjectId()) ?? null;
	});

	let title = $derived(currentProject ? currentProject.metadata.title : 'NO TARGET SELECTED');
	let description = $derived(currentProject ? currentProject.metadata.description : '');
	let tags = $derived(currentProject ? currentProject.metadata.tags : []);
	let category = $derived(currentProject ? currentProject.metadata.category : '---');

	let sectionLabel = $derived.by(() => {
		if (getSelectedSection() === 'about') return 'ABOUT';
		if (getSelectedSection() === 'contact') return 'CONTACT';
		if (currentProject) return 'PROJECT';
		return 'STANDBY';
	});
</script>

<div class="screen-title">MISSION LOG — {sectionLabel}</div>

{#if currentProject}
	<h2 style="color: var(--text-bright); font-size: 16px; margin-bottom: 8px;">{title}</h2>
	<p style="color: var(--text-dim); font-size: 12px; line-height: 1.6; margin-bottom: 16px;">
		{description}
	</p>

	<div class="screen-label">CATEGORY</div>
	<div class="screen-value">{category}</div>

	<div class="screen-label">TECHNOLOGIES</div>
	<div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px;">
		{#each tags as tag (tag)}
			<span
				style="padding: 2px 8px; border: 1px solid rgba(0, 200, 255, 0.2); font-size: 11px; color: var(--accent-cyan);"
			>
				{tag}
			</span>
		{/each}
	</div>
{:else if getSelectedSection() === 'about'}
	<h2 style="color: var(--text-bright); font-size: 16px; margin-bottom: 8px;">ARNAV SARAF</h2>
	<p style="color: var(--text-dim); font-size: 12px; line-height: 1.6;">
		Full-stack developer &amp; creative technologist. Building at the intersection of 3D graphics,
		machine learning, and web engineering.
	</p>
{:else if getSelectedSection() === 'contact'}
	<h2 style="color: var(--text-bright); font-size: 16px; margin-bottom: 8px;">COMMS CHANNEL</h2>
	<p style="color: var(--text-dim); font-size: 12px; line-height: 1.6;">
		Select a project or use the right panel for contact links.
	</p>
{:else}
	<p style="color: var(--text-dim); font-size: 12px; line-height: 1.6;">
		Select a star node from the hologram to view project details.
	</p>
{/if}
