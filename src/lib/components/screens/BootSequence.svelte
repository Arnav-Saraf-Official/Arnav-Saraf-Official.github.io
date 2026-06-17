<script lang="ts">
	import { onMount } from 'svelte';
	import { advanceFromBoot } from '$lib/stores/phase.svelte';

	onMount(() => {
		const timer = setTimeout(() => {
			advanceFromBoot();
		}, 1800);
		return () => clearTimeout(timer);
	});
</script>

<div class="boot-overlay">
	<div class="boot-line">
		<span class="label">NAVIGATION</span><span class="status">[ONLINE]</span>
	</div>
	<div class="boot-line">
		<span class="label">LIFE SUPPORT</span><span class="status">[ONLINE]</span>
	</div>
	<div class="boot-line">
		<span class="label">COMMUNICATIONS</span><span class="status">[ONLINE]</span>
	</div>
	<div class="boot-line">
		<span class="label">PROPULSION</span><span class="status">[ONLINE]</span>
	</div>
</div>
