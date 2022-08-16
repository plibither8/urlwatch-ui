import { writable } from "svelte/store";

export const config = writable<Config>();

export const jobs = writable<Job[]>();
