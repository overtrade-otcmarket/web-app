import IconArrowDown from '@/assets/icons/IconArrowDown';
import IconInfo from '@/assets/icons/IconInfo';
import CustomImage from '@/components/custom/CustomImage';
import CustomInput from '@/components/custom/CustomInput';
import CustomTooltip from '@/components/custom/CustomTooltip';
import FormatPrice from '@/components/FormatPrice';
import STRKToken from '@/components/STRKToken';
import {
  numberRegexQuantity,
  ORDER_TYPE,
  STARKNET_STRK_ADDRESS,
} from '@/constant';
import { useGetListOrder } from '@/hook/queries/useGetListOrder';
import { useGetTokenPrice } from '@/hook/queries/useGetListToken';
import useShowModal from '@/hook/useShowModal';
import useStarknet from '@/hook/useStarknet';
import useStore from '@/store';
import { delay } from '@/utils';
import { toastError, toastSuccess } from '@/utils/toast';
import { useBalance } from '@starknet-react/core';
import { Button, Switch } from 'antd';
import BigNumber from 'bignumber.js';
import React, { useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { cairo } from 'starknet';

const CreateOffer = ({ typeOrder, openModalSelectToken }: any) => {
  const { createOffer } = useStarknet();
  const setShowModalConnectWallet = useStore(
    (state) => state.setShowModalConnectWallet
  );
  const setShowModalCreateOffer = useStore(
    (state) => state.setShowModalCreateOffer
  );
  const currentConnectedAccount = useStore(
    (state) => state.currentConnectedAccount
  );
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const selectedToken = useStore((state: any) => state.selectedToken);
  const [typeMatch, setTypeMatch] = useState('full');

  const [amount, setAmount] = useState<any>('');
  const [price, setPrice] = useState<any>('');
  const [timeOrder, setTimeOrder] = useState<any>('1day');

  const [loadingCreate, setLoadingCreate] = useState(false);

  const [isDC, setIsDC] = useState(false);
  const [DCValue, setDCValue] = useState(5);

  const timeOrderArray = [
    {
      id: '1day',
      title: '1 Day',
    },
    {
      id: '1week',
      title: '1 Week',
    },
    {
      id: '1month',
      title: '1 Month',
    },
    {
      id: '1year',
      title: '1 Year',
    },
  ];

  const DiscountRateArray = [
    {
      id: '5',
      title: '5%',
    },
    {
      id: '10',
      title: '10%',
    },
    {
      id: '20',
      title: '20%',
    },
    {
      id: '30',
      title: '30%',
    },
  ];

  const { refetch: refetchBuy } = useGetListOrder({
    tokenAddress: selectedToken?.contractAddress,
    page: 1,
    limit: 10,
    orderType: ORDER_TYPE.SELL,
    enabled: false,
  });

  const { refetch: refetchSell } = useGetListOrder({
    tokenAddress: selectedToken?.contractAddress,
    page: 1,
    limit: 10,
    orderType: ORDER_TYPE.BUY,
    enabled: false,
  });
  const { data: userBalanceStrk, isLoading: isLoadingBalanceSTRK } = useBalance(
    {
      address: currentConnectedAccount,
      token: STARKNET_STRK_ADDRESS,
    }
  );
  const { data: userBalanceToken, isLoading: isLoadingBalance } = useBalance({
    address: currentConnectedAccount,
    token: selectedToken?.contractAddress as any,
  });
  const balanceStrk = Number(userBalanceStrk?.formatted || 0);
  const balanceToken = Number(userBalanceToken?.formatted || 0);

  const numberRegex = /^[0-9]*\.?[0-9]*$/;

  const handleChangeAmount = async (amount: any, event: any) => {
    if (event) {
      if (numberRegex.test(amount) == false && amount) return;
      if (!Number(amount)) {
        setAmount('');
        // setToken('');
      } else setAmount(amount);
    }
  };

  const handleChangePrice = async (amount: any, event: any) => {
    if (event) {
      if (numberRegex.test(amount) == false && amount) return;
      if (!Number(amount)) {
        setPrice('');
      } else {
        setIsDC(false);
        setPrice(amount);
      }
    }
  };

  const getTimestampById = (id: any) => {
    const now = Math.floor(Date.now() / 1000);

    switch (id) {
      case '1day':
        return now + 24 * 60 * 60;
      case '1week':
        return now + 7 * 24 * 60 * 60;
      case '1month':
        const currentDate = new Date(now * 1000);
        const nextMonthDate = new Date(currentDate);
        nextMonthDate.setMonth(currentDate.getMonth() + 1);
        return Math.floor(nextMonthDate.getTime() / 1000);
      case '1year':
        const nextYearDate = new Date(now * 1000);
        nextYearDate.setFullYear(nextYearDate.getFullYear() + 1);
        return Math.floor(nextYearDate.getTime() / 1000);
      default:
        throw new Error('Invalid ID provided');
    }
  };

  const handleCreateOffer = async () => {
    try {
      if (!isAuthenticated) {
        return setShowModalConnectWallet(true);
      }
      if (
        !amount ||
        ((typeOrder == 'buy' || !isDC) && !price) ||
        !selectedToken?.contractAddress
      ) {
        return toastError('Please input amount, price and select token!');
      }
      if (
        (typeOrder == 'sell' && balanceToken < amount) ||
        (typeOrder == 'buy' && balanceStrk < amount * price)
      ) {
        return toastError('Insufficient funds!');
      }
      if (isDC && DCValue > 100) {
        return toastError('Discount Rate must lower than 100!');
      }
      setLoadingCreate(true);
      const res = await createOffer({
        tokenAddress: selectedToken?.contractAddress,
        typeOrder: typeOrder,
        typeMatch: typeMatch,
        amount: amount,
        price: price,
        expired: getTimestampById(timeOrder) as any,
        isDC: typeOrder == 'sell' ? isDC : false,
        DCValue: DCValue,
        asset_id: cairo.felt(`${selectedToken?.tokenSymbol}/USD`),
      });
      if (res) {
        await delay(5000);
        setShowModalCreateOffer(false);
        toastSuccess('Create Offer Success!');
        setAmount(null);
        setPrice(null);
        if (typeOrder == 'buy') {
          refetchBuy();
        } else {
          refetchSell();
        }
      }
    } catch (error: any) {
      toastError(error?.message);
    } finally {
      setLoadingCreate(false);
    }
  };

  const strkPrice = useStore((state: any) => state.strkPrice);

  const { data: tokenPrice } = useGetTokenPrice({
    tokenAddress: selectedToken?.contractAddress,
  });

  return (
    <div className='mt-4 flex flex-col gap-6'>
      <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-between gap-1 overflow-hidden rounded-2xl bg-white p-6 shadow-[0px_0px_16px_0px_rgba(29,23,84,0.10)]'>
          <div>
            <div className="font-['Archivo'] text-lg font-bold leading-relaxed text-[#788ad0]">
              Amount
            </div>
            <div className='mt-[0.5rem] inline-flex items-center justify-between self-stretch'>
              <NumericFormat
                decimalScale={7}
                className='!w-[100%] !bg-transparent text-3xl font-semibold outline-none'
                value={amount || 0}
                thousandSeparator
                onValueChange={(values, sourceInfo) => {
                  handleChangeAmount(values.floatValue, sourceInfo.event);
                }}
              />
            </div>
          </div>

          <div className='flex flex-col items-end justify-end gap-[10px]'>
            <div className='flex items-center gap-2 text-base font-bold text-[#788ad0]'>
              Balance: <FormatPrice number={balanceToken} />{' '}
              {selectedToken?.logo && (
                <CustomImage
                  alt='err'
                  src={selectedToken?.logo}
                  className='rounded-full'
                  width={24}
                  height={24}
                />
              )}
            </div>
            <button
              onClick={() => {
                openModalSelectToken();
              }}
              className='inline-flex h-12 w-full items-center justify-between rounded-2xl bg-white px-5 py-3 shadow-[0px_0px_16px_0px_rgba(29,23,84,0.10)]'
            >
              <div className='flex items-center justify-start gap-1.5'>
                {selectedToken?.logo && (
                  <CustomImage
                    alt='err'
                    src={selectedToken?.logo}
                    className='rounded-full'
                    width={24}
                    height={24}
                  />
                )}
                <div className="font-['Archivo'] text-base font-bold leading-normal text-[#1d1653]">
                  {selectedToken?.tokenSymbol || 'Select Token'}
                </div>
              </div>
              <IconArrowDown />
            </button>
          </div>
        </div>
        <div className='inline-flex flex-col items-start justify-end gap-2 overflow-hidden rounded-2xl bg-white p-6 shadow-[0px_0px_16px_0px_rgba(29,23,84,0.10)]'>
          <div className='flex w-full items-center justify-between'>
            <div className="font-['Archivo'] text-lg font-bold leading-relaxed text-[#788ad0]">
              Price Per Token
            </div>
            <div className='flex items-center gap-2 text-base font-bold text-[#788ad0]'>
              Market Price:{' '}
              <FormatPrice
                number={(tokenPrice?.data?.priceInUsd || 0) / strkPrice}
              />{' '}
              STRK
            </div>
          </div>
          <div className='inline-flex items-center justify-between self-stretch'>
            <NumericFormat
              decimalScale={10}
              className='!w-[100%] !bg-transparent text-3xl font-semibold outline-none'
              value={price || 0}
              thousandSeparator
              onValueChange={(values, sourceInfo) => {
                handleChangePrice(values.floatValue, sourceInfo.event);
              }}
            />
            <div className='flex flex-row items-start justify-start gap-[8px] text-primary'>
              <STRKToken width={40} height={40} />
            </div>
          </div>
          {typeOrder == 'sell' && (
            <div className='flex w-full items-center justify-between'>
              <div className="flex items-center gap-1 font-['Archivo'] text-lg font-bold leading-relaxed text-[#788ad0]">
                or{' '}
                <Switch
                  checked={isDC}
                  onChange={(checked: any) => {
                    if (checked) {
                      setIsDC(true);
                    } else {
                      setIsDC(false);
                    }
                  }}
                />{' '}
                Discount Rate:{' '}
                <CustomTooltip
                  color='#0d1255'
                  title={
                    <div className='text-center font-semibold text-white'>
                      Your order adjusts automatically to market price.
                    </div>
                  }
                >
                  <IconInfo />
                </CustomTooltip>
              </div>
              {isDC && (
                <div className='grid w-1/2 grid-cols-2 items-center gap-2 sm:grid-cols-5'>
                  {DiscountRateArray?.map((item: any, index: any) => (
                    <div
                      onClick={() => {
                        setDCValue(item?.id);
                        setPrice(
                          new BigNumber(tokenPrice?.data?.priceInUsd)
                            ?.multipliedBy(100 - item?.id)
                            ?.dividedBy(100)
                            ?.dividedBy(strkPrice)
                            ?.toNumber()
                        );
                      }}
                      key={index}
                      className={`flex cursor-pointer justify-center rounded-2xl border-[2px] bg-white px-5 py-3 text-base ${item?.id == DCValue && 'border-[#341cff]'}`}
                    >
                      {item?.title}
                    </div>
                  ))}
                  <CustomInput
                    value={DCValue}
                    placeholder='Customize'
                    className='h-full w-[80px] rounded-2xl bg-white placeholder:text-[#788ad0]'
                    onChange={(e) => {
                      if (
                        numberRegexQuantity.test(e.target.value as any) == false
                      )
                        return;
                      else {
                        setDCValue(e.target.value as any);
                        setPrice(
                          new BigNumber(tokenPrice?.data?.priceInUsd)
                            ?.multipliedBy(
                              100 -
                                Number(
                                  Number(e.target.value) > 100
                                    ? 100
                                    : e.target.value
                                )
                            )
                            ?.dividedBy(100)
                            ?.dividedBy(strkPrice)
                            ?.toNumber()
                        );
                      }
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
        <div className='inline-flex h-[118px] flex-col items-start justify-end gap-1 overflow-hidden rounded-2xl bg-white p-6 shadow-[0px_0px_16px_0px_rgba(29,23,84,0.10)]'>
          <div className="font-['Archivo'] text-lg font-bold leading-relaxed text-[#788ad0]">
            {typeOrder == 'buy' ? 'Total STRK' : `Total Deposit`}
          </div>
          <div className='inline-flex items-center justify-between self-stretch'>
            <div className="font-['Archivo'] text-3xl font-bold leading-[38px] text-[#1d1754]">
              <FormatPrice
                number={typeOrder == 'buy' ? amount * price : amount}
              />
            </div>
            <div className='flex flex-row items-start justify-start gap-[8px] text-primary'>
              {typeOrder == 'buy' ? (
                <STRKToken width={40} height={40} />
              ) : (
                selectedToken?.logo && (
                  <CustomImage
                    alt='err'
                    src={selectedToken?.logo}
                    className='rounded-full'
                    width={40}
                    height={40}
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
      <div className='flex items-center justify-between'>
        Expiry:{' '}
        <div className='grid grid-cols-2 items-center gap-2 sm:grid-cols-4'>
          {timeOrderArray?.map((item: any, index: any) => (
            <div
              onClick={() => setTimeOrder(item?.id)}
              key={index}
              className={`flex cursor-pointer justify-center rounded-2xl bg-white px-5 py-3 text-base ${item?.id == timeOrder && 'border-[2px] border-[#341cff]'}`}
            >
              {item?.title}
            </div>
          ))}
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        Match Type
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
          <div
            onClick={() => setTypeMatch('full')}
            className={`relative box-border flex w-full flex-1 cursor-pointer flex-row items-center justify-start gap-3 rounded-2xl bg-white p-3 text-left text-lg shadow-[0px_0px_16px_rgba(29,_23,_84,_0.1)] ${typeMatch == 'full' && 'border-[2px] border-solid border-blue-500'}`}
          >
            <CustomImage
              className='relative !h-[50px] w-[50px] object-cover'
              alt=''
              src='/images/full_match.webp'
              width={50}
              height={50}
            />
            <div className='flex w-[281px] flex-col items-start justify-start gap-1'>
              <b className='relative self-stretch leading-[26px]'>Full Match</b>
              <div className='relative text-base font-medium leading-[24px]'>
                Entire offer must be matched by 1 user
              </div>
            </div>
          </div>
          <div
            onClick={() => setTypeMatch('part')}
            className={`relative box-border flex w-full flex-1 cursor-pointer flex-row items-center justify-start gap-3 rounded-2xl bg-white p-3 text-left text-lg shadow-[0px_0px_16px_rgba(29,_23,_84,_0.1)] ${typeMatch == 'part' && 'border-[2px] border-solid border-blue-500'}`}
          >
            <CustomImage
              className='relative !h-[50px] w-[50px] object-cover'
              alt=''
              src='/images/partial_match.webp'
              width={50}
              height={50}
            />
            <div className='flex w-[281px] flex-col items-start justify-start gap-1'>
              <b className='relative self-stretch leading-[26px]'>
                Partial Match
              </b>
              <div className='relative text-base font-medium leading-[24px]'>
                Multiple users can contribute to the offer
              </div>
            </div>
          </div>
        </div>
      </div>
      <Button
        onClick={() => handleCreateOffer()}
        className={`${typeOrder == 'buy' ? 'btn-primary' : 'btn-secondary'} w-full`}
        loading={loadingCreate}
      >
        Create Order
      </Button>
    </div>
  );
};
export default CreateOffer;
