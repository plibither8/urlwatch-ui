<script lang="ts">
  import type { SvelteComponent } from "svelte";

  export let heading: string;
  export let headerComponent: typeof SvelteComponent | undefined = undefined;
</script>

<main class="p-5 pb-10 md:px-3">
  <header class="flex items-baseline justify-between py-5">
    <h2 class="text-2xl font-bold text-slate-900">{heading}</h2>
    <svelte:component this={headerComponent} />
  </header>

  <div {...$$props}>
    <slot />
  </div>
</main>
