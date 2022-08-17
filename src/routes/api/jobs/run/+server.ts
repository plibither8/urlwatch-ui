import { respondWith } from "$lib/api";
import { runUrlwatchCommand } from "$lib/urlwatch";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async () => {
  const result = await runUrlwatchCommand();
  if (result) return respondWith("JOB_RUN_200", { data: result });
  return respondWith("JOB_RUN_500");
};
