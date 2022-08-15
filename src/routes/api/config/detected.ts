import type { RequestHandler } from "@sveltejs/kit";
import { execSync } from "node:child_process";

export interface DetectedPath {
  path: string | null;
}

const WHICH_COMMAND = `which urlwatch`;

/** @type {import('@sveltejs/kit').RequestHandler} */
export const GET: RequestHandler<
  Record<string, string>,
  DetectedPath
> = async () => {
  try {
    const path = execSync(WHICH_COMMAND, { encoding: "utf8" }).trim();
    return {
      status: 200,
      body: { path },
    };
  } catch {
    return {
      status: 500,
      body: { path: null },
    };
  }
};
