<script lang="ts">
  import type { LayoutData } from "./$types";
  import { config } from "$lib/stores";
  import { Toaster } from "svelte-french-toast";
  import "../app.css";

  export let data: LayoutData;

  $config = data.config;
</script>

<Toaster />

<slot />
