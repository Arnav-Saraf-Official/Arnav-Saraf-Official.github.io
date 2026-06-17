/* eslint-disable svelte/prefer-svelte-reactivity */
import type { ProjectCategory, ProjectEntry } from '$lib/types/project';

let allProjects = $state<ProjectEntry[]>([]);
let selectedCategories = $state<Set<ProjectCategory>>(new Set());

const _projectsByCategory = $derived.by(() => {
	const map = new Map<ProjectCategory, ProjectEntry[]>();
	for (const p of allProjects) {
		const cat = p.metadata.category;
		if (!map.has(cat)) map.set(cat, []);
		map.get(cat)!.push(p);
	}
	return map;
});

const _sortedProjectsByCategory = $derived.by(() => {
	const map = new Map<ProjectCategory, ProjectEntry[]>();
	for (const [cat, entries] of _projectsByCategory) {
		map.set(
			cat,
			[...entries].sort((a, b) => (a.metadata.order ?? 99) - (b.metadata.order ?? 99))
		);
	}
	return map;
});

const _activeCategories = $derived([..._projectsByCategory.keys()]);

const _filteredProjects = $derived.by(() => {
	if (selectedCategories.size === 0) return allProjects;
	return allProjects.filter((p) => selectedCategories.has(p.metadata.category));
});

export const getAllProjects = () => allProjects;
export const getSelectedCategories = () => selectedCategories;
export const getProjectsByCategory = () => _projectsByCategory;
export const getSortedProjectsByCategory = () => _sortedProjectsByCategory;
export const getActiveCategories = () => _activeCategories;
export const getFilteredProjects = () => _filteredProjects;

export function initProjects(entries: ProjectEntry[]): void {
	allProjects = entries;
}

export function toggleCategory(cat: ProjectCategory): void {
	const next = new Set(selectedCategories);
	if (next.has(cat)) {
		next.delete(cat);
	} else {
		next.add(cat);
	}
	selectedCategories = next;
}

export function clearCategoryFilter(): void {
	selectedCategories = new Set();
}

export function getProjectBySlug(slug: string): ProjectEntry | undefined {
	return allProjects.find((p) => p.slug === slug);
}
