import IconLoading from '@/assets/icons/IconLoading';
import IconSearch from '@/assets/icons/IconSearch';
import CustomButton from '@/components/custom/CustomButton';
import CustomImage from '@/components/custom/CustomImage';
import CustomInput from '@/components/custom/CustomInput';
import ModalConnectWallet from '@/components/modal/ModalConnectWallet';
import NoData from '@/components/NoData';
import STRKToken from '@/components/STRKToken';
import { DEFAULT_IMAGE, STARKNET_STRK_ADDRESS } from '@/constant';
import { useGetTokenPrice } from '@/hook/queries/useGetListToken';
import { useImportToken, useQuoteToken } from '@/hook/queries/useQuoteToken';
import useApplication from '@/hook/useApplication';
import useClickOutSide from '@/hook/useClickOutSide';
import useDebounce from '@/hook/useDebounce';
import useStore from '@/store';
import { formatWallet } from '@/utils';
import { useDisconnect, useProvider } from '@starknet-react/core';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Contract } from 'starknet';

const Header = () => {
  const showModalConnectWallet = useStore(
    (state) => state.showModalConnectWallet
  );
  const setShowModalConnectWallet = useStore(
    (state) => state.setShowModalConnectWallet
  );
  const [isShowSearch, setIsShowSearch] = React.useState(false);
  const [showMenu, setShowMenu] = React.useState(false);
  const router = useRouter();
  const { ref } = useClickOutSide({
    action: () => {
      setShowMenu(false);
    },
  });

  const { ref: searchRef } = useClickOutSide({
    action: () => {
      setIsShowSearch(false);
    },
  });

  const isAuthenticated = useStore((state) => state.isAuthenticated);

  const currentConnectedAccount = useStore(
    (state) => state.currentConnectedAccount
  );

  const { handleLogout } = useApplication();

  const MENU_LIST = [
    {
      key: 'trade',
      title: 'Trade',
      link: '/',
    },
    {
      key: 'explore',
      title: 'Explore',
      link: '/explore',
    },
    // {
    //   key: 'dashboard',
    //   title: 'Dashboard',
    //   link: '/dashboard',
    // },
  ];

  const setStrkPrice = useStore((state: any) => state.setStrkPrice);
  const [searchValue, setSearchValue] = React.useState();
  const [loadingToken, setLoadingToken] = React.useState();
  const setSelectedToken = useStore((state) => state.setSelectedToken);

  const { data: strkPrice } = useGetTokenPrice({
    tokenAddress: STARKNET_STRK_ADDRESS,
  });

  useEffect(() => {
    strkPrice?.data?.priceInUsd && setStrkPrice(strkPrice?.data?.priceInUsd);
  }, [strkPrice]);

  const {
    isLoading: loadingQuoteToken,
    data: quoteTokenList,
    refetch: refetchQuoteTokenList,
  } = useQuoteToken({
    open: isShowSearch,
    search: searchValue,
  });
  const { mutateAsync, isPending } = useImportToken();

  const handleSelectToken = async (item: any) => {
    if (item?.available) {
      setSelectedToken(item);
      setIsShowSearch(false);
      router.push(`/token/${item?.contractAddress}`);
    }
  };

  const handleAddToken = async (item: any) => {
    setLoadingToken(item?.contractAddress);
    await mutateAsync(item?.contractAddress);
    refetchQuoteTokenList();
  };

  const debounceSearch = useDebounce(async (value: any) => {
    setSearchValue(value);
  }, 300);

  const handleSearchToken = async (e: any) => {
    setIsShowSearch(true);
    debounceSearch(e.target.value);
  };

  return (
    <div className='sticky top-0 z-[5] h-[75px] w-full bg-primary px-6 py-3'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-[40px]'>
          <button
            onClick={() => {
              router.push('/');
            }}
            className='flex items-center gap-1 text-base font-extrabold text-white'
          >
            <CustomImage
              width={47.74}
              height={38.5}
              alt=''
              src={DEFAULT_IMAGE}
            />
            OVERTRADE
          </button>

          <div className='flex items-center max-lg:hidden'>
            {MENU_LIST.map((item) => (
              <button
                onClick={() => {
                  router.push(item.link);
                }}
                key={item?.key}
                className='px-[20px] font-bold text-white'
              >
                {item?.title}
              </button>
            ))}
          </div>
        </div>

        <CustomInput
          onChange={handleSearchToken}
          onFocus={() => {
            setIsShowSearch(true);
            if (!searchValue) {
              return;
            }
          }}
          placeholder='Search'
          prefix={<IconSearch />}
          className='header-search-input w-[407px] gap-[10px] rounded-[32px] border-none !bg-[rgba(0,0,0,0.20)] py-[12px] !text-white max-lg:hidden'
        />

        {isShowSearch && (
          <div
            ref={searchRef}
            className='fixed left-1/2 top-[5rem] inline-flex h-[400px] w-[532px] -translate-x-1/2 flex-col items-start justify-start gap-[20px] rounded-3xl bg-[#f2f6ff] p-4 shadow-2xl'
          >
            <div className='w-full overflow-y-auto'>
              {loadingQuoteToken && (
                <IconLoading className='m-auto mt-32 animate-spin' />
              )}
              {quoteTokenList?.data?.rows?.length > 0
                ? quoteTokenList?.data?.rows?.map((item: any) => (
                    <button
                      onClick={() => {
                        handleSelectToken(item);
                      }}
                      key={item?.id}
                      className='flex h-[72px] w-full items-center justify-between gap-1 rounded-2xl px-5 py-3 transition-all hover:!bg-white hover:shadow-[0px_0px_16px_0px_rgba(29,23,84,0.10)]'
                    >
                      <div className='inline-flex items-center justify-start gap-1.5'>
                        <CustomImage
                          alt='err'
                          src={item?.logo}
                          className='rounded-full'
                          width={48}
                          height={48}
                        />
                        <div className='inline-flex flex-col items-start justify-center'>
                          <div className='inline-flex items-start justify-start gap-2'>
                            <div className="font-['Archivo'] text-base font-bold leading-normal text-[#1d1754]">
                              {item?.tokenName}
                            </div>
                            <div className="font-['Archivo'] text-base font-medium leading-normal text-[#788ad0]">
                              {item?.tokenSymbol}
                            </div>
                          </div>
                          <div className="font-['Archivo'] text-base font-medium leading-normal text-[#788ad0]">
                            {formatWallet(item?.contractAddress)}
                          </div>
                        </div>
                      </div>
                      {!item?.available && (
                        <CustomButton
                          onClick={() => {
                            handleAddToken(item);
                          }}
                          loading={
                            isPending && loadingToken === item?.contractAddress
                          }
                        >
                          Add
                        </CustomButton>
                      )}
                    </button>
                  ))
                : !loadingQuoteToken && <NoData />}
            </div>
          </div>
        )}

        <div className='flex items-center gap-2'>
          <div className='relative box-border flex w-full flex-row items-center justify-start gap-2.5 rounded-[32px] bg-gray px-5 py-3 text-left text-[16px] text-white max-sm:hidden'>
            <STRKToken />
            <div className='relative font-semibold leading-[24px]'>
              Starknet
            </div>
          </div>
          {isAuthenticated ? (
            <>
              <Button
                onClick={() => {
                  setShowMenu(!showMenu);
                }}
                className='btn-primary !bg-gray'
              >
                {formatWallet(currentConnectedAccount)}
              </Button>
              {showMenu && (
                <div
                  ref={ref}
                  className='fixed right-[1rem] top-[5rem] inline-flex h-[114px] w-[145px] flex-col items-start justify-start gap-1.5 rounded-2xl bg-white p-1.5 shadow-[0px_0px_16px_0px_rgba(29,23,84,0.10)]'
                >
                  <button
                    onClick={() => {
                      router.push('/my-profile');
                      setShowMenu(false);
                    }}
                    className='inline-flex items-center justify-start gap-1.5 self-stretch rounded-2xl p-3 hover:bg-[#f2f6ff]'
                  >
                    <div className="font-['Archivo'] text-base font-bold leading-normal text-[#1d1653]">
                      My Profile
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowMenu(false);
                    }}
                    className='inline-flex items-center justify-start gap-1.5 self-stretch rounded-2xl bg-white p-3 hover:bg-[#f2f6ff]'
                  >
                    <div className="font-['Archivo'] text-base font-bold leading-normal text-[#e24e59]">
                      Disconnect
                    </div>
                  </button>
                </div>
              )}
            </>
          ) : (
            <Button
              onClick={() => setShowModalConnectWallet(true)}
              className='btn-secondary'
            >
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
