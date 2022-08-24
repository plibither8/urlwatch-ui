import { respondWith } from "$lib/api";
import { getJobs, setJobs } from "$lib/urlwatch";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
  const jobs = await getJobs();
  if (!jobs) return respondWith("JOBS_FETCH_500");
  return respondWith("JOBS_FETCH_200", { data: jobs });
};

export const POST: RequestHandler = async ({ request }) => {
  const jobs = await getJobs();
  if (!jobs) return respondWith("JOBS_FETCH_500");
  const job = (await request.json()) as Job;
  if (await setJobs([...jobs, job]))
    return respondWith("JOB_CREATE_200", { data: job });
  return respondWith("JOB_CREATE_500");
};
