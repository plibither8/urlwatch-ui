import {
  getJobs,
  isValidJobId,
  runUrlwatchCommand,
  setJobs,
} from "$lib/urlwatch";
import type { RequestHandler } from "./$types";

export const PATCH: RequestHandler = async ({ params, request }) => {
  const [id, response] = await isValidJobId(params.id as string);
  if (response) return response;
  const jobs = await getJobs();
  if (!jobs) return new Response("Jobs not found", { status: 500 });
  const body = (await request.json()) as Partial<Job>;
  const newJob = { ...jobs[id - 1], ...body } as Job;
  jobs[id - 1] = newJob;
  if (await setJobs(jobs)) return new Response("Job updated", { status: 200 });
  return new Response("Job not updated", { status: 500 });
};

export const DELETE: RequestHandler = async ({ params }) => {
  const [id, response] = await isValidJobId(params.id as string);
  if (response) return response;
  const result = await runUrlwatchCommand(`--delete ${id}`);
  if (result) return new Response("Job deleted successfully", { status: 200 });
  return new Response("Job not deleted successfully", { status: 500 });
};
