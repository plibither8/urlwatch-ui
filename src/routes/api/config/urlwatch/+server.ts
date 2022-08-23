import { getConfig } from "../ui/+server";
import type { RequestHandler } from "./$types";
import { readFile, writeFile } from "node:fs/promises";
import { respondWith } from "$lib/api";

export const GET: RequestHandler = async () => {
  try {
    const uiConfig = await getConfig();
    if (!uiConfig?.urlwatch?.configPath)
      return respondWith("URLWATCH_CONFIG_FETCH_404");
    const config = await readFile(uiConfig.urlwatch.configPath, "utf-8");
    return respondWith("URLWATCH_CONFIG_FETCH_200", {
      data: { config },
    });
  } catch (error) {
    return respondWith("URLWATCH_CONFIG_FETCH_500", {
      details: error,
    });
  }
};

export const PATCH: RequestHandler = async ({ request }) => {
  try {
    const { config } = (await request.json()) as { config: string };
    const uiConfig = await getConfig();
    if (!uiConfig?.urlwatch?.configPath)
      return respondWith("URLWATCH_CONFIG_FETCH_404");
    await writeFile(uiConfig.urlwatch.configPath, config);
    return respondWith("URLWATCH_CONFIG_UPDATE_200", {
      data: { config },
    });
  } catch (error) {
    return respondWith("URLWATCH_CONFIG_UPDATE_500", {
      details: error,
    });
  }
};
