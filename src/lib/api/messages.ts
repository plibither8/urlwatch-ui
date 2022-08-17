// https://stackoverflow.com/a/70994696/6183068
const satisfies =
  <T>() =>
  <U extends T>(u: U) =>
    u;

// Message key must be of the form `${name}_${status}`
export const messages = satisfies<Record<string, string>>()({
  CONFIG_PATHS_DETECT_200: "Config paths detected successfully",
  CONFIG_FETCH_200: "Config fetched successfully",
  CONFIG_ACCESS_500: "Could not access config file.",
  CONFIG_CREATE_500:
    "Could not create app config file. Please create it manually.",

  CONFIG_UPDATE_200: "Config updated successfully",
  CONFIG_UPDATE_500: "Job update failed",

  JOB_FETCH_200: "Job fetched successfully",
  JOB_FETCH_500: "Job fetch failed",

  JOBS_FETCH_200: "Jobs fetched successfully",
  JOBS_FETCH_500: "Jobs fetch failed",

  JOB_ID_INVALID_400: "Invalid job ID",
  JOB_ID_NOT_FOUND_404: "Job not found",

  JOB_RUN_200: "Job run successfully",
  JOB_RUN_500: "Job run failed",

  JOB_CREATE_200: "Job created successfully",
  JOB_CREATE_500: "Job create failed",

  JOB_UPDATE_200: "Job updated successfully",
  JOB_UPDATE_500: "Job update failed",

  JOB_DELETE_200: "Job deleted successfully",
  JOB_DELETE_500: "Job delete failed",
});

export type MESSAGE_KEYS = keyof typeof messages;
