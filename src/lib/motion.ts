// maps p into 0→1 over the [start, end] subrange
export function phaseProgress(p: number, start: number, end: number): number {
	return Math.max(0, Math.min(1, (p - start) / (end - start)));
}

export function lerp(a: number, b: number, t: number): number {
	return a + (b - a) * t;
}
