import {
  ChakraProvider, ColorModeScript, extendTheme,
} from '@chakra-ui/react';
import '@fontsource/lato';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import React from 'react';
import ReactDOM from 'react-dom/client';
// eslint-disable-next-line import/no-unresolved
import {registerSW} from 'virtual:pwa-register';
import App from './App.tsx';
import ErrorBoundary from './utils/ErrorBoundary.tsx';

const intervalMS = 60 * 60 * 1000;

const updateSW = registerSW({
  onRegisteredSW(swUrl, r) {
    if (r) {
      setInterval(async () => {
        if (!(!r.installing && navigator)) { return; }

        if (('connection' in navigator) && !navigator.onLine) { return; }

        const resp = await fetch(swUrl, {
          cache: 'no-store',
          headers: {
            cache: 'no-store',
            'cache-control': 'no-cache',
          },
        });

        if (resp?.status === 200) { await r.update(); }
      }, intervalMS);
    }
  },
  onNeedRefresh() {
    window.localStorage.setItem('workbox-sw-update', 'true');
  },
  immediate: true,
});

const themeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
  colors: {
    brandRed: {
      50: '#fde9ef',
      100: '#fcd4df',
      200: '#f8a9c0',
      300: '#f57da0',
      400: '#f15281',
      500: '#ee2761',
      600: '#be1f4e',
      700: '#8f173a',
      800: '#5f1027',
      900: '#300813',
    },
  },
  fonts: {
    heading: '\'Lato Bold\', sans-serif',
    body: '\'Lato\', sans-serif',
  },
};

const theme = extendTheme(themeConfig);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider
        theme={theme}
        toastOptions={{defaultOptions: {position: 'bottom'}}}
      >
        <QueryClientProvider client={queryClient}>
          <App />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ChakraProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
