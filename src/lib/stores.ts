import { writable, derived } from "svelte/store";

export const config = writable<Config>();

export const requiresConfig = derived([config], ([value], set) => {
  set(Object.values(value?.urlwatch ?? {}).some((v) => !v));
});

export const jobs = writable<Job[]>();

export const isNewJobFormVisible = writable<boolean>(false);
