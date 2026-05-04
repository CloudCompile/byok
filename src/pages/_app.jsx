import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from '../components/Layout';
import '../styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

const PUBLIC_PAGES = ['/login'];

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [authed, setAuthed] = useState(null); // null = loading

  useEffect(() => {
    const token = localStorage.getItem('byok_token');
    if (!token && !PUBLIC_PAGES.includes(router.pathname)) {
      router.replace('/login');
    } else {
      setAuthed(!!token);
    }
  }, [router.pathname]);

  if (authed === null && !PUBLIC_PAGES.includes(router.pathname)) {
    return <div className="min-h-screen bg-background" />;
  }

  if (PUBLIC_PAGES.includes(router.pathname)) {
    return (
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </QueryClientProvider>
  );
}
