let y = $state(0);

export function useScroll() {
	$effect(() => {
		const update = () => {
			y = window.scrollY;
		};
		window.addEventListener('scroll', update, { passive: true });
		return () => window.removeEventListener('scroll', update);
	});

	return {
		get y() {
			return y;
		}
	};
}

// 0 when element top reaches viewport top, 1 when element has fully scrolled off top
// gives the full 0→1 range while the element is actively in/leaving the viewport
export function viewportProgress(scrollY: number, el: HTMLElement | null): number {
	if (!el) return 0;
	const top = el.getBoundingClientRect().top + scrollY;
	const h = el.offsetHeight;
	return Math.max(0, Math.min(1, (scrollY - top) / h));
}
