import '@/styles/globals.css';
import Layout from '@/components/layouts/Layout';
import { AppProps } from 'next/app';
import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/queryClient';
import { AppCacheProvider } from '@mui/material-nextjs/v15-pagesRouter';
import { ThemeContextProvider } from '@/contexts/ThemeContext';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { Toaster } from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { useState } from 'react';

// Dynamically import React Query Devtools to avoid chunk loading issues with Turbopack
const ReactQueryDevtools = dynamic(
  () =>
    import('@tanstack/react-query-devtools').then(
      (mod) => mod.ReactQueryDevtools
    ),
  { ssr: false }
);

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const [queryClient] = useState(() => getQueryClient());

  return (
    <ErrorBoundary>
      <AppCacheProvider {...props}>
        <ThemeContextProvider>
          <QueryClientProvider client={queryClient}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
            <Toaster
              position="top-center"
              reverseOrder={false}
              gutter={8}
              toastOptions={{
                duration: 3000,
                className: 'toast-notification',
              }}
            />
            {process.env.NODE_ENV !== 'production' && (
              <ReactQueryDevtools initialIsOpen={false} />
            )}
          </QueryClientProvider>
        </ThemeContextProvider>
      </AppCacheProvider>
    </ErrorBoundary>
  );
}
