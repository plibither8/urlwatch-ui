<script lang="ts">
  import toast from "svelte-french-toast";
  import Button from "$lib/components/Button.svelte";
  import { config } from "$lib/stores";
  import type {
    ConfigResponse,
    UrlwatchPath,
  } from "../../routes/api/config/+server";
  import type { DetectedPaths } from "../../routes/api/config/detect/+server";
  import { api } from "$lib/api";

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
    const { data, message } = await api<DetectedPaths>("config/detect");
    if (!data) {
      toast.error(message);
      throw new Error(message);
    }
    configurablePaths.forEach(({ key }) => {
      if (data[key]) {
        bufferConfig.urlwatch[key] = data[key];
      }
    });
  };

  let loading = false;
  const updateConfig = async () => {
    loading = true;
    const { ok, data, message } = await api<ConfigResponse>("config", {
      method: "PATCH",
      body: bufferConfig,
    });
    if (!ok) {
      toast.error(message);
      loading = false;
      throw new Error(message);
    }
    if (data?.config) $config = data.config;
    loading = false;
  };
</script>

<section class="p-5 space-y-4 border rounded border-slate-100 bg-slate-50">
  <div class="space-y-2">
    <h2 class="text-lg font-bold text-slate-900">
      Configure your <code>urlwatch</code> installation
    </h2>
    <p class="text-sm leading-normal text-slate-900">
      Before continuing, please specify the path to your
      <code>urlwatch</code> installation/binary.
    </p>
  </div>
  <div class="space-y-4">
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
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          style="secondary"
          onClick={() =>
            toast.promise(detectPath(), {
              loading: "Detecting path...",
              success: "Path detected",
              error: "Error detecting path",
            })}
        >
          Automatically detect paths?
        </Button>
        <Button type="submit" {loading}>Configure</Button>
      </div>
    </form>
  </div>
</section>
