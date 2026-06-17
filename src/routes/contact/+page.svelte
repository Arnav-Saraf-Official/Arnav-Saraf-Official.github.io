<script lang="ts">
	import PlanetSurface from '$lib/components/solar/PlanetSurface.svelte';
</script>

<PlanetSurface
	planetName="CONTACT"
	skyColor="#08081a"
	horizonColor="#1a1a30"
	groundColor="#0e0e22"
	cloudColor="#332255"
	starColor="#ccccee"
	particleColor="#7766aa"
>
	<div class="content">
		<section>
			<h2>CONTACT</h2>
			<p>Open a comms channel. I'm available for interesting projects and collaborations.</p>
		</section>
		<section>
			<h2>GITHUB</h2>
			<a href="https://github.com/arnav-saraf-official" target="_blank" rel="external noopener"
				>github.com/arnav-saraf-official</a
			>
		</section>
		<section>
			<h2>EMAIL</h2>
			<p>contact@arnavsaraf.dev</p>
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
	a {
		font-family: 'Courier New', monospace;
		font-size: 13px;
		color: #8899ff;
		text-decoration: none;
	}
	a:hover {
		text-shadow: 0 0 10px rgba(136, 153, 255, 0.5);
	}
</style>
