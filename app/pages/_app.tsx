import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CssBaseline, GeistProvider } from '@geist-ui/core';
import { usePostHog } from 'next-use-posthog';

function MyApp({ Component, pageProps }: AppProps) {
  usePostHog('phc_6OdVkZmfdrezipJVP02tKehEiM5zVef3dvNmmzr5CMZ', {
    api_host: 'https://app.posthog.com',
  });

  return (
    <SessionProvider session={pageProps.session}>
      <GeistProvider>
        <Head>
          <title>Crypto Alerts</title>
          <meta name="description" content="Get alerted on crypto changes" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap"
            rel="stylesheet"
          />
          <meta property="image" content="/preview.png" />
          <meta property="og:url" content="https://crypto-alerting.xyz" />
          <meta property="og:image" content="/preview.png" />
          <meta property="og:title" content="crypto-alerting" />
          <meta
            property="og:description"
            content="Get alerted on crypto changes"
          />

          <meta name="twitter:card" content="summary"></meta>
          <meta name="twitter:site" content="@crypto-alerting-xyz"></meta>
          <meta name="twitter:title" content="crypto-alerting"></meta>
          <meta
            name="twitter:description"
            content="Get alerted on crypto changes"
          ></meta>
          <meta name="twitter:image" content="TODO"></meta>
        </Head>
        <CssBaseline />
        <Component {...pageProps} />
      </GeistProvider>
    </SessionProvider>
  );
}

export default MyApp;
