export const server = process.env.SERVER

export const fetcher = (url) => fetch(url).then((r) => r.json());
