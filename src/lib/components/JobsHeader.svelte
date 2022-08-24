<script lang="ts">
  import { api } from "$lib/api";

  import { jobs } from "$lib/stores";
  import toast from "svelte-french-toast";
  import { Icon, Play, PlusCircle } from "svelte-hero-icons";
  import Button from "./Button.svelte";

  const run = () => api(`jobs/run`, { method: "POST" });
</script>

{#if $jobs?.length}
  <div class="pl-2 flex-1 flex justify-between items-center">
    <p class="text-sm text-slate-500">({$jobs?.length})</p>
    <aside class="flex gap-4">
      <Button style="secondary" onClick={() => {}}>
        <Icon src={PlusCircle} class="w-4 h-4 fill-inherit" solid />
        New job
      </Button>
      <Button
        style="success"
        onClick={() =>
          toast.promise(run(), {
            loading: "Running jobs...",
            success: "Jobs successfully run",
            error: "Error while running jobs",
          })}
      >
        <Icon src={Play} class="w-4 h-4 fill-inherit" solid />
        Run all
      </Button>
    </aside>
  </div>
{/if}
