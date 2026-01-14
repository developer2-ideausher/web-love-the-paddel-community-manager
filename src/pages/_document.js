import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
         <link rel="preload" as="image" href="/images/login_bg.webp" />
      </Head>
      <body className="bg-main font-helvetica-neue" id="ltp-container">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
