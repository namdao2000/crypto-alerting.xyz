import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        <title>Crypto Alerts</title>
        <meta
          name="description"
          content="Get alerted on crypto changes"
        />
        <link rel="icon" href="/fav.png"/>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com"/>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <meta property="image" content="/preview.png"/>
        <meta property="og:url" content="https://crypto-alerting.xyz"/>
        <meta property="og:image" content="/preview.png"/>
        <meta property="og:title" content="crypto-alerting"/>
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
        <meta
          name="twitter:image"
          content="TODO"
        ></meta>
      </Head>
      <Component
        {...pageProps}
      />
    </SessionProvider>
  );
}

export default MyApp;
