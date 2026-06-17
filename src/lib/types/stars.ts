import type * as THREE from 'three';

export interface StarNode {
	id: string;
	position: [number, number, number];
	color: THREE.Color;
	intensity: number;
	radius: number;
	category: string;
	connections: string[];
}

export interface OrbitalPlane {
	category: string;
	radius: number;
	tilt: number;
	rotation: number;
	color: string;
}

export interface StarChart {
	nodes: StarNode[];
	planes: OrbitalPlane[];
	constellations: [string, string][];
}
