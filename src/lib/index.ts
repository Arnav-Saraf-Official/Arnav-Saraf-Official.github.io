// Types
export type { ProjectMeta, ProjectEntry, ProjectCategory } from './types/project';
export type { StarNode, OrbitalPlane, StarChart } from './types/stars';

// Stores
export {
	getPhase,
	setPhase,
	isPhase,
	advanceFromLaunch,
	advanceFromBoot,
	skipToCapsule
} from './stores/phase.svelte';
export type { AppPhase } from './stores/phase.svelte';
export {
	getSelectedSection,
	getSelectedProjectId,
	getIsWarping,
	getDestinationType,
	navigateToSection,
	selectProject,
	clearProject,
	startWarp,
	endWarp
} from './stores/navigation.svelte';
export type { Section, Destination } from './stores/navigation.svelte';
export {
	getAllProjects,
	initProjects,
	getFilteredProjects,
	getActiveCategories,
	getSelectedCategories,
	toggleCategory,
	clearCategoryFilter,
	getProjectBySlug
} from './stores/projects.svelte';

// Utils
export { generateStarChart } from './utils/starChartGenerator';
export { isMobile } from './utils/mobileDetect';
export { createSeededRandom, range, intRange } from './utils/random';
