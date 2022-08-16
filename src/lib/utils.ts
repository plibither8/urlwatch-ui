export const json = (data: unknown, options?: ResponseInit) =>
  new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });
