import yaml from "js-yaml";
import { exec } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { getConfig } from "../routes/api/config/ui/+server";
import { respondWith } from "./api";

export const runUrlwatchCommand = async (
  subcommand?: string
): Promise<{ result: string } | { response: Response }> => {
  const config = await getConfig();
  const command = `${config.urlwatch.installationPath} ${
    subcommand ?? ""
  }`.trim();
  try {
    const result = await new Promise<string>((resolve, reject) => {
      exec(command, { encoding: "utf8" }, (error, stdout, stderr) => {
        if (error || stderr) return reject(error || stderr);
        resolve(stdout);
      });
    });
    return { result };
  } catch (error) {
    return {
      response: respondWith("JOB_RUN_500", {
        details: String(error),
      }),
    };
  }
};

export const isValidJobId = async (
  suppliedId: string
): Promise<{ response: Response } | { id: number }> => {
  const id = Number(suppliedId);
  if (isNaN(id)) return { response: respondWith("JOB_ID_INVALID_400") };
  const jobs = await getJobs();
  if (!jobs || id > jobs.length)
    return { response: respondWith("JOB_ID_NOT_FOUND_404") };
  return { id };
};

export const getJobs = async (): Promise<Job[] | null> => {
  const config = await getConfig();
  if (config.urlwatch.jobsPath) {
    try {
      const jobsFile = await readFile(config.urlwatch.jobsPath, "utf8");
      const jobs = yaml.loadAll(jobsFile) as Job[];
      return jobs;
    } catch (err) {
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
