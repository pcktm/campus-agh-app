import {
  ChakraProvider, ColorModeScript, extendTheme,
} from '@chakra-ui/react';
import '@fontsource/lato';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const themeConfig = {
  initialColorMode: 'dark',
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
  </React.StrictMode>,
);
