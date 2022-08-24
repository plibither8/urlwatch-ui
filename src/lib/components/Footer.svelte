<script>
  import { ExternalLink, Icon } from "svelte-hero-icons";
</script>

<footer class="text-xs text-slate-600 p-3 border-t gap-3 space-y-1">
  <p>
    <a
      href="https://github.com/plibither8/urlwatch-ui"
      target="_blank"
      rel="noopener noreferrer"
      class="hover:underline font-medium"
    >
      <code>urlwatch</code> UI
    </a>
    built by
    <a
      class="font-medium hover:underline"
      href="https://mihir.ch"
      target="_blank"
      rel="noopener"
    >
      Mihir Chaturvedi
    </a>
    and contributors
  </p>
  <p class="flex items-center gap-1">
    <a
      href="https://urlwatch.readthedocs.io/en/latest/"
      target="_blank"
      rel="noopener noreferrer"
      class="font-medium hover:underline"
    >
      Read <code>urlwatch</code> documentation
    </a>
    <Icon src={ExternalLink} class="h-3 w-3" solid />
  </p>
</footer>
