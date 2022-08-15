import type { Config } from "src/routes/api/config";
import { writable } from "svelte/store";

const config = writable<Config>();

export default config;
