<script lang="ts">
  import toast from "svelte-french-toast";
  import Button from "$lib/components/Button.svelte";
  import config from "$lib/stores/config";
  import type {
    Config,
    ConfigResponse,
  } from "../../routes./../routes/api/config";
  import type { DetectedPath } from "../../routes./../routes/api/config/detected";

  const bufferConfig: Config = { ...$config };

  const detectPath = async () => {
    const res = await fetch("/api/config/detected");
    const data = (await res.json()) as DetectedPath;
    bufferConfig.urlwatchPath = data.path ?? "";
  };

  const updateConfig = async () => {
    try {
      const res = await fetch("/api/config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bufferConfig),
      });
      const data = (await res.json()) as ConfigResponse;
      if (data.config) $config = data.config;
    } catch (err) {}
  };
</script>

<section
  class="p-5 space-y-4 leading-normal border rounded border-slate-100 bg-slate-50"
>
  <div class="space-y-2">
    <h2 class="font-bold text-slate-900">
      Configure your <code>urlwatch</code> installation
    </h2>
    <p class="text-sm text-slate-900">
      Before continuing, please specify the path to your
      <code>urlwatch</code> installation/binary.
    </p>
  </div>
  <div class="space-y-2">
    <button
      class="text-sm font-medium underline"
      on:click={() =>
        toast.promise(detectPath(), {
          loading: "Detecting path...",
          success: "Path detected",
          error: "Error detecting path",
        })}
    >
      Automatically detect path?
    </button>
    <form
      class="flex gap-2"
      on:submit={(event) => {
        event.preventDefault();
        toast.promise(updateConfig(), {
          loading: "Updating config...",
          success: "Config updated",
          error: "Error updating config",
        });
      }}
    >
      <input
        aria-label="Path to urlwatch"
        type="text"
        class="w-full px-3 py-2 font-mono border border-gray-300 rounded"
        placeholder="e.g. /usr/local/bin/urlwatch"
        bind:value={bufferConfig.urlwatchPath}
      />
      <Button onClick={updateConfig} type="submit" class="whitespace-nowrap">
        Set path
      </Button>
    </form>
  </div>
</section>
