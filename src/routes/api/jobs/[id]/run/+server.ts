import { respondWith } from "$lib/api";
import { isValidJobId, runUrlwatchCommand } from "$lib/urlwatch";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ params }) => {
  const validity = await isValidJobId(params.id as string);
  if ("response" in validity) return validity.response;
  const { id } = validity;
  const result = await runUrlwatchCommand(`${id}`);
  return respondWith(result ? "JOB_RUN_200" : "JOB_RUN_500", { data: result });
};
