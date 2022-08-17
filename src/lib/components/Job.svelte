<script lang="ts">
  import { api } from "$lib/api";

  import toast from "svelte-french-toast";
  import { Icon, ExternalLink, Play, Trash, Pencil } from "svelte-hero-icons";
  import Button from "./Button.svelte";

  const run = async () => {
    const { ok, message } = await api(`jobs/${id}/run`, { method: "POST" });
    if (!ok) {
      toast.error(message);
      throw new Error(message);
    }
  };

  export let job: Job;
  export let id: number;
</script>

<article
  id="job-{id}"
  class="flex flex-col flex-wrap gap-3 px-2 py-4 space-y-1 rounded-md md:px-5 md:gap-5 md:items-center md:flex-row hover:bg-slate-100"
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
      <p class="overflow-auto text-sm text-slate-500">
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
  <div class="flex gap-4">
    <Button style="danger">
      <Icon src={Trash} class="w-4 h-4 fill-red-600" solid />
      Delete
    </Button>
    <Button style="warning">
      <Icon src={Pencil} class="w-4 h-4 fill-amber-600" solid />
      Edit
    </Button>
    <Button
      style="success"
      onClick={() =>
        toast.promise(run(), {
          loading: "Running job...",
          success: "Job successfully run",
          error: "Error while running job",
        })}
    >
      <Icon src={Play} class="w-4 h-4 fill-lime-600" solid />
      Run
    </Button>
  </div>
</article>
