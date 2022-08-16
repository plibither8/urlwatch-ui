import { getJobs, setJobs } from "$lib/urlwatch";
import { json } from "$lib/utils";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
  const jobs = await getJobs();
  return json(jobs ?? [], { status: jobs ? 200 : 500 });
};

export const POST: RequestHandler = async ({ request }) => {
  const jobs = await getJobs();
  if (!jobs) return new Response("Jobs not found", { status: 500 });
  const job = (await request.json()) as Job;
  if (await setJobs([...jobs, job]))
    return new Response("Job created", { status: 200 });
  return new Response("Job not created", { status: 500 });
};
