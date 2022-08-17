import type { LayoutLoad } from "./$types";
import { api } from "$lib/api";

export const load: LayoutLoad = async ({ fetch }) => {
  const { data } = await api<Config>("config", undefined, fetch);
  return { config: data };
};
