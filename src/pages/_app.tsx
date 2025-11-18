import "@/styles/globals.css";
import Layout from "@/components/layouts/Layout";
import { AppProps } from "next/app";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/queryClient";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AppCacheProvider } from '@mui/material-nextjs/v15-pagesRouter';
import { ThemeContextProvider } from "@/contexts/ThemeContext";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const queryClient = getQueryClient();
  return (
    <AppCacheProvider {...props}>
      <ThemeContextProvider>
        <QueryClientProvider client={queryClient}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
          {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      </ThemeContextProvider>
    </AppCacheProvider>
  );
}