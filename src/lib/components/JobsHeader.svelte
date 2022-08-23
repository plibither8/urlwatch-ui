<script lang="ts">
  import { api } from "$lib/api";

  import { jobs } from "$lib/stores";
  import toast from "svelte-french-toast";
  import { Icon, Play } from "svelte-hero-icons";
  import Button from "./Button.svelte";

  const run = () => api(`jobs/run`, { method: "POST" });
</script>

{#if $jobs?.length}
  <Button
    style="success"
    onClick={() =>
      toast.promise(run(), {
        loading: "Running jobs...",
        success: "Jobs successfully run",
        error: "Error while running jobs",
      })}
  >
    <Icon src={Play} class="w-4 h-4 fill-lime-600" solid />
    Run all
  </Button>
{/if}
