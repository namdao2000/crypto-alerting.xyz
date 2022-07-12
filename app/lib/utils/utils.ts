export const server = "https://cryptoalerts.coinbooks.xyz"

export const fetcher = (url) => fetch(url).then((r) => r.json());
