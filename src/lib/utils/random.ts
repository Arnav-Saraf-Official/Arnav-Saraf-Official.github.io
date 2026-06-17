/**
 * Seeded pseudo-random number generator (mulberry32 variant).
 * Returns a function that produces values in [0, 1) deterministically.
 */
export function createSeededRandom(seed: number): () => number {
	let s = seed | 0;
	return () => {
		s = (s + 0x6d2b79f5) | 0;
		let t = Math.imul(s ^ (s >>> 15), 1 | s);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** Random float in [min, max) */
export function range(rng: () => number, min: number, max: number): number {
	return min + rng() * (max - min);
}

/** Random integer in [min, max] */
export function intRange(rng: () => number, min: number, max: number): number {
	return Math.floor(range(rng, min, max + 1));
}
