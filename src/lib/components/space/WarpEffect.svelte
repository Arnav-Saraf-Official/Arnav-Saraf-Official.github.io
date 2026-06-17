<script lang="ts">
	import { getIsWarping } from '$lib/stores/navigation.svelte';

	// Warp effect is a CSS overlay in MainViewport
	// This component provides the 3D side of the warp — elongating stars
	// For simplicity, the warp is handled via a CSS flash overlay + camera FOV change
</script>

{#if getIsWarping()}
	<!-- No 3D warp for now — handled via CSS overlay in MainViewport -->
{/if}
