'use client';

import React, { useEffect, useState } from 'react';
import useMounted from '@/hook/useMounted';
import LayoutPrimary from './LayoutPrimary';
import Loading from '@/app/loading';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import StarknetProvider from '@/contexts/StarknetProvider';
import Header from './header';
import useScaleLayout from '@/hook/useScaleLayout';
import useStore from '@/store';
import ModalSuccess from '@/components/modal/ModalSuccess';
import { usePathname, useRouter } from 'next/navigation';
import ModalConnectWallet from '@/components/modal/ModalConnectWallet';
import ModalSelectToken from '@/components/modal/ModalSelectToken';
import MarqueeRun from '@/components/marquee';

const Layout = ({ children }: any) => {
  const { isMounted } = useMounted();
  useScaleLayout();
  const showModalConnectWallet = useStore(
    (state) => state.showModalConnectWallet
  );
  const setShowModalConnectWallet = useStore(
    (state) => state.setShowModalConnectWallet
  );
  const showModalSuccess = useStore((state) => state.showModalSuccess);
  const setShowModalSuccess = useStore((state) => state.setShowModalSuccess);
  const setSelectedToken = useStore((state) => state.setSelectedToken);
  const showModalSelectToken = useStore((state) => state.showModalSelectToken);
  const setShowModalSelectToken = useStore(
    (state: any) => state.setShowModalSelectToken
  );

  const pathname = usePathname();

  const [queryClient] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          staleTime: 15000,
          retry: 0,
        },
      },
    })
  );

  return (
    <>
      <QueryClientProvider client={queryClient}>
        {!isMounted && <Loading />}
        <LayoutPrimary>
          <StarknetProvider>
            <div
              className={`mx-auto flex min-h-[var(--100vh)] w-full flex-col items-center bg-[#D6E1FF] ${!pathname?.includes('/token/') && 'pb-10'} text-primary`}
            >
              <MarqueeRun />
              <Header />
              {children}
              <ModalSelectToken
                open={showModalSelectToken}
                onCancel={() => {
                  setShowModalSelectToken(false);
                }}
                setSelectedToken={setSelectedToken}
              />
              <ModalSuccess
                open={showModalSuccess}
                onCancel={() => setShowModalSuccess(false)}
              />
              <ModalConnectWallet
                open={showModalConnectWallet}
                onCancel={() => setShowModalConnectWallet(false)}
              />
            </div>
          </StarknetProvider>
        </LayoutPrimary>
      </QueryClientProvider>
    </>
  );
};

export default Layout;
