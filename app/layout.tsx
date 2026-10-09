import Head from "next/head";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <Head>
        <title>doodley</title>
        <meta
          name="viewport"
          content="width=device-width, minimum-scale=1.0, initial-scale=1.0"
        />
      </Head>
      <body>{children}</body>
    </html>
  );
}
