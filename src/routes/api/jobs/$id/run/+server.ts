import { isValidJobId, runUrlwatchCommand } from "$lib/urlwatch";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ params }) => {
  const [id, response] = await isValidJobId(params.id as string);
  if (response) return response;
  const result = await runUrlwatchCommand(`${id}`);
  if (result) return new Response("Job run successfully", { status: 200 });
  return new Response("Job not run successfully", { status: 500 });
};
