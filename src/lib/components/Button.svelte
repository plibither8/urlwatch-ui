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
    flex outline items-center gap-2 px-2 py-1.5 text-sm font-medium rounded-md
  transition duration-150 active:scale-90
    {style === 'primary'
    ? 'text-slate-50 outline-slate-600 bg-slate-700 hover:bg-slate-600 fill-slate-100'
    : style === 'secondary'
    ? 'text-slate-900 outline-slate-100 bg-slate-50 hover:bg-slate-100 fill-slate-600'
    : style === 'danger'
    ? 'text-red-900 outline-red-100 bg-red-50 hover:bg-red-100 fill-red-600'
    : style === 'success'
    ? 'text-lime-900 outline-lime-100 bg-lime-50 hover:bg-lime-100 fill-lime-600'
    : style === 'warning' &&
      'text-amber-900 outline-amber-100 bg-amber-50 hover:bg-amber-100 fill-amber-600'}
    {$$props.class ?? ''} {loading && 'cursor-not-allowed'}"
>
  {#if loading}
    <LoadingSpinner />
  {:else}
    <slot />
  {/if}
</button>
