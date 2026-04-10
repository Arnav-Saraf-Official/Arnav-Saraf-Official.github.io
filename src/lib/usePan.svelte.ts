// creates an isolated pan state instance
export function createPan() {
	let x = $state(0);
	let y = $state(0);

	// attach to a DOM element; returns a cleanup fn
	function attach(el: HTMLElement): () => void {
		let targetX = 0;
		let targetY = 0;
		let rafId = 0;
		let visible = false;

		const onMove = (e: PointerEvent) => {
			const r = el.getBoundingClientRect();
			// normalize to -1..1
			targetX = ((e.clientX - r.left) / r.width) * 2 - 1;
			targetY = ((e.clientY - r.top) / r.height) * 2 - 1;
		};

		// ease back to center when pointer leaves
		const onLeave = () => {
			targetX = 0;
			targetY = 0;
		};

		const tick = () => {
			if (!visible) {
				rafId = 0;
				return;
			}
			x += (targetX - x) * 0.08;
			y += (targetY - y) * 0.08;
			rafId = requestAnimationFrame(tick);
		};

		const io = new IntersectionObserver(
			([entry]) => {
				visible = entry.isIntersecting;
				if (visible && rafId === 0) {
					rafId = requestAnimationFrame(tick);
				}
			},
			{ threshold: 0 }
		);
		io.observe(el);

		el.addEventListener('pointermove', onMove);
		el.addEventListener('pointerleave', onLeave);

		return () => {
			cancelAnimationFrame(rafId);
			io.disconnect();
			el.removeEventListener('pointermove', onMove);
			el.removeEventListener('pointerleave', onLeave);
		};
	}

	return {
		get x() {
			return x;
		},
		get y() {
			return y;
		},
		attach
	};
}
