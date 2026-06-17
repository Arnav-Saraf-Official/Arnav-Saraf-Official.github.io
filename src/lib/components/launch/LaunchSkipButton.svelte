<script lang="ts">
	import { skipToCapsule } from '$lib/stores/phase.svelte';
	import { initAudio, stopLaunchMusic } from '$lib/stores/audio.svelte';

	function handleSkip() {
		initAudio();
		stopLaunchMusic();
		skipToCapsule();
	}
</script>

<button class="skip-button" onclick={handleSkip} aria-label="Skip intro animation">
	SKIP &raquo;
</button>
