import { createNoise2D } from 'simplex-noise';

/**
 * Creates a layered simplex-noise function that combines multiple octaves
 * at different frequencies. This produces organic, fluid-like motion
 * without visible repeating patterns.
 */
export function createLayeredNoise(seed?: () => number): (x: number, y: number) => number {
	const layers = [
		{ noise: createNoise2D(seed), scale: 0.8, weight: 0.50 },
		{ noise: createNoise2D(seed), scale: 1.7, weight: 0.30 },
		{ noise: createNoise2D(seed), scale: 3.5, weight: 0.15 },
		{ noise: createNoise2D(seed), scale: 7.0, weight: 0.05 }
	];

	return (x: number, y: number): number => {
		let value = 0;
		for (const layer of layers) {
			value += layer.noise(x * layer.scale, y * layer.scale) * layer.weight;
		}
		return value;
	};
}
