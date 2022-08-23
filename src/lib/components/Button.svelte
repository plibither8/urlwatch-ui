<script lang="ts" context="module">
  export type ButtonStyle =
    | "primary"
    | "secondary"
    | "danger"
    | "success"
    | "warning";
</script>

<script lang="ts">
  import LoadingSpinner from "./LoadingSpinner.svelte";

  export let onClick: ((...args: any[]) => any) | undefined = undefined;
  export let style: ButtonStyle = "primary";
  export let loading = false;

  const wrappedOnClick = async () => {
    if (onClick) {
      loading = true;
      try {
        await onClick();
      } catch {}
      loading = false;
    }
  };
</script>

<button
  on:click={wrappedOnClick}
  disabled={loading}
  {...$$props}
  class="
    flex items-center gap-2 px-2 py-1 text-sm font-medium rounded-md
    {style === 'primary'
    ? 'text-slate-50 bg-slate-700 border border-slate-900 hover:bg-slate-600'
    : style === 'secondary'
    ? 'text-slate-900 bg-slate-100 border border-slate-200 hover:bg-slate-200'
    : style === 'danger'
    ? 'text-red-900 bg-red-100 border border-red-200 rounded-md hover:bg-red-200 fill-red-600'
    : style === 'success'
    ? 'text-lime-900 bg-lime-100 border border-lime-200 rounded-md hover:bg-lime-200 fill-lime-600'
    : style === 'warning' &&
      'text-amber-900 bg-amber-100 border border-amber-200 rounded-md hover:bg-amber-200 fill-amber-600'}
    {$$props.class ?? ''} {loading && 'cursor-not-allowed'}"
>
  {#if loading}
    <LoadingSpinner />
  {:else}
    <slot />
  {/if}
</button>
