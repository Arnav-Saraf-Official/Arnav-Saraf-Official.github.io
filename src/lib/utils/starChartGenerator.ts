import * as THREE from 'three';
import type { StarChart, StarNode, OrbitalPlane } from '$lib/types/stars';
import type { ProjectEntry } from '$lib/types/project';
import { createSeededRandom } from './random';

const CATEGORY_COLORS: Record<string, string> = {
	web: '#00ddff',
	ml: '#ff44ff',
	game: '#44ff44',
	other: '#ffaa00'
};

export function generateStarChart(projects: ProjectEntry[], seed: number = 42): StarChart {
	const rng = createSeededRandom(seed);

	const categorySet = new Set(projects.map((p) => p.metadata.category));
	const categories = [...categorySet];

	// Create orbital planes — one concentric ring per category
	const baseRadius = 2.2;
	const planes: OrbitalPlane[] = categories.map((cat, i) => ({
		category: cat,
		radius: baseRadius + i * 0.9,
		tilt: rng() * Math.PI * 0.12,
		rotation: rng() * Math.PI * 2,
		color: CATEGORY_COLORS[cat] || '#888888'
	}));

	// Place nodes on their category's ring
	const nodes: StarNode[] = [];
	for (const proj of projects) {
		const plane = planes.find((p) => p.category === proj.metadata.category);
		if (!plane) continue;

		const siblings = projects.filter((p) => p.metadata.category === proj.metadata.category);
		const sorted = siblings.sort((a, b) => (a.metadata.order ?? 99) - (b.metadata.order ?? 99));
		const idx = sorted.indexOf(proj);
		const total = siblings.length;

		const angleOffset = (idx / total) * Math.PI * 2;
		const angle = angleOffset + plane.rotation;
		const x = Math.cos(angle) * plane.radius;
		const z = Math.sin(angle) * plane.radius;
		const y = Math.sin(angle + plane.tilt) * 0.4;

		nodes.push({
			id: proj.slug,
			position: [x, y, z],
			color: new THREE.Color(plane.color),
			intensity: 0.6 + rng() * 0.4,
			radius: 0.08 + rng() * 0.12,
			category: proj.metadata.category,
			connections: []
		});
	}

	// Connect related projects via shared tags
	const connectionCount = new Map<string, number>();
	const constellations: [string, string][] = [];

	// Score all pairs by shared tag count
	const pairs: { a: number; b: number; score: number }[] = [];
	for (let i = 0; i < projects.length; i++) {
		for (let j = i + 1; j < projects.length; j++) {
			const score = projects[i].metadata.tags.filter((t) =>
				projects[j].metadata.tags.includes(t)
			).length;
			if (score > 0) {
				pairs.push({ a: i, b: j, score });
			}
		}
	}

	// Sort by score descending, then keep at most 2 connections per node
	pairs.sort((a, b) => b.score - a.score);
	for (const { a, b } of pairs) {
		const ca = connectionCount.get(projects[a].slug) ?? 0;
		const cb = connectionCount.get(projects[b].slug) ?? 0;
		if (ca < 2 && cb < 2) {
			constellations.push([projects[a].slug, projects[b].slug]);
			connectionCount.set(projects[a].slug, ca + 1);
			connectionCount.set(projects[b].slug, cb + 1);
			nodes[a].connections.push(projects[b].slug);
			nodes[b].connections.push(projects[a].slug);
		}
	}

	return { nodes, planes, constellations };
}
