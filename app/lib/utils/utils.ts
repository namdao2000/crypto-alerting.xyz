export const server = process.env.SERVER || 'http://localhost:3000';

export const fetcher = (url) => fetch(url).then((r) => r.json());
