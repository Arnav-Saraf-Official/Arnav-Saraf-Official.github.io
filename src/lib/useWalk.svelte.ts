/*
street-view style navigation.
createWalk(totalPx) -> `x` (0..totalPx) & `attach`
function that captures wheel events on the given element
*/
export function createWalk(totalPx: number) {
	let x = $state(0);
	let targetX = 0;

	function attach(el: HTMLElement): () => void {
		let rafId = 0;

		const tick = () => {
			x += (targetX - x) * 0.1;
			if (Math.abs(targetX - x) > 0.1) {
				rafId = requestAnimationFrame(tick);
			} else {
				x = targetX;
				rafId = 0;
			}
		};

		const onWheel = (e: WheelEvent) => {
			e.preventDefault();
			targetX = Math.max(0, Math.min(totalPx, targetX + e.deltaY * 0.8));
			if (rafId === 0) rafId = requestAnimationFrame(tick);
		};

		el.addEventListener('wheel', onWheel, { passive: false });

		return () => {
			el.removeEventListener('wheel', onWheel);
			cancelAnimationFrame(rafId);
			rafId = 0;
		};
	}

	return {
		get x() {
			return x;
		},
		attach
	};
}
