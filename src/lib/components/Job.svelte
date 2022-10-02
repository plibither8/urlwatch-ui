<script lang="ts">
  import { api } from "$lib/api";
  import { jobs } from "$lib/stores";
  import toast from "svelte-french-toast";
  import {
    ExternalLink,
    Icon,
    Pencil,
    Play,
    Trash,
    type IconSource,
  } from "svelte-hero-icons";
  import { cubicInOut } from "svelte/easing";
  import { slide } from "svelte/transition";
  import Button, { type ButtonStyle } from "./Button.svelte";
  import JobForm from "./JobForm.svelte";

  export let job: Job;
  export let id: number;

  let showEditForm: boolean = false;

  const updateJob = async (job: Job) => {
    const { data } = await api<Job>(`jobs/${id}`, {
      method: "PATCH",
      body: job,
    });
    $jobs[id - 1] = data;
  };

  const actions = {
    delete: async () => {
      await api(`jobs/${id}`, { method: "DELETE" });
      $jobs.splice(id - 1, 1);
      $jobs = $jobs;
    },
    run: () => api(`jobs/${id}/run`, { method: "POST" }),
    edit: () => {
      showEditForm = !showEditForm;
    },
  };

  const buttons: {
    style: ButtonStyle;
    icon: IconSource;
    onClick: (...args: any[]) => any;
  }[] = [
    {
      style: "danger",
      icon: Trash,
      onClick: () =>
        toast.promise(actions.delete(), {
          loading: "Deleting job...",
          success: "Job successfully deleted",
          error: "Error while deleting job",
        }),
    },
    {
      style: "warning",
      icon: Pencil,
      onClick: () => actions.edit(),
    },
    {
      style: "success",
      icon: Play,
      onClick: () =>
        toast.promise(actions.run(), {
          loading: "Running job...",
          success: "Job successfully run",
          error: "Error while running job",
        }),
    },
  ];
</script>

<article
  id="job-{id}"
  class="space-y-5 p-4 rounded-md shadow shadow-slate-200 md:px-5 hover:shadow-md transition-shadow"
>
  <div
    class="flex flex-col gap-3 space-y-1 md:gap-5 md:items-center md:flex-row"
  >
    <div class="flex-1 w-full">
      <h3
        class="flex items-center gap-2 font-medium inline-center text-slate-700"
      >
        <span
          class="
              p-1 font-mono text-xs font-bold tracking-wider text-white uppercase
              rounded {'url' in job
            ? 'bg-yellow-900'
            : 'navigate' in job
            ? 'bg-lime-900'
            : 'bg-red-900'}
            "
        >
          {#if "url" in job}
            URL
          {:else if "navigate" in job}
            Browser
          {:else}
            Shell
          {/if}
        </span>
        <span>{job.name}</span>
      </h3>

      {#if "url" in job}
        <p class="flex overflow-auto text-sm text-slate-500">
          <a
            href={job.url}
            target="_blank"
            rel="noopener norefferer"
            class="break-all flex items-center gap-1 hover:underline focus:underline"
          >
            <span class=""
              >{job.url.length > 100
                ? `${job.url.substring(0, 97)}...`
                : job.url}</span
            >
            <Icon src={ExternalLink} class="w-4 h-4" />
          </a>
        </p>
      {/if}
    </div>

    <div class="flex self-end gap-4 md:self-center">
      {#each buttons as { style, icon, onClick }}
        <Button {style} {onClick}>
          <Icon src={icon} class="w-4 h-4 fill-inherit" solid />
        </Button>
      {/each}
    </div>
  </div>

  {#if showEditForm}
    <div
      class="space-y-2"
      transition:slide={{
        duration: 150,
        easing: cubicInOut,
      }}
    >
      <h3 class="text-slate-700 font-semibold">Edit job</h3>
      <JobForm
        submitButtonText="Edit"
        job={{
          name: job.name,
          url: job["url"],
        }}
        onCancel={() => {
          showEditForm = false;
        }}
        onSubmit={(job) =>
          toast.promise(updateJob(job), {
            success: "Job updated",
            loading: "Updating job...",
            error: "Job update failed",
          })}
      />
    </div>
  {/if}
</article>
