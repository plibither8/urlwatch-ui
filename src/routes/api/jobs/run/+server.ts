import { runUrlwatchCommand } from "$lib/urlwatch";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async () => {
  const result = await runUrlwatchCommand();
  if (result) return new Response("Jobs run successfully", { status: 200 });
  return new Response("Jobs not run successfully", { status: 500 });
};
