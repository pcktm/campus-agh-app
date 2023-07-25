import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  ChakraProvider, ColorModeScript, extendTheme, ThemeConfig,
} from '@chakra-ui/react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import App from './App.tsx';
import '@fontsource/lato';

const themeConfig: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
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
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>,
);
