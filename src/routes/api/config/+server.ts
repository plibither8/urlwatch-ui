import { respond, respondWith } from "$lib/api";
import type { RequestHandler } from "./$types";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { messages } from "$lib/api/messages";

export type UrlwatchPath = keyof Config["urlwatch"];

export interface ConfigResponse {
  config: Config | null;
  error?: string;
}

const CONFIG_FILEPATH =
  process.env.CONFIG_FILEPATH ?? `${process.cwd()}/data/config.json`;

const DEFAULT_CONFIG: Config = {
  urlwatch: {
    installationPath: null,
    jobsPath: null,
    configPath: null,
  },
};

export const getConfig = async (): Promise<Config> => {
  await access(CONFIG_FILEPATH);
  const configFile = await readFile(CONFIG_FILEPATH, "utf8");
  return JSON.parse(configFile) as Config;
};

const createConfig = async () => {
  const directory = resolve(CONFIG_FILEPATH, "..");
  await mkdir(directory, { recursive: true });
  await writeFile(
    CONFIG_FILEPATH,
    JSON.stringify(DEFAULT_CONFIG, null, 2),
    "utf8"
  );
};

const updateConfig = async (config: Partial<Config>): Promise<Config> => {
  const currentConfig = await getConfig();
  const newConfig = { ...currentConfig, ...config };
  await writeFile(CONFIG_FILEPATH, JSON.stringify(newConfig, null, 2), "utf8");
  return newConfig;
};

export const GET: RequestHandler = async (...args) => {
  try {
    const config = await getConfig();
    return respondWith("CONFIG_FETCH_200", { data: config });
  } catch (err: any) {
    if (err.code === "ENOENT") {
      try {
        await createConfig();
        return GET(...args);
      } catch (err) {
        return respondWith("CONFIG_CREATE_500", {
          details: {
            configPath: CONFIG_FILEPATH,
            error: err,
          },
        });
      }
    }
    return respondWith("CONFIG_ACCESS_500", {
      details: { error: err },
    });
  }
};

export const PATCH: RequestHandler = async ({ request }) => {
  const patch = (await request.json()) as Partial<Config>;
  try {
    const config = await updateConfig(patch);
    return respondWith("CONFIG_UPDATE_200", { data: config });
  } catch (err) {
    return respondWith("CONFIG_UPDATE_500", {
      details: { error: err },
    });
  }
};
