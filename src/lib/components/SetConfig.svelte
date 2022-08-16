<script lang="ts">
  import toast from "svelte-french-toast";
  import Button from "$lib/components/Button.svelte";
  import { config } from "$lib/stores";
  import type {
    ConfigResponse,
    UrlwatchPath,
  } from "../../routes/api/config/+server";
  import type { DetectedPaths } from "../../routes/api/config/detect/+server";

  interface ConfigurablePath {
    key: UrlwatchPath;
    pathTo: string;
    example: string;
  }

  const bufferConfig: Config = { ...$config };

  const configurablePaths: ConfigurablePath[] = [
    {
      key: "installationPath",
      pathTo: "urlwatch",
      example: "/usr/local/bin/urlwatch",
    },
    {
      key: "jobsPath",
      pathTo: "urlwatch's list of jobs",
      example: "~/.config/urlwatch/urls.yaml",
    },
    {
      key: "configPath",
      pathTo: "urlwatch's config file",
      example: "~/.config/urlwatch/urlwatch.yaml",
    },
  ];

  const detectPath = async () => {
    const res = await fetch("/api/config/detect");
    const { paths } = (await res.json()) as { paths: DetectedPaths };
    configurablePaths.forEach(({ key }) => {
      if (paths[key]) {
        bufferConfig.urlwatch[key] = paths[key];
      }
    });
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
  <div class="space-y-4">
    <button
      class="text-sm font-medium underline"
      on:click={() =>
        toast.promise(detectPath(), {
          loading: "Detecting path...",
          success: "Path detected",
          error: "Error detecting path",
        })}
    >
      Automatically detect paths?
    </button>
    <form
      class="flex flex-col gap-4"
      on:submit={(event) => {
        event.preventDefault();
        toast.promise(updateConfig(), {
          loading: "Updating config...",
          success: "Config updated",
          error: "Error updating config",
        });
      }}
    >
      {#each configurablePaths as { key, pathTo, example }}
        <div class="space-y-1">
          <label for="input_{key}" class="text-sm text-slate-500"
            >Path to {pathTo}</label
          >
          <input
            id="input_{key}"
            aria-label="Path to {pathTo}"
            type="text"
            class="w-full px-3 py-2 font-mono border border-gray-300 rounded"
            placeholder="e.g. {example}"
            bind:value={bufferConfig.urlwatch[key]}
          />
        </div>
      {/each}
      <Button type="submit" class="self-end whitespace-nowrap">Configure</Button
      >
    </form>
  </div>
</section>
