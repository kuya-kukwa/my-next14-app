import "@/styles/globals.css";
import Layout from "@/components/layouts/Layout";
import { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
      <Layout>
        <Component {...pageProps} />
      </Layout>
  );
}