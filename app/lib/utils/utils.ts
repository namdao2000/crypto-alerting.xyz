export const server = process.env.NEXT_PUBLIC_SERVER || 'https://cryptoalerts.coinbooks.xyz';

export const fetcher = (url) => fetch(url).then((r) => r.json());
