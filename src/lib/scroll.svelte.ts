let y = $state(0);

// single module-level listener
if (typeof window !== 'undefined') {
	window.addEventListener(
		'scroll',
		() => {
			y = window.scrollY;
		},
		{ passive: true }
	);
}

export function useScroll() {
	return {
		get y() {
			return y;
		}
	};
}

export function useElementLayout(getEl: () => HTMLElement | null) {
	let offsetTop = $state(0);
	let offsetHeight = $state(0);

	$effect(() => {
		const el = getEl();
		if (!el) return;

		const update = () => {
			offsetTop = el.offsetTop;
			offsetHeight = el.offsetHeight;
		};
		update();

		const ro = new ResizeObserver(update);
		ro.observe(el);
		// also observe body so positional shifts are caught
		ro.observe(document.body);

		return () => ro.disconnect();
	});

	return {
		get offsetTop() {
			return offsetTop;
		},
		get offsetHeight() {
			return offsetHeight;
		}
	};
}

export function viewportProgress(scrollY: number, offsetTop: number, offsetHeight: number): number {
	if (!offsetHeight) return 0;
	return Math.max(0, Math.min(1, (scrollY - offsetTop) / offsetHeight));
}

export function stickyProgress(scrollY: number, offsetTop: number, offsetHeight: number): number {
	if (typeof window === 'undefined') return 0;

	const range = offsetHeight - window.innerHeight;
	if (range <= 0) return 0;
	return Math.max(0, Math.min(1, (scrollY - offsetTop) / range));
}
