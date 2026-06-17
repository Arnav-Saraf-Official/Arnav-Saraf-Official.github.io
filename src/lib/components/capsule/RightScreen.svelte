<script lang="ts">
	import { getSelectedSection, getSelectedProjectId } from '$lib/stores/navigation.svelte';
	import { getAllProjects } from '$lib/stores/projects.svelte';

	let currentProject = $derived.by(() => {
		if (!getSelectedProjectId()) return null;
		return getAllProjects().find((p) => p.slug === getSelectedProjectId()) ?? null;
	});
</script>

<div class="screen-title">DATA LINK</div>

{#if currentProject}
	{#if currentProject.metadata.liveUrl}
		<div class="screen-label">LIVE SITE</div>
		<a
			class="screen-link"
			href={currentProject.metadata.liveUrl}
			target="_blank"
			rel="external noopener"
		>
			&raquo; {currentProject.metadata.liveUrl}
		</a>
	{/if}

	{#if currentProject.metadata.sourceUrl}
		<div class="screen-label">SOURCE CODE</div>
		<a
			class="screen-link"
			href={currentProject.metadata.sourceUrl}
			target="_blank"
			rel="external noopener"
		>
			&raquo; {currentProject.metadata.sourceUrl}
		</a>
	{/if}

	{#if currentProject.metadata.caseStudyUrl}
		<div class="screen-label">CASE STUDY</div>
		<a
			class="screen-link"
			href={currentProject.metadata.caseStudyUrl}
			target="_blank"
			rel="external noopener"
		>
			&raquo; Read Case Study
		</a>
	{/if}

	{#if !currentProject.metadata.liveUrl && !currentProject.metadata.sourceUrl && !currentProject.metadata.caseStudyUrl}
		<p style="color: var(--text-dim); font-size: 12px; margin-top: 8px;">
			No external links available for this project.
		</p>
	{/if}
{:else if getSelectedSection() === 'contact'}
	<div class="screen-label">GITHUB</div>
	<a
		class="screen-link"
		href="https://github.com/arnav-saraf-official"
		target="_blank"
		rel="external noopener"
	>
		&raquo; github.com/arnav-saraf-official
	</a>

	<div class="screen-label">EMAIL</div>
	<div class="screen-value">contact@arnavsaraf.dev</div>

	<div class="screen-label">LOCATION</div>
	<div class="screen-value">Earth, Sol System</div>
{:else if getSelectedSection() === 'about'}
	<div class="screen-label">MISSION STATUS</div>
	<div class="screen-value">ON STATION</div>

	<div class="screen-label">VESSEL</div>
	<div class="screen-value">PORTFOLIO-1</div>

	<div class="screen-label">SIGNAL</div>
	<div class="screen-value">NOMINAL</div>
{:else}
	<p style="color: var(--text-dim); font-size: 12px; margin-top: 8px;">
		Select a target from the hologram to establish data link.
	</p>
{/if}
