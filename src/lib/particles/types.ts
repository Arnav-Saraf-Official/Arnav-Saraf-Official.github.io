/** A single particle in the shared simulation world. */
export interface Particle {
	/** Permanent reference (home) position in normalized 0–1 space. */
	homeX: number;
	homeY: number;
	/** Current displaced position. */
	x: number;
	y: number;
	/** Velocity for smooth spring-back motion. */
	vx: number;
	vy: number;
	/** Visual scale (1 = base size). */
	scale: number;
	/** Visual brightness (0 = dim, 1 = bright). */
	brightness: number;
}

/** Configuration knobs for the particle engine. */
export interface EngineConfig {
	/** Total number of particles in the simulation. */
	particleCount: number;
	/** Base spatial frequency of the procedural noise field. */
	noiseScale: number;
	/** Maximum pixel displacement from noise. */
	noiseStrength: number;
	/** How quickly the noise field evolves over time. */
	noiseSpeed: number;
	/** Spring-back damping factor (0–1, higher = faster return to home). */
	damping: number;
	/** Normalized radius (0–1) of the mouse interaction ring. */
	interactionRadius: number;
	/** Strength of the outward push from the interaction ring. */
	interactionStrength: number;
	/** Oscillation speed of the interaction ring breathing effect. */
	ringOscillationSpeed: number;
	/** Oscillation amplitude of the ring radius. */
	ringOscillationAmplitude: number;
}

/** Global mouse state with inertia smoothing. */
export interface MouseState {
	/** Current smoothed position (normalized 0–1). */
	x: number;
	y: number;
	/** Raw target position from the latest pointer event. */
	targetX: number;
	targetY: number;
	/** Whether the cursor is currently over the viewport. */
	active: boolean;
}

/** Default engine config — tuned for a calm, fluid feel. */
export const DEFAULT_CONFIG: EngineConfig = {
	particleCount: 250,
	noiseScale: 0.004,
	noiseStrength: 25,
	noiseSpeed: 0.00035,
	damping: 0.018,
	interactionRadius: 0.14,
	interactionStrength: 45,
	ringOscillationSpeed: 0.6,
	ringOscillationAmplitude: 0.025
};
