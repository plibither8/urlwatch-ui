<script lang="ts">
  import SetConfig from "$lib/components/SetConfig.svelte";
  import { config, jobs } from "$lib/stores";
  import Nav from "$lib/components/Nav.svelte";
  import { onMount } from "svelte";
  import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
  import Job from "$lib/components/Job.svelte";

  const requiresConfig = Object.values($config.urlwatch).some(
    (value) => !value
  );

  let loadingJobs = !requiresConfig;

  const fetchJobs = async () => {
    loadingJobs = true;
    const res = await fetch("/api/jobs");
    $jobs = (await res.json()) as Job[];
    loadingJobs = false;
  };

  onMount(() => {
    fetchJobs();
  });
</script>

<div class="max-w-5xl mx-auto">
  <Nav />

  <main class="px-3 py-5 sm:px-0">
    {#if Object.values($config.urlwatch).some((value) => !value)}
      <SetConfig />
    {/if}

    {#if loadingJobs}
      <div
        class="flex items-center justify-center w-full gap-5 p-10 text-slate-700"
      >
        <LoadingSpinner />
        <span class="text-lg font-medium">Fetching jobs...</span>
      </div>
    {/if}

    {#if $jobs?.length}
      <section>
        <header class="p-2 md:p-5">
          <h2 class="text-2xl font-bold text-slate-900">Jobs</h2>
        </header>
        {#each $jobs as job, id}
          <Job {job} id={id + 1} />
        {/each}
      </section>
    {/if}
  </main>
</div>
