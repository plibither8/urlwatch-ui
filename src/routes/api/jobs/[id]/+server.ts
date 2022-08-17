import { respondWith } from "$lib/api";
import {
  getJobs,
  isValidJobId,
  runUrlwatchCommand,
  setJobs,
} from "$lib/urlwatch";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params }) => {
  const validity = await isValidJobId(params.id as string);
  if ("response" in validity) return validity.response;
  const { id } = validity;
  const jobs = await getJobs();
  if (jobs) return respondWith("JOB_FETCH_200", { data: jobs[id] });
  return respondWith("JOBS_FETCH_500");
};

export const PATCH: RequestHandler = async ({ params, request }) => {
  const validity = await isValidJobId(params.id as string);
  if ("response" in validity) return validity.response;
  const { id } = validity;
  const jobs = await getJobs();
  if (!jobs) return respondWith("JOBS_FETCH_500");
  const body = (await request.json()) as Partial<Job>;
  const newJob = { ...jobs[id - 1], ...body } as Job;
  jobs[id - 1] = newJob;
  if (await setJobs(jobs))
    return respondWith("JOB_UPDATE_200", { data: newJob });
  return respondWith("JOB_UPDATE_500");
};

export const DELETE: RequestHandler = async ({ params }) => {
  const validity = await isValidJobId(params.id as string);
  if ("response" in validity) return validity.response;
  const { id } = validity;
  const result = await runUrlwatchCommand(`--delete ${id}`);
  if (result) return respondWith("JOB_DELETE_200");
  return respondWith("JOB_DELETE_500");
};
