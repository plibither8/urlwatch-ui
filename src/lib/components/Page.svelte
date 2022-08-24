<script lang="ts">
  import type { SvelteComponent } from "svelte";

  export let heading: string;
  export let headerComponent: typeof SvelteComponent | undefined = undefined;
</script>

<header class="flex items-baseline justify-between py-5">
  <h2 class="text-2xl font-bold text-slate-900">{heading}</h2>
  <svelte:component this={headerComponent} />
</header>

<div class={$$props.class ?? ""}>
  <slot />
</div>
