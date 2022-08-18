import { api } from "$lib/api";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ fetch }) => {
  const { data } = await api<Config>("config", undefined, fetch);
  return { config: data };
};
