import type { Particle, EngineConfig, MouseState } from './types';
import { DEFAULT_CONFIG } from './types';
import { createLayeredNoise } from './noise';

/**
 * Smoothstep interpolation for soft interaction-ring falloff.
 * Returns 0 at edge0, 1 at edge1, with smooth derivatives at both ends.
 */
function smoothstep(edge0: number, edge1: number, x: number): number {
	const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
	return t * t * (3 - 2 * t);
}

/**
 * Core particle simulation engine.
 *
 * Each particle has a permanent "home" reference position. Every frame:
 * 1. Layered simplex noise produces a displacement vector
 * 2. Low-amplitude sinusoidal motion adds rhythmic variation
 * 3. An interactive ring (driven by mouse position with inertia) applies
 *    an outward force on nearby particles
 * 4. A spring-damper pulls particles back toward their home positions
 *
 * The engine is pure TypeScript — it owns no DOM or rendering logic.
 * Multiple "windows" (cards) can share the same engine instance.
 */
export class ParticleEngine {
	particles: Particle[] = [];
	mouse: MouseState = {
		x: 0.5,
		y: 0.5,
		targetX: 0.5,
		targetY: 0.5,
		active: false
	};

	config: EngineConfig;

	private noiseFn: (x: number, y: number) => number;
	private time = 0;
	private width = 1;
	private height = 1;

	constructor(config: Partial<EngineConfig> = {}) {
		this.config = { ...DEFAULT_CONFIG, ...config };
		this.noiseFn = createLayeredNoise();
		this.initParticles();
	}

	// ---- Public API -------------------------------------------------------

	/** Inform the engine of the world dimensions (in pixels). */
	resize(width: number, height: number): void {
		this.width = width;
		this.height = height;
	}

	/** Update the raw mouse target (normalized 0–1). The engine applies inertia. */
	setMouse(x: number, y: number, active: boolean): void {
		this.mouse.targetX = Math.max(0, Math.min(1, x));
		this.mouse.targetY = Math.max(0, Math.min(1, y));
		this.mouse.active = active;
	}

	/** Advance the simulation by `dt` milliseconds. Call once per frame. */
	tick(dt: number): void {
		this.time += this.config.noiseSpeed * dt;

		// ---- Mouse inertia (exponential smoothing) --------------------------
		const inertia = 0.07;
		this.mouse.x += (this.mouse.targetX - this.mouse.x) * inertia;
		this.mouse.y += (this.mouse.targetY - this.mouse.y) * inertia;

		// ---- Ring "breathing" oscillation -----------------------------------
		const ringOscillation =
			Math.sin(this.time * this.config.ringOscillationSpeed) *
			this.config.ringOscillationAmplitude;
		const effectiveRadius =
			this.config.interactionRadius + ringOscillation;

		for (const p of this.particles) {
			// 1. Procedural noise displacement --------------------------------
			const nx = this.noiseFn(
				p.homeX * this.width * this.config.noiseScale + this.time,
				p.homeY * this.height * this.config.noiseScale
			);
			const ny = this.noiseFn(
				p.homeX * this.width * this.config.noiseScale,
				p.homeY * this.height * this.config.noiseScale + this.time + 1000
			);

			// 2. Subtle sinusoidal motion (prevents feeling "purely random") --
			const sinX = Math.sin(p.homeY * 4 + this.time * 0.4) * 0.25;
			const sinY = Math.cos(p.homeX * 4 + this.time * 0.4) * 0.25;

			// 3. Combined idle displacement target ----------------------------
			const targetDx = (nx + sinX) * this.config.noiseStrength;
			const targetDy = (ny + sinY) * this.config.noiseStrength;

			// 4. Interaction ring (outward push) ------------------------------
			if (this.mouse.active) {
				const dx = p.homeX - this.mouse.x;
				const dy = p.homeY - this.mouse.y;
				const dist = Math.sqrt(dx * dx + dy * dy);

				if (dist < effectiveRadius) {
					const force = smoothstep(effectiveRadius, 0, dist);
					const angle = Math.atan2(dy, dx);
					const impulse =
						force * this.config.interactionStrength * 0.008;
					p.vx += Math.cos(angle) * impulse;
					p.vy += Math.sin(angle) * impulse;
				}
			}

			// 5. Spring pull toward (home + noise displacement) ---------------
			const springTargetX = p.homeX + targetDx / this.width;
			const springTargetY = p.homeY + targetDy / this.height;

			p.vx += (springTargetX - p.x) * this.config.damping;
			p.vy += (springTargetY - p.y) * this.config.damping;

			// 6. Integrate velocity -------------------------------------------
			p.x += p.vx;
			p.y += p.vy;

			// 7. Velocity decay (prevents perpetual oscillation) --------------
			p.vx *= 0.92;
			p.vy *= 0.92;

			// 8. Visual properties (scale & brightness from displacement) -----
			const displacement = Math.sqrt(
				(p.x - p.homeX) ** 2 + (p.y - p.homeY) ** 2
			);
			p.scale = 1 + displacement * 3;
			p.brightness = Math.min(1, 0.35 + displacement * 2.5);
		}
	}

	// ---- Private -----------------------------------------------------------

	private initParticles(): void {
		this.particles = [];
		for (let i = 0; i < this.config.particleCount; i++) {
			this.particles.push({
				homeX: Math.random(),
				homeY: Math.random(),
				x: 0,
				y: 0,
				vx: 0,
				vy: 0,
				scale: 1,
				brightness: 0.35
			});
		}
		// Start particles at their home positions
		for (const p of this.particles) {
			p.x = p.homeX;
			p.y = p.homeY;
		}
	}
}
