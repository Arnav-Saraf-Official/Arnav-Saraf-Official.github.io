export type PlanetTarget = 'sun' | 'projects' | 'about' | 'contact' | null;

let target = $state<PlanetTarget>(null);
let isLanding = $state(false);
let isLanded = $state(false);
let landingProgress = $state(0); // 0..1

export const getLandingTarget = () => target;
export const getIsLanding = () => isLanding;
export const getIsLanded = () => isLanded;
export const getLandingProgress = () => landingProgress;

export function startLanding(t: PlanetTarget) {
	target = t;
	isLanding = true;
	isLanded = false;
	landingProgress = 0;
}

export function setLandingProgress(p: number) {
	landingProgress = p;
	if (p >= 1) {
		isLanding = false;
		isLanded = true;
	}
}

export function takeOff() {
	target = null;
	isLanding = false;
	isLanded = false;
	landingProgress = 0;
}
