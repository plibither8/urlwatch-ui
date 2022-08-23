<script lang="ts">
  import Nav from "$lib/components/Nav.svelte";
  import { config } from "$lib/stores";
  import { Toaster } from "svelte-french-toast";
  import "../app.css";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;

  $config = data.config;
</script>

<Toaster />

<div class="max-w-5xl mx-auto">
  <Nav />
  <slot />
</div>
