<script lang="ts">
  import { api } from "$lib/api";
  import JobCard from "$lib/components/Job.svelte";
  import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
  import { jobs } from "$lib/stores";
  import { onMount } from "svelte";
  import Page from "$lib/components/Page.svelte";
  import JobsHeader from "$lib/components/JobsHeader.svelte";

  let loadingJobs = true;

  const fetchJobs = async () => {
    loadingJobs = true;
    const { data } = await api<Job[]>("jobs");
    $jobs = data;
    loadingJobs = false;
  };

  onMount(() => {
    fetchJobs();
  });
</script>

<svelte:head>
  <title>urlwatch UI</title>
</svelte:head>

<Page heading="Jobs" headerComponent={JobsHeader}>
  {#if loadingJobs}
    <div
      class="flex items-center justify-center w-full gap-5 p-10 text-slate-700"
    >
      <LoadingSpinner />
      <span class="text-lg font-medium">Fetching jobs...</span>
    </div>
  {/if}

  {#if $jobs?.length}
    <section class="space-y-5">
      {#each $jobs as job, id}
        <JobCard {job} id={id + 1} />
      {/each}
    </section>
  {/if}
</Page>
