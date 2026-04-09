<script lang="ts">
	import Scene from '$lib/Scene.svelte';
	import { useScroll, stickyProgress } from '$lib/scroll.svelte';
	import { createPan } from '$lib/usePan.svelte';

	const SCENE_HEIGHT = '400vh';

	const scroll = useScroll();
	let el = $state<HTMLElement | null>(null);

	const p = $derived(stickyProgress(scroll.y, el));

	const pan = createPan();
	$effect(() => {
		if (!el) return;
		return pan.attach(el);
	});
</script>

<Scene bind:ref={el} style="min-height: {SCENE_HEIGHT};">
	<div class="viewport">
		<!-- sky: deep amber evening -->
		<div
			class="layer sky"
			style="transform: translateX(calc({p} * -10vw)) translate3d({-pan.x * 14}px, {-pan.y *
				8}px, 0);"
		></div>

		<!-- depth haze: edge vignette + atmospheric fade toward vanishing point -->
		<div class="layer haze"></div>

		<!-- far lanterns: barely move — feel like they're at rooftop distance -->
		<div
			class="layer lantern-row"
			style="transform: translateX(calc({p} * -35vw)) translate3d({-pan.x * 28}px, {-pan.y *
				10}px, 0);"
		>
			{#each Array(22) as _, i}
				<div
					class="lantern"
					style="
						height: {13 + ((i * 7) % 9)}px;
						width:  {8 + ((i * 5) % 5)}px;
						margin-top: {6 + ((i * 11) % 28)}px;
						margin-right: {50 + ((i * 31) % 75)}px;
					"
				></div>
			{/each}
		</div>

		<!-- far buildings: slow, with lit windows -->
		<div
			class="layer row far-buildings"
			style="transform: translateX(calc({p} * -55vw)) translate3d({-pan.x * 40}px, {-pan.y *
				18}px, 0);"
		>
			{#each Array(18) as _, i}
				<div
					class="building"
					style="height: {25 + ((i * 43) % 36)}vh; width: {48 +
						((i * 17) % 38)}px; margin-right: {8 + ((i * 23) % 44)}px;"
				>
					{#if i % 3 !== 2}
						<div class="window" style="bottom: {28 + ((i * 13) % 38)}%; left: 18%;"></div>
					{/if}
					{#if i % 2 === 0}
						<div class="window" style="bottom: {52 + ((i * 7) % 22)}%; left: 56%;"></div>
					{/if}
				</div>
			{/each}
		</div>

		<!-- mid stalls: the market floor -->
		<div
			class="layer row mid-stalls"
			style="transform: translateX(calc({p} * -130vw)) translate3d({-pan.x * 66}px, {-pan.y *
				25}px, 0);"
		>
			<div style="width: 18vw; flex-shrink:0;"></div>
			{#each Array(10) as _, i}
				{@const w = 88 + ((i * 23) % 58)}
				<div class="stall" style="width: {w}px;">
					<div
						class="awning"
						style="background: hsl({8 + i * 28}, 74%, {26 + ((i * 9) % 18)}%); width: {w +
							18}px; margin-left: -9px;"
					></div>
					<div class="goods">
						{#each Array(3) as _, j}
							<div
								class="good"
								style="height: {9 + j * 6}px; width: {11 + j * 5}px; background: hsl({18 +
									i * 18 +
									j * 35}, 58%, {28 + j * 9}%);"
							></div>
						{/each}
					</div>
				</div>
				<!-- lantern between stalls -->
				<div class="stall-lantern" style="margin-right: {45 + ((i * 37) % 85)}px;"></div>
			{/each}
		</div>

		<!-- crowd silhouettes: near foreground layer -->
		<div
			class="layer row crowd"
			style="transform: translateX(calc({p} * -170vw)) translate3d({-pan.x * 80}px, {-pan.y *
				14}px, 0);"
		>
			<div style="width: 8vw; flex-shrink:0;"></div>
			{#each Array(26) as _, i}
				<div
					class="person"
					style="height: {26 + ((i * 7) % 14)}px; width: {9 + ((i * 3) % 5)}px; margin-right: {12 +
						((i * 17) % 32)}px;"
				></div>
			{/each}
		</div>

		<!-- ground: fastest, closest -->
		<div
			class="layer ground"
			style="transform: translateX(calc({p} * -200vw)) translate3d({-pan.x * 90}px, {-pan.y *
				16}px, 0);"
		></div>

		<!-- screen-edge vignette: fixed, no transform — frames the scene -->
		<div class="layer vignette"></div>
	</div>
</Scene>

<style>
	.viewport {
		position: sticky;
		top: 0;
		height: 100vh;
		overflow: hidden;
	}

	.layer {
		position: absolute;
		inset: 0;
		will-change: transform;
	}

	.sky {
		background: linear-gradient(
			to bottom,
			#1a0808 0%,
			#4a1208 18%,
			#8a2c10 42%,
			#c05020 65%,
			#e88040 84%,
			#f0a858 100%
		);
		inset: -40px 0;
	}

	/* atmospheric haze: edge fade + center depth gradient */
	.haze {
		background:
			radial-gradient(ellipse 80% 60% at 50% 100%, rgba(240, 120, 20, 0.18) 0%, transparent 70%),
			linear-gradient(
				to right,
				rgba(10, 4, 0, 0.45) 0%,
				transparent 20%,
				transparent 80%,
				rgba(10, 4, 0, 0.45) 100%
			);
		pointer-events: none;
		will-change: unset;
	}

	.lantern-row {
		display: flex;
		align-items: flex-start;
		width: 400vw;
		inset: 0;
		padding-top: 6vh;
	}

	.lantern {
		flex-shrink: 0;
		border-radius: 40% 40% 52% 52%;
		background: radial-gradient(
			ellipse at 40% 35%,
			rgba(255, 235, 110, 0.96),
			rgba(240, 140, 20, 0.82)
		);
		box-shadow:
			0 0 8px 3px rgba(255, 190, 40, 0.55),
			0 0 18px 7px rgba(255, 120, 10, 0.22);
	}

	.row {
		display: flex;
		align-items: flex-end;
		width: 400vw;
		inset: 0;
	}

	.far-buildings {
		padding-bottom: 16vh;
	}

	.building {
		flex-shrink: 0;
		background: #0c0804;
		border-radius: 1px 1px 0 0;
		align-self: flex-end;
		position: relative;
	}

	.window {
		position: absolute;
		width: 5px;
		height: 6px;
		background: rgba(255, 200, 80, 0.78);
		box-shadow: 0 0 5px 2px rgba(255, 160, 40, 0.4);
	}

	.mid-stalls {
		padding-bottom: 16vh;
		align-items: flex-end;
	}

	.stall {
		flex-shrink: 0;
		align-self: flex-end;
		background: rgba(0, 0, 0, 0.22);
		min-height: 16vh;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}

	.awning {
		height: 15px;
		border-radius: 0 0 2px 2px;
		flex-shrink: 0;
	}

	.goods {
		display: flex;
		gap: 2px;
		padding: 0 5px 4px;
		align-items: flex-end;
		flex-shrink: 0;
	}

	.good {
		border-radius: 1px;
	}

	.stall-lantern {
		flex-shrink: 0;
		width: 9px;
		height: 13px;
		border-radius: 40% 40% 52% 52%;
		align-self: flex-start;
		margin-top: 8vh;
		background: radial-gradient(
			ellipse at 40% 35%,
			rgba(255, 225, 80, 0.92),
			rgba(240, 118, 10, 0.78)
		);
		box-shadow:
			0 0 7px 2px rgba(255, 160, 30, 0.5),
			0 0 14px 5px rgba(255, 100, 10, 0.22);
	}

	.crowd {
		padding-bottom: 16vh;
	}

	.person {
		flex-shrink: 0;
		align-self: flex-end;
		background: rgba(0, 0, 0, 0.8);
		border-radius: 3px 3px 0 0;
	}

	.ground {
		width: 420vw;
		height: 16vh;
		top: auto;
		inset: auto 0 0 0;
		background: linear-gradient(to top, #180a04, #2e1206);
	}

	.vignette {
		background: radial-gradient(
			ellipse 88% 88% at 50% 50%,
			transparent 48%,
			rgba(0, 0, 0, 0.6) 100%
		);
		pointer-events: none;
		will-change: unset;
	}
</style>
