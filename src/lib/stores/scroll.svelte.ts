let scrollY = $state(0);
let scrollProgress = $state(0);
const SCROLL_MAX = 5000;

export const getScrollY = () => scrollY;
export const getScrollProgress = () => scrollProgress;

export function updateScroll(y: number): void {
	scrollY = y;
	scrollProgress = Math.max(0, Math.min(1, y / SCROLL_MAX));
}
