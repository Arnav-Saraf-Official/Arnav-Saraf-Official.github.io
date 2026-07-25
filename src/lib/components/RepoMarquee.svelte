<script lang="ts">
  import type { RepoSummary } from '../types';

  interface Props {
    ownedRepos?: RepoSummary[];
    contributedRepos?: RepoSummary[];
  }

  let { ownedRepos = [], contributedRepos = [] }: Props = $props();

  // Duplicate enough times so the marquee never shows a gap.
  // 4 copies × N repos must be wider than the viewport. With as few as
  // 3 repos × (320px card + 16px gap) ≈ 1008px, 4 copies fill ~4032px
  // which comfortably exceeds the widest viewports.
  let duplicatedOwned = $derived([...ownedRepos, ...ownedRepos, ...ownedRepos, ...ownedRepos]);
  let duplicatedContributed = $derived([...contributedRepos, ...contributedRepos, ...contributedRepos, ...contributedRepos]);
</script>

<div class="flex flex-col gap-8 overflow-hidden py-6">
  
  {#if ownedRepos.length > 0}
    <div class="flex flex-col gap-3">
      <h1 class="px-6 text-4xl font-semibold text-white titleRainbow mx-auto">
        My Own Repositories
      </h1>
      <div class="marquee-container flex overflow-hidden">
        <div class="marquee-track track-left flex gap-4 pr-4" style="--computed-time: {ownedRepos.length*9}s">
          {#each duplicatedOwned as repo, i (repo.url + '-' + i)}
            <div class="w-80 shrink-0 rounded-xl border border-white/10 bg-[#2f2f2f] backdrop-blur-[6px] p-4 text-slate-200 shadow-md">
              <div class="mb-2 flex items-center justify-between gap-2">
                <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
                <a href={repo.url} target="_blank" rel="noopener noreferrer external" class="truncate font-semibold text-[#8ab4f8] hover:underline">
                  {repo.name}
                </a>
                <span class="rounded-full border border-slate-700 px-2 py-0.5 text-[10px] text-slate-400">
                  {repo.isPublic ? 'Public' : 'Private'}
                </span>
              </div>
              
              <p class="mb-4 h-8 text-xs text-slate-400 line-clamp-2">
                {repo.body || 'No description provided.'}
              </p>

              <div class="flex items-center gap-4 text-xs text-slate-400">
                {#if repo.language}
                  <div class="flex items-center gap-1.5">
                    <span class="h-2.5 w-2.5 rounded-full" style="background-color: {repo.languageColor || '#8b949e'}"></span>
                    <span>{repo.language}</span>
                  </div>
                {/if}
                <div class="flex items-center gap-1">
                  <span>★</span>
                  <span>{repo.starCount}</span>
                </div>
                <div class="flex items-center gap-1">
                  <span>⌥</span>
                  <span>{repo.forkCount}</span>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}

  {#if contributedRepos.length > 0}
    <div class="flex flex-col gap-3">
      <h3 class="px-6 text-sm font-semibold tracking-wider text-slate-400 uppercase">
        Contributed Repositories
      </h3>
      <div class="marquee-container flex overflow-hidden">
        <div class="marquee-track track-right flex gap-4 pr-4">
          {#each duplicatedContributed as repo, i (repo.url + '-' + i)}
            <div class="w-80 shrink-0 rounded-xl border border-white/10 bg-[#1f1f1f] p-4 text-slate-200 shadow-md">
              <div class="mb-2 flex items-center justify-between gap-2">
                <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
                <a href={repo.url} target="_blank" rel="noopener noreferrer external" class="truncate font-semibold text-[#8ab4f8] hover:underline">
                  {repo.name}
                </a>
                <span class="rounded-full border border-slate-700 px-2 py-0.5 text-[10px] text-slate-400">
                  Contributed
                </span>
              </div>

              <p class="mb-4 h-8 text-xs text-slate-400 line-clamp-2">
                {repo.body || 'No description provided.'}
              </p>

              <div class="flex items-center gap-4 text-xs text-slate-400">
                {#if repo.language}
                  <div class="flex items-center gap-1.5">
                    <span class="h-2.5 w-2.5 rounded-full" style="background-color: {repo.languageColor || '#8b949e'}"></span>
                    <span>{repo.language}</span>
                  </div>
                {/if}
                <div class="flex items-center gap-1">
                  <span>★</span>
                  <span>{repo.starCount}</span>
                </div>
                <div class="flex items-center gap-1">
                  <span>⌥</span>
                  <span>{repo.forkCount}</span>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}

</div>

<style>
  .marquee-container:hover .marquee-track {
    animation-play-state: paused;
  }

  .track-left {
    animation: scroll-left var(--computed-time) linear infinite;
  }

  .track-right {
    animation: scroll-right 35s linear infinite;
  }

  @keyframes scroll-left {
    0% { transform: translateX(0%); }
    100% { transform: translateX(-75%); }
  }

  @keyframes scroll-right {
    0% { transform: translateX(-75%); }
    100% { transform: translateX(0%); }
  }
</style>