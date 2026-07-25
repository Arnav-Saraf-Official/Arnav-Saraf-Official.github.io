<script>
    import Typewriter from '$lib/components/Typewriter.svelte';
    import FadeText from '$lib/components/FadeText.svelte';
</script>
<div class="flex flex-col items-center justify-center min-h-full h-screen p-[2vw]">
    <div class="flex flex-col w-full p-[4vw] gap-[2vh]">    
        
        <h1 class="text-[10vw] font-bold text-white -ml-1 sm:-ml-2 titleRainbow">
            <FadeText texts={["Hello there,", "Willkommen,", "Namaste,", "Bonjour,", "Beinvenidos,", "Konichiwa,", "Ni Hao,"]} interval={3200} fadeDuration={450} />
        </h1>
        <Typewriter></Typewriter>

    </div>
</div>