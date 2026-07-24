<script>
    import Hero from '$lib/components/Hero.svelte';
</script>
<Hero />

<section id="about" class="py-24">
    <div class="mx-auto w-[80%] px-6 sm:px-8">
        <div class="rounded-[1.75rem] border border-white/10 bg-white/5 p-8 shadow-[0_24px_60px_rgba(0,0,0,0.14)] backdrop-blur-xl flex flex-col gap-12 xl:flex-row xl:items-center xl:justify-between">
            <div class="space-y-6 xl:max-w-2xl">
                <div class="space-y-3">
                    <p class="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">About Me</p>
                    <h2 class="text-3xl font-semibold text-white sm:text-4xl">Who I am and what I build</h2>
                </div>
                <div class="space-y-6 text-slate-300">
                    <p class="leading-8">
                        I’m a designer-developer who builds polished digital experiences with thoughtful motion, strong typography, and clean interaction. I enjoy turning ideas into interfaces that feel intentional, personal, and memorable.
                    </p>
                    <p class="leading-8">
                        My work blends modern web technologies with a subtle visual language that keeps the focus on content and clarity. I care most about readability, performance, and creating interfaces that people want to use.
                    </p>
                </div>
            </div>
            <div class="flex justify-center xl:justify-end">
                <img src="/image.png" alt="Portrait illustration" class="w-full max-w-sm rounded-[1.5rem] border border-white/10 object-cover shadow-2xl" />
            </div>
        </div>
    </div>
</section>

