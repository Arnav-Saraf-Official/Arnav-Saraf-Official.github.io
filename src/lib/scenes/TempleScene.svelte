<script lang="ts">
	import Scene from '$lib/Scene.svelte';
	import ParallaxLayer from '$lib/ParallaxLayer.svelte';
	import { useScroll, viewportProgress } from '$lib/scroll.svelte';
	import { phaseProgress } from '$lib/motion.js';

	const scroll = useScroll();
	let el = $state<HTMLElement | null>(null);

	const p = $derived(viewportProgress(scroll.y, el));

	const revealP = $derived(phaseProgress(p, 0, 0.55));
	const pushP = $derived(phaseProgress(p, 0.45, 1.0));
	const pushScale = $derived(1 + pushP * 0.3);
</script>

<Scene bind:ref={el}>
	<div class="zoom-frame" style="transform: scale({pushScale}); transform-origin: 50% 72%;">
		<ParallaxLayer
			progress={revealP}
			yOffset={-50}
			style="inset: -60px 0; background: linear-gradient(to bottom, #0c0918 0%, #1e0d35 22%, #5c1a40 48%, #b83820 72%, #e87030 100%);"
		/>

		<ParallaxLayer progress={revealP} yOffset={-90} style="display:flex; align-items:flex-end;">
			<div class="horizon-glow"></div>
		</ParallaxLayer>

		<ParallaxLayer progress={revealP} yOffset={-130} style="display:flex; align-items:flex-end;">
			<div class="mountains far"></div>
		</ParallaxLayer>

		<ParallaxLayer progress={revealP} yOffset={-200} style="display:flex; align-items:flex-end;">
			<div class="mountains near"></div>
		</ParallaxLayer>

		<ParallaxLayer
			progress={revealP}
			yOffset={-270}
			style="display:flex; align-items:flex-end; justify-content:center;"
		>
			<div class="temple"></div>
		</ParallaxLayer>

		<ParallaxLayer progress={revealP} yOffset={-350} style="display:flex; align-items:flex-end;">
			<div class="mist"></div>
		</ParallaxLayer>

		<ParallaxLayer progress={revealP} yOffset={-430} style="display:flex; align-items:flex-end;">
			<div class="ground"></div>
		</ParallaxLayer>

		<ParallaxLayer progress={revealP} yOffset={-210} style="pointer-events:none;">
			<div class="motes">
				<div
					class="mote"
					style="left:16%; top:54%; animation-delay:0s;    animation-duration:6.5s;"
				></div>
				<div
					class="mote"
					style="left:28%; top:68%; animation-delay:1.4s;  animation-duration:8s;"
				></div>
				<div
					class="mote"
					style="left:44%; top:46%; animation-delay:0.7s;  animation-duration:7s;"
				></div>
				<div
					class="mote"
					style="left:57%; top:60%; animation-delay:2.1s;  animation-duration:5.8s;"
				></div>
				<div
					class="mote"
					style="left:70%; top:52%; animation-delay:0.9s;  animation-duration:9s;"
				></div>
				<div
					class="mote"
					style="left:38%; top:38%; animation-delay:3.2s;  animation-duration:6.2s;"
				></div>
				<div
					class="mote"
					style="left:22%; top:42%; animation-delay:0.4s;  animation-duration:7.8s;"
				></div>
				<div
					class="mote"
					style="left:62%; top:72%; animation-delay:1.9s;  animation-duration:8.4s;"
				></div>
				<div
					class="mote"
					style="left:80%; top:44%; animation-delay:2.8s;  animation-duration:5.2s;"
				></div>
				<div
					class="mote"
					style="left:50%; top:78%; animation-delay:0.2s;  animation-duration:10s;"
				></div>
			</div>
		</ParallaxLayer>
	</div>
</Scene>

<style>
	.zoom-frame {
		position: absolute;
		inset: 0;
		will-change: transform;
	}

	.horizon-glow {
		width: 100%;
		height: 50vh;
		background: radial-gradient(
			ellipse 55% 100% at 50% 100%,
			rgba(255, 140, 30, 0.7) 0%,
			rgba(220, 60, 10, 0.35) 45%,
			transparent 72%
		);
	}

	.mountains {
		width: 100%;
	}

	.mountains.far {
		height: 30vh;
		background: #3c1a42;
		opacity: 0.72;
		clip-path: polygon(
			0 100%,
			0 52%,
			6% 24%,
			12% 54%,
			18% 16%,
			24% 50%,
			30% 8%,
			36% 46%,
			42% 10%,
			48% 44%,
			54% 18%,
			60% 52%,
			66% 20%,
			72% 56%,
			78% 26%,
			84% 60%,
			90% 30%,
			96% 62%,
			100% 46%,
			100% 100%
		);
	}

	.mountains.near {
		height: 42vh;
		background: #110810;
		clip-path: polygon(
			0 100%,
			0 68%,
			5% 36%,
			11% 64%,
			17% 26%,
			23% 60%,
			29% 16%,
			35% 54%,
			41% 10%,
			47% 50%,
			53% 22%,
			59% 58%,
			65% 28%,
			71% 62%,
			77% 22%,
			83% 56%,
			89% 36%,
			95% 68%,
			100% 50%,
			100% 100%
		);
	}

	.temple {
		width: 190px;
		height: 60vh;
		background: #080406;
		/* 3-tier pagoda silhouette */
		clip-path: polygon(
			50% 0%,
			60% 8%,
			60% 12%,
			72% 16%,
			72% 20%,
			62% 20%,
			62% 28%,
			80% 33%,
			80% 37%,
			65% 37%,
			65% 50%,
			90% 55%,
			90% 59%,
			65% 59%,
			65% 100%,
			35% 100%,
			35% 59%,
			10% 59%,
			10% 55%,
			35% 50%,
			35% 37%,
			20% 37%,
			20% 33%,
			38% 28%,
			38% 20%,
			28% 20%,
			28% 16%,
			40% 12%,
			40% 8%
		);
	}

	.mist {
		width: 100%;
		height: 28vh;
		background: linear-gradient(
			to top,
			rgba(230, 150, 70, 0.2) 0%,
			rgba(220, 120, 50, 0.1) 40%,
			transparent 85%
		);
	}

	.ground {
		width: 100%;
		height: 18vh;
		background: linear-gradient(to top, #0e0608, #231010);
	}

	.motes {
		position: absolute;
		inset: 0;
	}

	.mote {
		position: absolute;
		width: 2px;
		height: 2px;
		border-radius: 50%;
		background: rgba(255, 200, 100, 0.55);
		box-shadow: 0 0 4px 1px rgba(255, 170, 50, 0.4);
		animation: drift linear infinite;
	}

	@keyframes drift {
		0% {
			transform: translateY(0) translateX(0);
			opacity: 0;
		}
		12% {
			opacity: 0.65;
		}
		88% {
			opacity: 0.35;
		}
		100% {
			transform: translateY(-45px) translateX(14px);
			opacity: 0;
		}
	}
</style>
