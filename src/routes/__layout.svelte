<script lang="ts" context="module">
  import type { Load } from "@sveltejs/kit";
  import type { Config } from "./api/config";
  export const load: Load = async ({ fetch }) => {
    const res = await fetch("/api/config");
    const data = (await res.json()) as {
      config: Config;
    };
    return {
      status: 200,
      props: data,
    };
  };
</script>

<script>
  import config from "$lib/stores/config";
  import { Toaster } from "svelte-french-toast";
  import "../app.css";

  $config = $$props.config;
</script>

<Toaster />

<slot />
