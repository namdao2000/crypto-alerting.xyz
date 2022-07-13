export const server = process.env.NEXT_PUBLIC_SERVER;

export const fetcher = (url) => fetch(url).then((r) => r.json());
