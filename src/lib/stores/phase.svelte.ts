export type AppPhase = 'loading' | 'mobile' | 'launch' | 'boot' | 'capsule';

let currentPhase = $state<AppPhase>('loading');
let isTransitioning = $state(false);

export const getPhase = () => currentPhase;
export const getIsTransitioning = () => isTransitioning;

export function setPhase(p: AppPhase): void {
	currentPhase = p;
}

export function isPhase(p: AppPhase): boolean {
	return currentPhase === p;
}

export function advanceFromLaunch(): void {
	isTransitioning = true;
	currentPhase = 'boot';
}

export function advanceFromBoot(): void {
	isTransitioning = false;
	currentPhase = 'capsule';
}

export function skipToCapsule(): void {
	isTransitioning = false;
	currentPhase = 'capsule';
}
