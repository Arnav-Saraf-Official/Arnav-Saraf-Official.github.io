<script lang="ts">
	import MainViewport from './MainViewport.svelte';
	import Hologram from './Hologram.svelte';
	import LeftScreen from './LeftScreen.svelte';
	import RightScreen from './RightScreen.svelte';
	import ControlPanel from './ControlPanel.svelte';
</script>

<div class="capsule-grid">
	<div class="main-viewport">
		<MainViewport />
	</div>

	<div class="hologram-zone">
		<Hologram />
	</div>

	<div class="left-screen">
		<LeftScreen />
	</div>

	<div class="right-screen">
		<RightScreen />
	</div>

	<div class="control-panel">
		<ControlPanel />
	</div>
</div>

<!-- Global scanline overlay -->
<div class="scanlines"></div>
