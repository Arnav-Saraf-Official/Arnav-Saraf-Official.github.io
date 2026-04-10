<script lang="ts">
	// scene 2,  market street (Street View walk)
	//
	// scroll moves the camera horiz along the street.
	// bg layers use parallax depth (move slowly).
	// stalls are world-space elements in a single strip that moves 1:1 with the camera.
	// each stall = one portfolio project.
	//
	// Assets: static/scenes/scene-2/{sky,far-end,overhead,stalls-left,stalls-right,ground}.png
	import Layer from '$lib/Layer.svelte';
	import { createWalk } from '$lib/useWalk.svelte.js';

	let { onTurnLeft }: { onTurnLeft?: () => void } = $props();

	const NUM_STALLS = 5;
	const STALL_SPACING = 800; // px between stall centres
	const TOTAL_WALK = STALL_SPACING * (NUM_STALLS - 1);

	const walk = createWalk(TOTAL_WALK);
	let el = $state<HTMLElement | null>(null);

	$effect(() => {
		if (!el) return;
		return walk.attach(el);
	});

	// bg parallax
	function bgT(depth: number): string {
		return `translate3d(${(-walk.x * depth).toFixed(1)}px,0,0)`;
	}

	// Walk progress 0..1 for the progress indicator
	const walkProgress = $derived(TOTAL_WALK > 0 ? walk.x / TOTAL_WALK : 0);

	//placeholder projects TODO: replace later
	const projects: { title: string; subtitle: string; accent: string }[] = [
		{ title: 'Project 1',   subtitle: 'Full-stack web app',    accent: '#e05a3a' },
		{ title: 'Project 2',    subtitle: 'Mobile app',            accent: '#3a8fe0' },
		{ title: 'Project 3',   subtitle: 'AI / ML experiment',    accent: '#3ac97a' },
		{ title: 'Project 4',   subtitle: 'Design system',         accent: '#9b59b6' },
		{ title: 'Project 5', subtitle: 'Open-source tool',      accent: '#e0a83a' },
	];
</script>

<!--
  Structure:
    .market           — full-viewport container, captures wheel events
      background Layers (parallax, slow)
      .street-strip   — translates -walk.x, contains all stalls at fixed left offsets
        .stall-slot   — one per project, positioned via `left: i * STALL_SPACING`
-->
<div class="market" bind:this={el}>
	<!-- sky gradient (no image needed, very slow parallax) -->
	<div class="bg-sky" style="transform:{bgT(0.04)}"></div>

	<!-- parallax background image layers -->
	<Layer transform={bgT(0.08)}  origin="50% 100%" src="/scenes/scene-2/sky.png" />
	<Layer transform={bgT(0.18)}  origin="50% 100%" src="/scenes/scene-2/far-end.png" />
	<Layer transform={bgT(0.36)}  origin="50% 0%"   src="/scenes/scene-2/overhead.png" />
	<Layer transform={bgT(0.55)}  origin="50% 100%" src="/scenes/scene-2/stalls-left.png" />
	<Layer transform={bgT(0.55)}  origin="50% 100%" src="/scenes/scene-2/stalls-right.png" />
	<Layer transform={bgT(0.90)}  origin="50% 100%" src="/scenes/scene-2/ground.png" />

	<!-- world-space stall strip: moves 1:1 with camera -->
	<div class="street-strip" style="transform:translate3d({(-walk.x).toFixed(1)}px,0,0)">
		{#each projects as project, i (i)}
			<div class="stall-slot" style="left:{i * STALL_SPACING}px">
				<div class="stall-card" style="--accent:{project.accent}">
					<h2>{project.title}</h2>
					<p>{project.subtitle}</p>
				</div>
			</div>
		{/each}
	</div>

	<!-- UI chrome -->
	<button class="turn-left" onclick={onTurnLeft}>← Turn Left</button>

	<div class="walk-bar" role="progressbar" aria-valuenow={walkProgress * 100}>
		<div class="walk-fill" style="width:{walkProgress * 100}%"></div>
	</div>

	<p class="walk-hint">Scroll to walk</p>
</div>

<style>
	.market {
		position: relative;
		width: 100%;
		height: 100vh;
		overflow: hidden;
		background: #1a0e08;
		cursor: none;
	}

	.bg-sky {
		position: absolute;
		inset: 0;
		background: linear-gradient(to bottom, #2c1005 0%, #6b3520 55%, #1a0e08 100%);
		will-change: transform;
	}

	.street-strip {
		position: absolute;
		left: 50%;
		top: 0;
		bottom: 0;
		width: 0;
		will-change: transform;
	}

	.stall-slot {
		position: absolute;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 320px;
	}

	.stall-card {
		background: rgba(0, 0, 0, 0.7);
		border: 2px solid var(--accent);
		border-radius: 8px;
		padding: 32px 24px;
		color: #fff;
		backdrop-filter: blur(6px);
		box-shadow:
			0 0 40px -10px var(--accent),
			inset 0 1px 0 rgba(255, 255, 255, 0.06);
		text-align: center;
	}

	.stall-card h2 {
		margin: 0 0 10px;
		font-size: 1.4rem;
		color: var(--accent);
		letter-spacing: 0.04em;
	}

	.stall-card p {
		margin: 0;
		font-size: 0.9rem;
		opacity: 0.7;
	}

	.turn-left {
		position: absolute;
		bottom: 40px;
		left: 48px;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.35);
		color: #fff;
		font-size: 1rem;
		letter-spacing: 0.08em;
		padding: 10px 22px;
		border-radius: 4px;
		cursor: pointer;
		backdrop-filter: blur(6px);
		transition: background 0.2s;
		z-index: 10;
	}

	.turn-left:hover {
		background: rgba(255, 255, 255, 0.22);
	}

	.walk-bar {
		position: absolute;
		bottom: 14px;
		left: 180px;
		right: 48px;
		height: 2px;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 2px;
	}

	.walk-fill {
		height: 100%;
		background: rgba(255, 200, 100, 0.6);
		border-radius: 2px;
		will-change: width;
	}

	.walk-hint {
		position: absolute;
		bottom: 18px;
		left: 50%;
		transform: translateX(-50%);
		color: rgba(255, 255, 255, 0.3);
		font-size: 0.75rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		pointer-events: none;
		margin: 0;
	}
</style>
