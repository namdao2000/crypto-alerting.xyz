export const server = process.env.server || 'http://localhost:3000';

export const fetcher = (url) => fetch(url).then((r) => r.json());
