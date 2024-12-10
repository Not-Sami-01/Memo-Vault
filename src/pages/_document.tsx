import Footer from '@/components/Other/Footer';
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>MemoVault - Best place to store your memories</title>
        <link rel="shortcut icon" href="/images/memovault-favicon.png" type="image/x-icon" />
      </Head>
      <body className='bg-white dark:bg-black dark:text-white' id='body'>
        <Main />
        <NextScript />
        <Footer />
      </body>
    </Html>
  );
}
