<script lang="ts">
	import { navigateToSection, getSelectedSection } from '$lib/stores/navigation.svelte';
	import {
		getActiveCategories,
		getSelectedCategories,
		toggleCategory,
		clearCategoryFilter
	} from '$lib/stores/projects.svelte';
	import { playClick } from '$lib/stores/audio.svelte';
	import type { ProjectCategory } from '$lib/types/project';
	import type { Section } from '$lib/stores/navigation.svelte';

	const sections: Array<{ id: Section; label: string }> = [
		{ id: 'about', label: 'ABOUT' },
		{ id: 'projects', label: 'PROJECTS' },
		{ id: 'contact', label: 'CONTACT' }
	];

	const categoryColors: Record<ProjectCategory, string> = {
		web: '#00ddff',
		ml: '#ff44ff',
		game: '#44ff44',
		other: '#ffaa00'
	};

	function handleSection(section: Section) {
		playClick();
		navigateToSection(section);
	}

	function handleToggle(cat: ProjectCategory) {
		playClick();
		toggleCategory(cat);
	}
</script>

<div style="display: flex; align-items: center; gap: 32px;">
	{#each sections as section (section.id)}
		<button
			class="ctrl-btn"
			class:active={getSelectedSection() === section.id}
			onclick={() => handleSection(section.id)}
		>
			{section.label}
		</button>
	{/each}

	<div style="width: 1px; height: 24px; background: var(--panel-border);"></div>

	{#each getActiveCategories() as cat (cat)}
		{@const isOn = getSelectedCategories().has(cat)}
		<button
			class="ctrl-toggle"
			class:on={isOn}
			style={isOn
				? 'border-color: ' + categoryColors[cat] + '; color: ' + categoryColors[cat] + ';'
				: ''}
			onclick={() => handleToggle(cat)}
		>
			{cat}
		</button>
	{/each}

	{#if getSelectedCategories().size > 0}
		<button
			class="ctrl-toggle"
			style="color: #ff4444; border-color: rgba(255, 68, 68, 0.4);"
			onclick={() => {
				playClick();
				clearCategoryFilter();
			}}
		>
			CLEAR
		</button>
	{/if}
</div>
