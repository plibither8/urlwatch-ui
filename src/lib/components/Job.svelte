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
  import Button, { type ButtonStyle } from "./Button.svelte";

  export let job: Job;
  export let id: number;

  const actions = {
    delete: async () => {
      await api(`jobs/${id}`, { method: "DELETE" });
      $jobs.splice(id - 1, 1);
      $jobs = $jobs;
    },
    run: () => api(`jobs/${id}/run`, { method: "POST" }),
    edit: () => {},
  };

  const buttons: {
    style: ButtonStyle;
    icon: IconSource;
    text: string;
    onClick: (...args: any[]) => any;
  }[] = [
    {
      text: "Delete",
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
      text: "Edit",
      style: "warning",
      icon: Pencil,
      onClick: () => actions.edit(),
    },
    {
      text: "Run",
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
  class="flex flex-col flex-wrap gap-3 p-4 space-y-1 rounded-md shadow shadow-slate-200 md:py-4 md:px-5 md:gap-5 md:items-center md:flex-row hover:bg-slate-50"
>
  <aside class="text-slate-400">
    <span>{id}</span>.
  </aside>

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
          Shell
        {:else}
          Browser
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
          class="flex items-center gap-1 hover:underline"
        >
          <span>{job.url}</span>
          <Icon src={ExternalLink} class="w-4 h-4" />
        </a>
      </p>
    {/if}
  </div>

  <div class="flex self-end gap-4 md:self-center">
    {#each buttons as { style, icon, text, onClick }}
      <Button {style} {onClick}>
        <Icon src={icon} class="w-4 h-4 fill-inherit" solid />
        {text}
      </Button>
    {/each}
  </div>
</article>
