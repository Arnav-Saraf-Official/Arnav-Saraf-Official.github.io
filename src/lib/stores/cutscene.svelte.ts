interface CutsceneConfig {
	route: string;
	color: string;
	name: string;
}

let active = $state<CutsceneConfig | null>(null);

export const getCutscene = () => active;
export function startCutscene(cfg: CutsceneConfig) {
	active = cfg;
}
export function endCutscene() {
	active = null;
}
