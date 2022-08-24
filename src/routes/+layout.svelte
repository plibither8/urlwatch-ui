<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Footer from "$lib/components/Footer.svelte";
  import Nav from "$lib/components/Nav.svelte";
  import { config, requiresConfig } from "$lib/stores";
  import { Toaster } from "svelte-french-toast";
  import "../app.css";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;

  $config = data.config;

  $: if ($requiresConfig && $page.routeId !== "config") {
    goto("/config");
  }
</script>

<Toaster />

<div class="min-h-screen flex flex-col max-w-5xl mx-auto">
  <Nav />
  <main class="flex-1 p-5 pb-10 md:px-3">
    <slot />
  </main>
  <Footer />
</div>
