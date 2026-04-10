// 2D camera state
// each layer receives a depth (0=far, 1=near) and responds proportionally

export interface Camera {
	panX: number; // horizontal look, -1..1
	panY: number; // vertical look, 0=level 1=looking down
	zoom: number; // forward movement, 0..1+
}

const PAN  = 260; // px travel
const ZOOM = 0.44; // scale multiplier

export function layerTransform(cam: Camera, depth: number): string {
	const tx = cam.panX * depth * PAN * 0.4;
	const ty = -cam.panY * depth * PAN;
	const sc = 1 + cam.zoom * depth * ZOOM;
	return `translate3d(${tx.toFixed(1)}px,${ty.toFixed(1)}px,0) scale(${sc.toFixed(5)})`;
}
