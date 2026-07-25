<script lang="ts">
	import { onMount } from 'svelte';
	import { initEngine } from './context';
	import type { EngineConfig } from './types';

	interface Props {
		config?: Partial<EngineConfig>;
	}

	let { config = {} }: Props = $props();

	const engine = initEngine(config);

	onMount(() => {
		engine.resize(window.innerWidth, window.innerHeight);

		const handleMouseMove = (e: MouseEvent): void => {
			engine.setMouse(
				e.clientX / window.innerWidth,
				1 - e.clientY / window.innerHeight,
				true
			);
		};
		const handleMouseLeave = (): void => {
			engine.setMouse(0.5, 0.5, false);
		};
		const handleResize = (): void => {
			engine.resize(window.innerWidth, window.innerHeight);
		};

		window.addEventListener('mousemove', handleMouseMove, { passive: true });
		document.addEventListener('mouseleave', handleMouseLeave);
		window.addEventListener('resize', handleResize);

		// Drive the simulation each frame (windows only read from it)
		let running = true;
		let lastTime = performance.now();

		function tick(): void {
			if (!running) return;
			requestAnimationFrame(tick);
			const now = performance.now();
			const dt = Math.min(now - lastTime, 50);
			lastTime = now;
			engine.tick(dt);
		}

		requestAnimationFrame(tick);

		return () => {
			running = false;
			window.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseleave', handleMouseLeave);
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

<!-- This component is invisible — it just owns the engine and provides it via context -->
