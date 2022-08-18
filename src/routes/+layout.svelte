<script lang="ts">
  import { config } from "$lib/stores";
  import { Toaster } from "svelte-french-toast";
  import "../app.css";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;

  $config = data.config;
</script>

<Toaster />

<slot />
