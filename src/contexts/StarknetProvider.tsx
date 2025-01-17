'use client';

import { mainnet } from '@starknet-react/chains';
import {
  argent,
  braavos,
  InjectedConnector,
  jsonRpcProvider,
  StarknetConfig,
  useInjectedConnectors,
  voyager,
} from '@starknet-react/core';
import React, { ReactNode } from 'react';

interface IStarknetNetworkProps {
  children: ReactNode;
}
const StarknetProvider = ({ children }: IStarknetNetworkProps) => {
  const { connectors } = useInjectedConnectors({
    recommended: [
      argent(),
      braavos(),
      new InjectedConnector({ options: { id: 'okxwallet', name: 'OKX' } }),
    ],
    includeRecommended: 'onlyIfNoConnectors',
    order: 'random',
  });
  return (
    <StarknetConfig
      connectors={connectors}
      autoConnect
      chains={[mainnet]}
      provider={jsonRpcProvider({
        rpc: () => ({
          nodeUrl: 'https://starknet-mainnet.public.blastapi.io/rpc/v0_7',
        }),
      })}
      explorer={voyager}
    >
      {children}
    </StarknetConfig>
  );
};

export default StarknetProvider;
