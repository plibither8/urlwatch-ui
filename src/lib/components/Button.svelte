<script lang="ts">
  import LoadingSpinner from "./LoadingSpinner.svelte";

  export let onClick: ((...args: any[]) => any) | undefined = undefined;

  let loading = false;
  const wrappedOnClick = async () => {
    if (onClick) {
      loading = true;
      await onClick();
      loading = false;
    }
  };
</script>

<button
  {...$$props}
  on:click={async () => await wrappedOnClick()}
  class="
    inline-flex gap-2 items-center px-4 py-2 font-semibold leading-6 text-sm
    rounded text-white bg-slate-600 hover:bg-slate-500
    {$$props.class ?? ''} {loading && 'cursor-not-allowed'}"
>
  {#if loading}
    <LoadingSpinner />
  {/if}
  <span>
    <slot />
  </span>
</button>
