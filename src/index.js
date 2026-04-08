import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink
} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';

import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

import theme from './theme.js';
import { ChakraProvider } from '@chakra-ui/react';

Sentry.init({
  dsn: 'https://83743324e3cf4ba4aae102ad42cc3a76@o53943.ingest.sentry.io/4504050684592128',
  integrations: [new BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

const httpLink = createHttpLink({
  uri: import.meta.env.DEV
    ? 'http://localhost:4000'
    : import.meta.env.VITE_GQL_SERVER
});

const authLink = setContext((_, {headers}) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  name: 'web-client',
  version: '0.9'
});

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </ChakraProvider>,
  document.getElementById('root')
);
