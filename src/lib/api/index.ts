import { browser } from "$app/environment";
import toast from "svelte-french-toast";
import { messages, type MESSAGE_KEYS } from "./messages";

interface ApiResponseArgs<ResponseData = unknown> {
  message: string;
  data?: ResponseData;
  key?: MESSAGE_KEYS;
  details?: any;
  status?: number;
}

export interface ApiResponse<ResponseData = unknown>
  extends ApiResponseArgs<ResponseData> {
  ok: boolean;
}

export interface ApiResponseWithData<ResponseData = unknown>
  extends ApiResponse<ResponseData> {
  data: ResponseData;
}

const API_BASE_URL = "/api";

export const respond = <ResponseData = unknown>(
  { status = 200, data, ...rest }: ApiResponseArgs<ResponseData>,
  responseOptions?: ResponseInit
): Response =>
  new Response(
    JSON.stringify(
      {
        ok: status < 400,
        status,
        data: data ?? {},
        ...rest,
      },
      null,
      2
    ),
    {
      status,
      headers: { "Content-Type": "application/json" },
      ...responseOptions,
    }
  );

export const respondWith = (
  key: MESSAGE_KEYS,
  rest?: Omit<ApiResponseArgs, "message">
): Response => {
  const message = messages[key];
  const status = Number(key.split("_").pop());
  return respond({
    message,
    status,
    key,
    ...rest,
  });
};

export const api = async <ResponseData = unknown>(
  endpoint: string,
  options: Omit<RequestInit, "body"> & {
    body?: any;
  } = { method: "GET" },
  fetcher: (
    input: RequestInfo,
    init?: RequestInit | undefined
  ) => Promise<Response> = fetch
): Promise<ApiResponseWithData<ResponseData>> => {
  if (options.method !== "GET" && options.body) {
    options.body = JSON.stringify(options.body);
    options.headers = {
      ...options.headers,
      "Content-Type": "application/json",
    };
  }
  const response = await fetcher(`${API_BASE_URL}/${endpoint}`, options);
  const data = (await response.json()) as ApiResponseWithData<ResponseData>;
  if (data.ok) return data;
  console.error(
    `Error fetching ${endpoint}: ${data.key ? `${data.key}: ` : ""}${
      data.message
    }\n\n${data.details ? JSON.stringify(data.details, null, 2) : ""}`.trim()
  );
  if (browser) toast.error(data.message);
  throw new Error(data.message);
};
