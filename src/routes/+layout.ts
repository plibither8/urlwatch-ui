import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ fetch }) => {
  const res = await fetch("/api/config");
  const config = (await res.json()) as { config: Config };
  return config;
};
