let y = $state(0);

// single module-level listener
if (typeof window !== 'undefined') {
	window.addEventListener('scroll', () => { y = window.scrollY; }, { passive: true });
}

export function useScroll() {
	return { get y() { return y; } };
}

export function viewportProgress(scrollY: number, el: HTMLElement | null): number {
	if (!el) return 0;
	const top = el.getBoundingClientRect().top + scrollY;
	return Math.max(0, Math.min(1, (scrollY - top) / el.offsetHeight));
}

export function stickyProgress(scrollY: number, el: HTMLElement | null): number {
	if (!el) return 0;
	const top = el.getBoundingClientRect().top + scrollY;
	const range = el.offsetHeight - window.innerHeight;
	if (range <= 0) return 0;
	return Math.max(0, Math.min(1, (scrollY - top) / range));
}
