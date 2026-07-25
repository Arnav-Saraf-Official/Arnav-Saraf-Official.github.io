<script lang="ts">
  import { onMount } from 'svelte';
  import { resolve } from '$app/paths';
  import { goto } from '$app/navigation';

  let navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/#about' },
    { label: 'Projects', href: '/#projects' },
    { label: 'Contact', href: '/#contact' }
  ] as const;

  let activeIndex = $state(0);
  let accentColors = ['#8ab4f8', '#fdd663', '#f28b82', '#81c995'];
  let currentAccent = $state(accentColors[0]);
  let intervalId = 0;

  onMount(() => {
    intervalId = window.setInterval(() => {
      const nextIndex = (accentColors.indexOf(currentAccent) + 1) % accentColors.length;
      currentAccent = accentColors[nextIndex];
    }, 1800);

    return () => {
      clearInterval(intervalId);
    };
  });
</script>

<nav class="fixed top-5 z-50 px-4 w-full">
  <div class="mx-auto flex max-w-3xl items-center justify-between rounded-full border border-white/10 bg-[#2f2f2f]/10 p-2 px-6 shadow-lg backdrop-blur-[8px] transition-all duration-300">
    
    <a href={resolve('/')} on:click={(e) => { e.preventDefault(); goto(resolve('/')); }} class="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-white transition-opacity hover:opacity-80 no-underline">
      <span class="inline-block h-3 w-3 rounded-full" style="background-color: {currentAccent};"></span>
      Hello
    </a>

    <ul class="hidden items-center gap-1 sm:flex">
      {#each navItems as item, index (index)}
        <li>
          <a
            href={resolve(item.href)}
            on:click={(e) => { e.preventDefault(); goto(resolve(item.href)); activeIndex = index; }}
            class="rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 no-underline 
              {activeIndex === index 
                ? 'bg-[#3c4043] text-[#8ab4f8]' 
                : 'text-gray-300 hover:bg-white/5 hover:text-white'}"
          >
            {item.label}
          </a>
        </li>
      {/each}
    </ul>

    <a
      href={resolve('/#cta')}
      on:click={(e) => { e.preventDefault(); goto(resolve('/#cta')); }}
      class="button"
      style="--button-accent: {currentAccent};"
    >
      Get in touch
    </a>

  </div>
</nav>