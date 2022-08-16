import yaml from "js-yaml";
import { execSync } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { getConfig } from "../routes/api/config/+server";
import { readFile } from "node:fs/promises";

export const runUrlwatchCommand = async (
  subcommand?: string
): Promise<string | null> => {
  const config = await getConfig();
  try {
    const result = execSync(
      `${config.urlwatch.installationPath} ${subcommand ?? ""}`.trim(),
      { encoding: "utf8" }
    );
    return result.toString();
  } catch {
    return null;
  }
};

export const isValidJobId = async (
  suppliedId: string
): Promise<[number, null] | [null, Response]> => {
  const id = Number(suppliedId);
  if (isNaN(id)) return [null, new Response("Invalid job id", { status: 400 })];
  const jobs = await getJobs();
  if (!jobs || id > jobs.length)
    return [null, new Response("Job not found", { status: 404 })];
  return [id, null];
};

export const getJobs = async (): Promise<Job[] | null> => {
  const config = await getConfig();
  if (config.urlwatch.jobsPath) {
    try {
      const jobsFile = await readFile(config.urlwatch.jobsPath, "utf8");
      const jobs = yaml.loadAll(jobsFile) as Job[];
      return jobs;
    } catch {
      return null;
    }
  }
  return null;
};

export const setJobs = async (jobs: Job[]): Promise<string | null> => {
  const yamlContent = jobs.map((job) => yaml.dump(job)).join("\n---\n");
  try {
    const config = await getConfig();
    if (config.urlwatch.jobsPath) {
      await writeFile(config.urlwatch.jobsPath, yamlContent);
      return yamlContent;
    }
  } catch {
    return null;
  }
  return null;
};
