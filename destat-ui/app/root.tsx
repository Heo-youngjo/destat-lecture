import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';
import type { Route } from './+types/root';
import React from 'react';
import './app.css';
import Navigation from '~/components/navigation';

import { createModal } from '@rabby-wallet/rabbykit';
import { createConfig, http, injected } from '@wagmi/core';
import { defineChain } from 'viem';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';

export const kairos = defineChain({
  id: 1001,
  name: 'Kaia Kairos Testnet',
  nativeCurrency: { name: 'KAIA', symbol: 'KAIA', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://public-en-kairos.node.kaia.io'] },
  },
  blockExplorers: {
    default: { name: 'Kaiascan', url: 'https://kairos.kaiascan.io' },
  },
  testnet: true,
});

export const config = createConfig({
  chains: [kairos],
  connectors: [injected()],
  transports: {
    [kairos.id]: http(),
  },
});

let rabbykit: ReturnType<typeof createModal> | null = null;

export function getRabbykit() {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!rabbykit) {
    rabbykit = createModal({
      wagmi: config,
    });
  }

  return rabbykit;
}

const queryClient = new QueryClient();

/*layout을 가장 먼저 그린다. root파일에 있는 layout먼저 그린다 여기에는 어떤 컴퍼넌트를 넣어주내 app을 넣어준다.
//app에 있는 outlet은 routes파일의 export하는 순간 reactrouter framework가 가져다가 실제 파일의 내용을 가져온다.
//홈페이지에 접속하는 순간 랜더링 해야하는 페이지를 가져온다.*/

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {' '}
      {/* children 에다가app 이 리턴하는것을 넣어준다. 즉 layout이 랜더링 되고 그
      안에 자동으로app함수가 들어가게된다.*/}
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <div className="min-h-screen px-20 pt-28 pb-20">
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <Navigation />
          <Outlet />
        </QueryClientProvider>
      </WagmiProvider>
    </div>
  );
}
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
