<script lang="ts">
  import { Icon, ExternalLink, Play, Trash, Pencil } from "svelte-hero-icons";
  import Button from "./Button.svelte";

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
    <button
      class="flex items-center gap-2 px-2 py-1 text-sm font-medium text-red-900 bg-red-100 border border-red-200 rounded-md hover:bg-red-200"
    >
      <Icon src={Trash} class="w-4 h-4 fill-red-600" solid />
      Delete
    </button>
    <button
      class="flex items-center gap-2 px-2 py-1 text-sm font-medium border rounded-md text-amber-900 border-amber-200 bg-amber-100 hover:bg-amber-200"
    >
      <Icon src={Pencil} class="w-4 h-4 fill-amber-600" solid />
      Edit
    </button>
    <button
      class="flex items-center gap-2 px-2 py-1 text-sm font-medium border rounded-md text-lime-900 border-lime-200 bg-lime-100 hover:bg-lime-200"
    >
      <Icon src={Play} class="w-4 h-4 fill-lime-600" solid />
      Run
    </button>
  </div>
</article>
