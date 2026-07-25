<script lang="ts">
  import { onMount } from 'svelte';
  import { getAllRepositories, getForkedRepositories } from '../github';
  import type { RepoSummary } from '../types';
  import RepoMarquee from './RepoMarquee.svelte';

  let ownedRepos = $state<RepoSummary[]>([]);
  let contributedRepos = $state<RepoSummary[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);

  onMount(async () => {
    // Read from Vite environment variable
    const token = import.meta.env.VITE_GITHUB_TOKEN;

    if (!token) {
      error = "Missing VITE_GITHUB_TOKEN in environment variables.";
      loading = false;
      return;
    }

    try {
      const [owned, contributed] = await Promise.all([
        getAllRepositories(token),
        getForkedRepositories(token)
      ]);

      ownedRepos = owned;
      contributedRepos = contributed;
    } catch (err: unknown) {
      error = err instanceof Error ? err.message : "Failed to load repositories.";
    } finally {
      loading = false;
    }
  });
</script>


<main class="min-h-screen py-12 text-white">
  {#if loading}
    <div class="flex justify-center p-8 text-slate-400 font-mono">
      Fetching repositories...
    </div>
  {:else if error}
    <div class="flex justify-center p-8 text-red-400 font-mono">
      {error}
    </div>
  {:else}
    <RepoMarquee {ownedRepos} {contributedRepos} />
  {/if}
</main>