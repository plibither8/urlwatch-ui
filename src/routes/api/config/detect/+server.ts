import { json } from "$lib/utils";
import { execSync } from "node:child_process";
import type { UrlwatchPath } from "../+server";
import type { RequestHandler } from "./$types";

export type DetectedPaths = Record<UrlwatchPath, string | null>;

interface Command {
  command: string;
  extractPath: (output: string) => string;
}

const WHICH_COMMAND = `which urlwatch`;

const commands: Record<UrlwatchPath, Command> = {
  installationPath: {
    command: WHICH_COMMAND,
    extractPath: (output) => output,
  },
  configPath: {
    command: `EDITOR=echo \`${WHICH_COMMAND}\` --edit-config`,
    extractPath: (output) => output.split("Saving edit changes in")[1]?.trim(),
  },
  urlsPath: {
    command: `EDITOR=echo \`${WHICH_COMMAND}\` --edit`,
    extractPath: (output) => output.split("Saving edit changes in")[1]?.trim(),
  },
};

export const GET: RequestHandler = async () => {
  const paths = Object.entries(commands).reduce(
    (prev, [key, { command, extractPath }]) => {
      let path: string | null;
      try {
        const output = execSync(command, { encoding: "utf8" }).trim();
        path = extractPath(output) ?? null;
      } catch {
        path = null;
      }
      return {
        ...prev,
        [key]: path,
      };
    },
    {}
  );
  return json({ paths });
};
