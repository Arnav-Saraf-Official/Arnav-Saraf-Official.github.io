<script lang="ts">
	import Scene from '$lib/Scene.svelte';
	import ParallaxLayer from '$lib/ParallaxLayer.svelte';
	import { useScroll, viewportProgress } from '$lib/scroll.svelte';

	const scroll = useScroll();
	let el = $state<HTMLElement | null>(null);

	const p = $derived(viewportProgress(scroll.y, el));
</script>

<Scene bind:ref={el}>
	<!-- deep night sky -->
	<ParallaxLayer
		progress={p}
		yOffset={-60}
		style="inset: -80px 0; background: linear-gradient(to bottom, #020208 0%, #05050f 45%, #0a0a20 100%);"
	/>

	<!-- star field: percentage-positioned via radial-gradients -->
	<ParallaxLayer progress={p} yOffset={-30} style="pointer-events:none;">
		<div class="stars"></div>
	</ParallaxLayer>

	<!-- subtle aurora band -->
	<ParallaxLayer progress={p} yOffset={-50} style="pointer-events:none;">
		<div class="aurora"></div>
	</ParallaxLayer>

	<!-- moon with halo -->
	<ParallaxLayer
		progress={p}
		yOffset={-190}
		style="display:flex; justify-content:center; padding-top:12vh; pointer-events:none;"
	>
		<div class="moon-wrap">
			<div class="moon-halo"></div>
			<div class="moon"></div>
		</div>
	</ParallaxLayer>

	<!-- mid cityscape: slower, farther back -->
	<ParallaxLayer
		progress={p}
		yOffset={-90}
		fade={[0.4, 0.9]}
		style="display:flex; align-items:flex-end;"
	>
		<div class="city-far"></div>
	</ParallaxLayer>

	<!-- ground mist -->
	<ParallaxLayer
		progress={p}
		yOffset={-55}
		style="display:flex; align-items:flex-end; pointer-events:none;"
	>
		<div class="ground-mist"></div>
	</ParallaxLayer>

	<!-- near silhouette: the main foreground layer -->
	<ParallaxLayer
		progress={p}
		yOffset={-80}
		fade={[0.5, 1]}
		style="display:flex; align-items:flex-end;"
	>
		<div class="silhouette"></div>
	</ParallaxLayer>
</Scene>

<style>
	.stars {
		position: absolute;
		inset: 0;
		background-image:
			radial-gradient(circle 1px at 3% 5%, rgba(255, 255, 255, 0.9), transparent 1px),
			radial-gradient(circle 1.5px at 8% 14%, rgba(255, 255, 255, 0.7), transparent 1.5px),
			radial-gradient(circle 1px at 13% 3%, white, transparent 1px),
			radial-gradient(circle 1px at 19% 22%, rgba(255, 255, 255, 0.8), transparent 1px),
			radial-gradient(circle 2px at 24% 9%, rgba(255, 255, 255, 0.45), transparent 2px),
			radial-gradient(circle 1px at 31% 17%, rgba(255, 255, 255, 0.9), transparent 1px),
			radial-gradient(circle 1px at 37% 4%, rgba(255, 255, 255, 0.75), transparent 1px),
			radial-gradient(circle 1.5px at 43% 28%, rgba(255, 255, 255, 0.6), transparent 1.5px),
			radial-gradient(circle 1px at 48% 8%, white, transparent 1px),
			radial-gradient(circle 1px at 55% 19%, rgba(255, 255, 255, 0.85), transparent 1px),
			radial-gradient(circle 2px at 61% 6%, rgba(255, 255, 255, 0.5), transparent 2px),
			radial-gradient(circle 1px at 67% 25%, rgba(255, 255, 255, 0.8), transparent 1px),
			radial-gradient(circle 1px at 73% 11%, white, transparent 1px),
			radial-gradient(circle 1.5px at 79% 3%, rgba(255, 255, 255, 0.7), transparent 1.5px),
			radial-gradient(circle 1px at 85% 18%, rgba(255, 255, 255, 0.9), transparent 1px),
			radial-gradient(circle 1px at 91% 7%, rgba(255, 255, 255, 0.65), transparent 1px),
			radial-gradient(circle 1px at 96% 24%, rgba(255, 255, 255, 0.8), transparent 1px),
			radial-gradient(circle 1px at 5% 38%, rgba(255, 255, 255, 0.7), transparent 1px),
			radial-gradient(circle 1.5px at 11% 32%, rgba(255, 255, 255, 0.9), transparent 1.5px),
			radial-gradient(circle 1px at 17% 45%, rgba(255, 255, 255, 0.6), transparent 1px),
			radial-gradient(circle 1px at 22% 35%, rgba(255, 255, 255, 0.8), transparent 1px),
			radial-gradient(circle 2px at 28% 48%, rgba(255, 255, 255, 0.4), transparent 2px),
			radial-gradient(circle 1px at 34% 40%, rgba(255, 255, 255, 0.75), transparent 1px),
			radial-gradient(circle 1px at 40% 52%, rgba(255, 255, 255, 0.85), transparent 1px),
			radial-gradient(circle 1.5px at 46% 42%, rgba(255, 255, 255, 0.6), transparent 1.5px),
			radial-gradient(circle 1px at 52% 56%, rgba(255, 255, 255, 0.9), transparent 1px),
			radial-gradient(circle 1px at 57% 36%, rgba(255, 255, 255, 0.7), transparent 1px),
			radial-gradient(circle 1px at 63% 50%, rgba(255, 255, 255, 0.8), transparent 1px),
			radial-gradient(circle 2px at 69% 33%, rgba(255, 255, 255, 0.45), transparent 2px),
			radial-gradient(circle 1px at 75% 44%, rgba(255, 255, 255, 0.85), transparent 1px),
			radial-gradient(circle 1px at 81% 38%, rgba(255, 255, 255, 0.7), transparent 1px),
			radial-gradient(circle 1.5px at 87% 55%, rgba(255, 255, 255, 0.6), transparent 1.5px),
			radial-gradient(circle 1px at 93% 42%, rgba(255, 255, 255, 0.9), transparent 1px),
			radial-gradient(circle 1px at 2% 62%, rgba(255, 255, 255, 0.75), transparent 1px),
			radial-gradient(circle 1px at 7% 70%, rgba(255, 255, 255, 0.85), transparent 1px),
			radial-gradient(circle 1.5px at 15% 58%, rgba(255, 255, 255, 0.6), transparent 1.5px),
			radial-gradient(circle 1px at 21% 74%, rgba(255, 255, 255, 0.8), transparent 1px),
			radial-gradient(circle 1px at 27% 64%, rgba(255, 255, 255, 0.7), transparent 1px),
			radial-gradient(circle 2px at 33% 72%, rgba(255, 255, 255, 0.4), transparent 2px),
			radial-gradient(circle 1px at 39% 65%, rgba(255, 255, 255, 0.9), transparent 1px),
			radial-gradient(circle 1px at 45% 80%, rgba(255, 255, 255, 0.7), transparent 1px),
			radial-gradient(circle 1px at 51% 60%, rgba(255, 255, 255, 0.8), transparent 1px),
			radial-gradient(circle 1.5px at 58% 76%, rgba(255, 255, 255, 0.65), transparent 1.5px),
			radial-gradient(circle 1px at 64% 65%, rgba(255, 255, 255, 0.85), transparent 1px),
			radial-gradient(circle 1px at 71% 82%, rgba(255, 255, 255, 0.7), transparent 1px),
			radial-gradient(circle 1px at 77% 70%, rgba(255, 255, 255, 0.9), transparent 1px),
			radial-gradient(circle 2px at 83% 78%, rgba(255, 255, 255, 0.45), transparent 2px),
			radial-gradient(circle 1px at 89% 62%, rgba(255, 255, 255, 0.8), transparent 1px),
			radial-gradient(circle 1.5px at 95% 85%, rgba(255, 255, 255, 0.7), transparent 1.5px);
	}

	.aurora {
		position: absolute;
		inset: 0;
		background: radial-gradient(
			ellipse 70% 25% at 40% 30%,
			rgba(40, 180, 140, 0.06) 0%,
			rgba(60, 120, 200, 0.04) 50%,
			transparent 75%
		);
	}

	.moon-wrap {
		position: relative;
		width: 64px;
		height: 64px;
	}

	.moon-halo {
		position: absolute;
		inset: -28px;
		border-radius: 50%;
		background: radial-gradient(
			circle at 50% 50%,
			transparent 38%,
			rgba(255, 240, 160, 0.06) 52%,
			rgba(255, 220, 100, 0.03) 65%,
			transparent 78%
		);
	}

	.moon {
		position: absolute;
		inset: 0;
		border-radius: 50%;
		background: radial-gradient(circle at 36% 36%, #fffcf0, #f0e890 55%, #d8c860 100%);
		box-shadow:
			0 0 24px 8px rgba(255, 240, 130, 0.28),
			0 0 60px 20px rgba(255, 210, 80, 0.1);
	}

	.city-far {
		width: 100%;
		height: 28vh;
		background: #06060e;
		clip-path: polygon(
			0 100%,
			0 55%,
			3% 55%,
			3% 38%,
			7% 38%,
			7% 48%,
			10% 48%,
			10% 28%,
			13% 28%,
			13% 44%,
			16% 44%,
			16% 18%,
			18% 18%,
			18% 40%,
			21% 40%,
			21% 30%,
			24% 30%,
			24% 50%,
			27% 50%,
			27% 22%,
			30% 22%,
			30% 44%,
			33% 44%,
			33% 35%,
			36% 35%,
			36% 52%,
			39% 52%,
			39% 26%,
			42% 26%,
			42% 48%,
			45% 48%,
			45% 15%,
			47% 15%,
			47% 42%,
			50% 42%,
			50% 32%,
			53% 32%,
			53% 55%,
			56% 55%,
			56% 24%,
			59% 24%,
			59% 46%,
			62% 46%,
			62% 35%,
			65% 35%,
			65% 54%,
			68% 54%,
			68% 28%,
			71% 28%,
			71% 48%,
			74% 48%,
			74% 20%,
			77% 20%,
			77% 44%,
			80% 44%,
			80% 36%,
			83% 36%,
			83% 52%,
			86% 52%,
			86% 30%,
			89% 30%,
			89% 46%,
			92% 46%,
			92% 40%,
			95% 40%,
			95% 58%,
			98% 58%,
			98% 45%,
			100% 45%,
			100% 100%
		);
	}

	.ground-mist {
		width: 100%;
		height: 30vh;
		background: linear-gradient(
			to top,
			rgba(20, 30, 60, 0.55) 0%,
			rgba(15, 20, 50, 0.25) 40%,
			transparent 80%
		);
	}

	.silhouette {
		width: 100%;
		height: 38vh;
		background: #04040c;
		clip-path: polygon(
			0 100%,
			0 58%,
			5% 58%,
			5% 38%,
			10% 38%,
			10% 50%,
			15% 50%,
			15% 28%,
			20% 28%,
			20% 54%,
			25% 54%,
			25% 44%,
			30% 44%,
			30% 18%,
			35% 18%,
			35% 48%,
			40% 48%,
			40% 34%,
			45% 34%,
			45% 54%,
			50% 54%,
			50% 22%,
			55% 22%,
			55% 48%,
			60% 48%,
			60% 38%,
			65% 38%,
			65% 58%,
			70% 58%,
			70% 43%,
			75% 43%,
			75% 28%,
			80% 28%,
			80% 52%,
			85% 52%,
			85% 40%,
			90% 40%,
			90% 56%,
			95% 56%,
			95% 46%,
			100% 46%,
			100% 100%
		);
	}
</style>
