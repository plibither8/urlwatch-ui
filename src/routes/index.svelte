<script lang="ts">
  import SetConfig from "$lib/components/SetConfig.svelte";
  import config from "$lib/stores/config";
</script>

<div class="max-w-5xl mx-auto">
  <nav class="flex items-baseline justify-between px-3 py-2 border-b">
    <a href="/">
      <h1 class="text-lg font-bold">urlwatch UI</h1>
    </a>
    <ul class="text-slate-500">
      <li>
        <a
          href="https://github.com/plibither8/urlwatch-ui"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:underline"
        >
          GitHub
        </a>
      </li>
    </ul>
  </nav>
  <main class="px-3 py-5 sm:px-0">
    {#if !$config.urlwatchPath} <SetConfig /> {/if}
  </main>
</div>
