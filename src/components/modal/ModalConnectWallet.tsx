import React, { useEffect } from 'react';
import CustomModal from '../custom/CustomModal';
import CustomImage from '@/components/custom/CustomImage';
import { toastError } from '@/utils/toast';
import {
  Connector,
  useAccount,
  useConnect,
  useDisconnect,
  useSignTypedData,
} from '@starknet-react/core';
import useStore from '@/store';
import { formatStarknet } from '@/utils';
import { getData, saveData } from '@/utils/localStorage';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constant';
import { ArraySignatureType, typedData, TypedData } from 'starknet';
import { loginApi } from '@/service/connect';
import { jwtDecode } from 'jwt-decode';
import useMounted from '@/hook/useMounted';

const ModalConnectWallet = ({ open, onCancel }: any) => {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();
  const { isMounted } = useMounted();

  const setIsAuthenticated = useStore((state) => state.setIsAuthenticated);
  const currentConnectedAccount = useStore(
    (state) => state.currentConnectedAccount
  );
  const setToken = useStore((state) => state.setToken);
  const setCurrentConnectedAccount = useStore(
    (state) => state.setCurrentConnectedAccount
  );

  const signData = {
    types: {
      StarkNetDomain: [
        { name: 'name', type: 'felt' },
        { name: 'version', type: 'felt' },
        { name: 'chainId', type: 'felt' },
      ],
      Validate: [
        { name: 'signer', type: 'felt' },
        { name: 'expire', type: 'string' },
      ],
    },
    primaryType: 'Validate',
    domain: {
      name: 'Overtrade',
      version: '1',
      chainId: 'SN_MAIN',
    },
    message: {
      signer: formatStarknet(address),
      expire: Date.now() + 1000 * 60 * 5,
    },
  };

  const { signTypedDataAsync } = useSignTypedData({ primaryType: 'Validate' });

  const handleSign = async () => {
    const typedDataValidate: TypedData = signData;
    const msgHash = typedData.getMessageHash(
      typedDataValidate,
      formatStarknet(address) as any
    );
    const arraySignature = (await signTypedDataAsync(
      typedDataValidate
    )) as ArraySignatureType;
    let signatureS = '';
    return [arraySignature, signatureS, msgHash];
  };

  useEffect(() => {
    if (!isMounted) return;
    const login = async () => {
      const accessToken = getData(ACCESS_TOKEN);
      const refreshToken = getData(REFRESH_TOKEN);
      const decodedData: any = accessToken
        ? jwtDecode(accessToken as string)
        : {};
      if (
        (!accessToken && !refreshToken) ||
        (accessToken && decodedData?.walletAddress !== currentConnectedAccount)
      ) {
        try {
          let signResponse;
          signResponse = await handleSign();
          const res = await loginApi({
            walletAddress: formatStarknet(address),
            signData: signData,
            signature: signResponse[0],
          });
          if (res?.data?.accessToken) {
            setToken(res.data.accessToken);
            saveData(ACCESS_TOKEN, res.data.accessToken);
            saveData(REFRESH_TOKEN, res.data.refreshToken);
            setIsAuthenticated(true);
            onCancel();
          }
        } catch (error: any) {
          toastError(error?.message || error || 'Something went wrong!');
          setIsAuthenticated(false);
          disconnect();
        }
      } else {
        setToken(accessToken as string);
        setIsAuthenticated(true);
        onCancel();
      }
    };

    if (currentConnectedAccount) {
      login();
    }
  }, [currentConnectedAccount, isMounted]);

  const handleLoginStarknet = (connector: Connector) => {
    try {
      if (connector.available()) {
        connect({ connector });
        onCancel();
      }
    } catch (error: any) {
      toastError(error.message || error.toString() || 'Something went wrong!');
    }
  };

  const handleLogin = async (wallet: any) => {
    let url = '' as any;
    switch (wallet) {
      case 'braavos':
        url =
          'https://chromewebstore.google.com/detail/braavos-starknet-wallet/jnlgamecbpmbajjfhmmmlhejkemejdma';
        break;
      case 'argentX':
        url =
          'https://chromewebstore.google.com/detail/argent-x-starknet-wallet/dlcobpjiigpikoobohmabehhmhfoodbb';
        break;
      case 'okx':
        url =
          'https://chromewebstore.google.com/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge';
        break;
      default:
        break;
    }
    const connector = connectors.find((item: any) => item.id === wallet);
    if (!connector) {
      toastError('This wallet is not installed!');
      window.open(url, '_blank');
    }
    if (connector) handleLoginStarknet(connector);
  };

  useEffect(() => {
    if (address) {
      setIsAuthenticated(true);
      setCurrentConnectedAccount(formatStarknet(address));
    }
  }, [address]);

  return (
    <CustomModal open={open} onCancel={onCancel} width={568}>
      <div className='rounded-xl p-[40px]'>
        <CustomImage
          src='/images/connect.png'
          alt='err'
          width={540}
          height={120}
          className='mb-6'
        />
        <div className='grid grid-cols-3 gap-4'>
          <div
            className='flex cursor-pointer flex-col items-center rounded-2xl bg-white py-3 text-[16px] font-[400]'
            onClick={() => {
              handleLogin('argentX');
            }}
          >
            <CustomImage
              src='/images/wallet/argenx.png'
              alt='err'
              width={56}
              height={56}
              className='mb-[12px] rounded-full'
            />
            Argent X
          </div>
          <div
            className='flex cursor-pointer flex-col items-center rounded-2xl bg-white py-3 text-[16px] font-[400]'
            onClick={() => {
              handleLogin('braavos');
            }}
          >
            <CustomImage
              src='/images/wallet/bravos.png'
              alt='err'
              width={56}
              height={56}
              className='mb-[12px] rounded-full'
            />
            Braavos
          </div>
          <div
            className='flex cursor-pointer flex-col items-center rounded-2xl bg-white py-3 text-[16px] font-[400]'
            onClick={() => {
              handleLogin('okxwallet');
            }}
          >
            <CustomImage
              src='/images/wallet/okx.png'
              alt='err'
              width={56}
              height={56}
              className='mb-[12px] rounded-full'
            />
            OKX
          </div>
          {/* <div
            className='text-center cursor-pointer text-[16px] font-[400]'
            onClick={() => {
              handleLogin('metamask');
            }}
          >
            <CustomImage
              src='/images/wallet/okx.png'
              alt='err'
              width={56}
              height={56}
              className='mb-[12px] rounded-full'
            />
            Metamask
          </div> */}
        </div>
      </div>
    </CustomModal>
  );
};

export default ModalConnectWallet;
