export type Section = 'about' | 'projects' | 'contact';
export type Destination = 'station' | 'satellite' | 'nebula';

let selectedSection = $state<Section | null>(null);
let selectedProjectId = $state<string | null>(null);
let isWarping = $state(false);

export const getSelectedSection = () => selectedSection;
export const getSelectedProjectId = () => selectedProjectId;
export const getIsWarping = () => isWarping;

export const getDestinationType = (): Destination | null => {
	if (selectedSection) return 'station';
	if (selectedProjectId) return 'satellite';
	return 'nebula';
};

export function navigateToSection(section: Section): void {
	selectedSection = section;
	selectedProjectId = null;
}

export function selectProject(id: string): void {
	selectedProjectId = id;
	selectedSection = null;
}

export function clearProject(): void {
	selectedProjectId = null;
}

export function startWarp(): void {
	isWarping = true;
}

export function endWarp(): void {
	isWarping = false;
}
