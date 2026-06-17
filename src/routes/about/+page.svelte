<script lang="ts">
	import PlanetSurface from '$lib/components/solar/PlanetSurface.svelte';
</script>

<PlanetSurface
	planetName="ABOUT"
	skyColor="#14141c"
	horizonColor="#2a2a24"
	groundColor="#1a1a18"
	cloudColor="#3a3a30"
	starColor="#ccccbb"
	particleColor="#888877"
>
	<div class="content">
		<section>
			<h2>ABOUT ME</h2>
			<p>
				Developer and creative technologist passionate about building at the intersection of 3D
				graphics, machine learning, and web engineering.
			</p>
		</section>
		<section>
			<h2>BACKGROUND</h2>
			<p>
				Full-stack developer with deep experience in 3D web technologies. I care about craft — every
				pixel, every shader, every animation. Building tools that feel alive, not just functional.
			</p>
		</section>
		<section>
			<h2>PHILOSOPHY</h2>
			<p>
				The web should feel alive. Not flat pages — living worlds. Every project is a universe. This
				portfolio itself is a real-time 3D solar system rendered in your browser.
			</p>
		</section>
	</div>
</PlanetSurface>

<style>
	.content {
		max-width: 560px;
		margin: 0 auto;
	}
	section {
		margin-bottom: 64px;
	}
	h2 {
		font-family: 'Courier New', monospace;
		font-size: 18px;
		color: rgba(200, 230, 255, 0.8);
		letter-spacing: 4px;
		margin: 0 0 12px;
		font-weight: normal;
	}
	p {
		font-family: 'Courier New', monospace;
		font-size: 13px;
		color: rgba(200, 230, 255, 0.45);
		line-height: 1.8;
		margin: 0;
	}
</style>
