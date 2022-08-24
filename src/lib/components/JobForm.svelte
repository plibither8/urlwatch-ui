<script lang="ts" context="module">
  export interface SimpleJob {
    name: string;
    url: string;
  }
</script>

<script lang="ts">
  import Button from "./Button.svelte";

  let loading = false;

  export let onSubmit: (job: SimpleJob) => any;
  export let onCancel: (() => any) | undefined = undefined;
  export let job: SimpleJob = {
    name: "",
    url: "",
  };
</script>

<form
  class="flex flex-col gap-2"
  on:submit={async (event) => {
    console.log("hello");
    event.preventDefault();
    if (job.name && job.url) {
      console.log("hello");
      loading = true;
      await onSubmit(job);
      loading = false;
    }
  }}
>
  <div class="space-y-1">
    <label for="input_name" class="text-xs text-slate-500">Job name</label>
    <input
      required
      id="input_name"
      aria-label="Job name"
      type="text"
      class="w-full text-sm px-3 py-2 border border-gray-300 rounded"
      placeholder="e.g. Courier tracking"
      bind:value={job.name}
    />
  </div>
  <div class="space-y-1">
    <label for="input_url" class="text-xs text-slate-500">URL</label>
    <input
      required
      id="input_url"
      aria-label="URL"
      type="text"
      class="w-full text-sm px-3 py-2 font-mono border border-gray-300 rounded"
      placeholder="https://example.com"
      bind:value={job.url}
    />
  </div>
  <div class="flex items-center justify-end gap-4 mt-2">
    {#if onCancel}
      <Button type="button" style="secondary" onClick={onCancel}>Cancel</Button>
    {/if}
    <Button
      style="primary"
      type="submit"
      {loading}
      disabled={!job.name || !job.url}
    >
      Submit
    </Button>
  </div>
</form>
