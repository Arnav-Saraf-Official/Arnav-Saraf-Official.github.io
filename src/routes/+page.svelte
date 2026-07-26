<script lang="ts">
    import { resolve } from '$app/paths';
    import Github from '$lib/components/Github.svelte';
    import Hero from '$lib/components/Hero.svelte';
    import ParticleWindow from '$lib/particles/ParticleWindow.svelte';
</script>
<Hero />

<section id="about" class="py-24">
    <div class="mx-auto w-[80%] px-6 sm:px-8">
        <div class="rounded-[1.75rem] border border-white/10 bg-white/5 p-8 shadow-[0_24px_60px_rgba(0,0,0,0.14)] backdrop-blur-[8px] flex flex-col gap-12 xl:flex-row xl:items-center xl:justify-between">
            <div class="space-y-6 xl:max-w-2xl">
                <div class="space-y-3">
                    <p class="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">About Me</p>
                    <h2 class="text-3xl font-semibold text-white sm:text-4xl titleRainbow">Who I am and what I do</h2>
                </div>
                <div class="space-y-6 text-slate-300">
                    <p class="leading-8">
                        Hi, my name is Arnav Saraf, and I am a rising sophmore. I am very interested in basically all things science, and love building projects and experiementing with new ideas.
                    </p>
                    <p class="leading-8">
                        I have a lot of experience with Robotics, computer and data science, and embedded systems. I have participated in science fairs since I was in first grade, and I have even placed top three in the state twice.
                    </p>
                </div>
                <div class="flex flex-row justify-evenly align-center">
                    <a class="button bg-accent-blue hover:bg-accent-blue/80 no-underline" href={resolve('/#projects')}> My Projects</a>
                    <a class="button-outline no-underline border-accent-green border-[3px]" href={resolve('/#github')}> My Github Projects</a>
                    <a class="button-glass no-underline" href={resolve('/#contributions')}> My Contributions</a>
                </div>
            </div>
            <div class="flex justify-center xl:justify-end">
                <img src="/image.png" alt="Portrait illustration" class="w-full max-w-sm rounded-[1.5rem] border border-white/10 object-cover shadow-2xl" />
            </div>
        </div>
    </div>
</section>

<section id="projects" class="py-24">
    <div class="mx-auto w-[80%] px-6 sm:px-8">
        <ParticleWindow class="rounded-[1.75rem] border border-white/10 p-8" style="min-height: 300px;">
                <div class="space-y-3">
                    <p class="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">Particle Test</p>
                    <h2 class="text-3xl font-semibold text-white sm:text-4xl">Shared Particle World</h2>
                </div>
                <p class="mt-4 leading-8 text-slate-300">
                    This card is a window into the shared particle simulation. Move your mouse around to see the interaction ring push particles away. The same particle world is visible through any card with the <code class="text-accent-blue">.particle-window</code> class.
                </p>
        </ParticleWindow>
    </div>
</section>

<section id="github">
    <div id="contributions" class="sr-only"></div>
    <Github></Github>
</section>

<div id="cta" class="sr-only"></div>
<section id="contact" class="py-24">
    <div class="mx-auto w-[80%] px-6 sm:px-8">
        <div class="rounded-[1.75rem] border border-white/10 bg-white/5 p-8 shadow-[0_24px_60px_rgba(0,0,0,0.14)] backdrop-blur-[8px] text-slate-300">
            <p class="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">Get in touch</p>
            <h2 class="mt-4 text-3xl font-semibold text-white sm:text-4xl">Let's build something together.</h2>
            <p class="mt-6 leading-8 text-slate-300">
                I’m open to new opportunities, collaborations, and freelance work. If you'd like to connect, feel free to reach out through the contact details on this page.
            </p>
        </div>
    </div>
</section>
