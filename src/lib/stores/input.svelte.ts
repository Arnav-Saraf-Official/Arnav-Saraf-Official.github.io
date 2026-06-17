const keys = $state<Record<string, boolean>>({});

export const isKeyDown = (code: string) => keys[code] || false;

export function initInput(): () => void {
	function onDown(e: KeyboardEvent) {
		keys[e.code] = true;
		// Prevent browser scrolling on space/arrows
		if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
			e.preventDefault();
		}
	}
	function onUp(e: KeyboardEvent) {
		keys[e.code] = false;
	}

	window.addEventListener('keydown', onDown);
	window.addEventListener('keyup', onUp);

	return () => {
		window.removeEventListener('keydown', onDown);
		window.removeEventListener('keyup', onUp);
	};
}
