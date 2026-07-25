import { ParticleEngine } from './engine';
import type { EngineConfig } from './types';

/** The shared particle engine instance. Initialized by ParticleWorld. */
export let engine: ParticleEngine | null = null;

/** Create (or recreate) the shared engine. Called once by ParticleWorld. */
export function initEngine(config?: Partial<EngineConfig>): ParticleEngine {
	engine = new ParticleEngine(config);
	return engine;
}
