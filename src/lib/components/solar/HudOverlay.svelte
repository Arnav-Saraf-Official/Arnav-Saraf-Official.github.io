<script lang="ts">
	import { getSelectedProjectId, clearProject } from '$lib/stores/navigation.svelte';
	import { getAllProjects } from '$lib/stores/projects.svelte';

	let currentProject = $derived.by(() => {
		const id = getSelectedProjectId();
		if (!id) return null;
		return getAllProjects().find((p) => p.slug === id) ?? null;
	});
</script>

<div class="hud-container">
	<div class="controls-hint">
		<span>WASD</span> move &bull; <span>QE</span> turn &bull; <span>Space/Shift</span> elevate
	</div>

	{#if currentProject}
		<div class="project-panel">
			<button class="close-btn" onclick={clearProject}>x</button>
			<h2>{currentProject.metadata.title}</h2>
			<p class="desc">{currentProject.metadata.description}</p>
			<div class="tags">
				{#each currentProject.metadata.tags as tag (tag)}
					<span class="tag">{tag}</span>
				{/each}
			</div>
			{#if currentProject.metadata.liveUrl || currentProject.metadata.sourceUrl}
				<div class="links">
					{#if currentProject.metadata.liveUrl}
						<a href={currentProject.metadata.liveUrl} target="_blank" rel="external noopener"
							>Live Site</a
						>
					{/if}
					{#if currentProject.metadata.sourceUrl}
						<a href={currentProject.metadata.sourceUrl} target="_blank" rel="external noopener"
							>Source</a
						>
					{/if}
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.hud-container {
		position: fixed;
		inset: 0;
		z-index: 10;
		pointer-events: none;
		font-family: 'Courier New', monospace;
	}
	.controls-hint {
		position: absolute;
		bottom: 24px;
		left: 50%;
		transform: translateX(-50%);
		font-size: 11px;
		color: rgba(200, 230, 255, 0.35);
		letter-spacing: 1px;
	}
	.controls-hint span {
		color: rgba(200, 230, 255, 0.55);
	}
	.project-panel {
		position: absolute;
		bottom: 56px;
		left: 32px;
		max-width: 480px;
		background: rgba(8, 10, 28, 0.92);
		border: 1px solid rgba(0, 150, 220, 0.3);
		padding: 20px 24px;
		pointer-events: all;
		backdrop-filter: blur(8px);
	}
	.project-panel h2 {
		font-size: 16px;
		color: rgb(200, 230, 255);
		margin: 0 0 8px;
		font-weight: normal;
	}
	.project-panel .desc {
		font-size: 12px;
		color: rgba(200, 230, 255, 0.6);
		line-height: 1.5;
		margin: 0 0 12px;
	}
	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-bottom: 12px;
	}
	.tag {
		padding: 2px 10px;
		border: 1px solid rgba(0, 200, 255, 0.25);
		font-size: 11px;
		color: rgb(0, 200, 255);
	}
	.links {
		display: flex;
		gap: 16px;
	}
	.links a {
		color: rgb(0, 200, 255);
		font-size: 12px;
		text-decoration: none;
	}
	.links a:hover {
		color: white;
		text-shadow: 0 0 8px rgba(0, 200, 255, 0.5);
	}
	.close-btn {
		position: absolute;
		top: 12px;
		right: 14px;
		background: none;
		border: 1px solid rgba(255, 255, 255, 0.15);
		color: rgba(255, 255, 255, 0.6);
		font-size: 18px;
		cursor: pointer;
		padding: 0 6px;
		line-height: 1;
	}
	.close-btn:hover {
		color: white;
		border-color: rgba(255, 255, 255, 0.4);
	}
</style>
