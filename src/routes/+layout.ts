import { api } from "$lib/api";
import { redirect } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ fetch, route }) => {
  const { data } = await api<Config>("config/ui", undefined, fetch);
  const requiresConfig = Object.values(data.urlwatch).some((value) => !value);
  if (route.id !== "/config" && requiresConfig) throw redirect(302, "/config");
  return { config: data };
};
