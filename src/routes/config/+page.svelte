<script lang="ts">
  import { goto } from "$app/navigation";
  import { api } from "$lib/api";
  import Button from "$lib/components/Button.svelte";
  import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
  import Page from "$lib/components/Page.svelte";
  import { config, requiresConfig } from "$lib/stores";
  import { indentWithTab } from "@codemirror/commands";
  import { StreamLanguage } from "@codemirror/language";
  import { yaml } from "@codemirror/legacy-modes/mode/yaml";
  import { keymap } from "@codemirror/view";
  import { basicSetup, EditorView } from "codemirror";
  import { onMount } from "svelte";
  import toast from "svelte-french-toast";
  import { Icon, Save } from "svelte-hero-icons";
  import type { UrlwatchPath } from "../api/config/ui/+server";
  import type { DetectedPaths } from "../api/config/ui/detect/+server";

  interface ConfigurablePath {
    key: UrlwatchPath;
    pathTo: string;
    example: string;
  }

  const bufferConfig: Config = {
    ...$config,
    urlwatch: {
      ...$config.urlwatch,
    },
  };

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

  let urlwatchUiLoading = false;

  const detectPath = async () => {
    const { data } = await api<DetectedPaths>("config/ui/detect");
    configurablePaths.forEach(({ key }) => {
      if (data[key]) {
        bufferConfig.urlwatch[key] = data[key];
      }
    });
  };

  const updateUiConfig = async () => {
    urlwatchUiLoading = true;
    const { data } = await api<Config>("config/ui", {
      method: "PATCH",
      body: bufferConfig,
    });
    $config = data;
    urlwatchUiLoading = false;
    !urlwatchConfig.show && goto("/");
  };

  const urlwatchConfig: {
    show: boolean;
    config: string | null;
    loading: boolean;
    error: boolean;
  } = {
    show: !$requiresConfig,
    config: null,
    loading: false,
    error: false,
  };

  let editor: EditorView;
  let editorElement: HTMLDivElement;
  $: if (editorElement && urlwatchConfig.config) {
    editor = new EditorView({
      doc: urlwatchConfig.config,
      extensions: [
        basicSetup,
        keymap.of([indentWithTab]),
        StreamLanguage.define(yaml),
      ],
      parent: editorElement,
    });
  }

  const getUrlwatchConfig = async () => {
    try {
      urlwatchConfig.loading = true;
      const { data } = await api<{ config: string }>("config/urlwatch");
      urlwatchConfig.config = data.config;
    } catch {
      urlwatchConfig.error = true;
    }
    urlwatchConfig.loading = false;
  };

  const saveUrlwatchConfig = async () =>
    await api("config/urlwatch", {
      method: "PATCH",
      body: {
        config: editor.state.doc.toString(),
      },
    });

  onMount(() => {
    urlwatchConfig.show && getUrlwatchConfig();
  });
</script>

<svelte:head>
  <title>Config &middot; urlwatch UI</title>
</svelte:head>

<Page heading="Config" class="space-y-10">
  {#if urlwatchConfig.show}
    <section id="urlwatch-config" class="space-y-5">
      <header class="space-y-2">
        <h2 class="text-lg font-bold text-slate-900">
          <code>urlwatch</code>
        </h2>
        <p class="text-sm leading-normal text-slate-900">
          Configuration for your <code>urlwatch</code> program.
        </p>
      </header>
      {#if urlwatchConfig.loading}
        <div
          class="flex items-center justify-center w-full gap-5 p-10 text-slate-700"
        >
          <LoadingSpinner />
          <span class="text-sm font-medium">Fetching urlwatch config...</span>
        </div>
      {:else if urlwatchConfig.error}
        <div
          class="p-5 text-sm text-red-900 border border-red-100 rounded bg-red-50"
        >
          An error occured while fetching urlwatch's config. Please see browser
          console for details, or try reloading the page.
        </div>
      {:else}
        <div bind:this={editorElement} />
        <div class="flex justify-end">
          <Button
            style="success"
            onClick={() =>
              toast.promise(saveUrlwatchConfig(), {
                loading: "Updating config...",
                success: "Config updated",
                error: "Error updating config",
              })}
          >
            <Icon src={Save} class="w-4 h-4 fill-inherit" solid />
            Save
          </Button>
        </div>
      {/if}
    </section>

    <hr />
  {/if}

  <section id="urlwatch-ui-config" class="space-y-5">
    <header class="space-y-2">
      <h2 class="text-lg font-bold text-slate-900">
        <code>urlwatch</code> UI
      </h2>
      <p class="text-sm leading-normal text-slate-900">
        Specify the paths to your <code>urlwatch</code>
        installation/binary, and associated files. These are used by "urlwatch UI"
        to interact with the <code>urlwatch</code> CLI.
      </p>
    </header>
    <form
      class="flex flex-col gap-5"
      on:submit={(event) => {
        event.preventDefault();
        toast.promise(updateUiConfig(), {
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
              loading: "Detecting paths...",
              success: "Paths detected",
              error: "Error detecting paths",
            })}
        >
          Automatically detect paths
        </Button>
        <Button style="success" type="submit" loading={urlwatchUiLoading}>
          <Icon src={Save} class="w-4 h-4 fill-inherit" solid />
          Save
        </Button>
      </div>
    </form>
  </section>
</Page>

<style lang="postcss">
  :global(.cm-scroller) {
    @apply overflow-auto;
  }

  :global(.cm-editor) {
    @apply border rounded-md max-h-96;
  }
</style>
