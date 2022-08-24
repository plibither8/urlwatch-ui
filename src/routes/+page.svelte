<script lang="ts">
  import { api } from "$lib/api";
  import JobCard from "$lib/components/Job.svelte";
  import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
  import { jobs, isNewJobFormVisible } from "$lib/stores";
  import { onMount } from "svelte";
  import Page from "$lib/components/Page.svelte";
  import JobsHeader from "$lib/components/JobsHeader.svelte";
  import { slide } from "svelte/transition";
  import { cubicInOut } from "svelte/easing";
  import JobForm, { type SimpleJob } from "$lib/components/JobForm.svelte";
  import toast from "svelte-french-toast";

  let loadingJobs = true;

  const fetchJobs = async () => {
    loadingJobs = true;
    const { data } = await api<Job[]>("jobs");
    $jobs = data;
    loadingJobs = false;
  };

  const createJob = async (job: SimpleJob) => {
    const { data } = await api<Job>("jobs", {
      method: "POST",
      body: job,
    });
    $jobs = [...$jobs, data];
    $isNewJobFormVisible = false;
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
    {#if $isNewJobFormVisible}
      <section
        class="p-4 md:px-5 border rounded mb-5 space-y-2"
        transition:slide={{
          duration: 150,
          easing: cubicInOut,
        }}
      >
        <h3 class="text-slate-700 font-semibold">Create new job</h3>
        <JobForm
          submitButtonText="Create"
          onCancel={() => {
            $isNewJobFormVisible = false;
          }}
          onSubmit={(job) =>
            toast.promise(createJob(job), {
              success: "Job created",
              loading: "Creating job...",
              error: "Job creation failed",
            })}
        />
      </section>
    {/if}

    <section class="space-y-5">
      {#each $jobs as job, id}
        <JobCard {job} id={id + 1} />
      {/each}
    </section>
  {/if}
</Page>
