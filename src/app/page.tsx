'use client';

import IconArrowDown from '@/assets/icons/IconArrowDown';
import IconClose from '@/assets/icons/IconClose';
import IconExplore from '@/assets/icons/IconExplore';
import IconSend from '@/assets/icons/IconSend';
import CustomButton from '@/components/custom/CustomButton';
import CustomImage from '@/components/custom/CustomImage';
import CustomInput from '@/components/custom/CustomInput';
import CustomSelect from '@/components/custom/CustomSelect';
import FormatPrice from '@/components/FormatPrice';
import ModalTradeToken from '@/components/modal/ModalTradeToken';
import STRKToken from '@/components/STRKToken';
import TableTrade from '@/components/table/TableTrade';
import {
  ORDER_MATCH_TYPE,
  ORDER_TYPE,
  PRICE_TYPE,
  STARKNET_STRK_ADDRESS,
} from '@/constant';
import CreateOffer from '@/containers/home/createOffer';
import { useGetListOrder } from '@/hook/queries/useGetListOrder';
import { useGetTokenPrice } from '@/hook/queries/useGetListToken';
import useStarknet from '@/hook/useStarknet';
import useStore from '@/store';
import { delay, formatBalance } from '@/utils';
import { toastError, toastSuccess } from '@/utils/toast';
import { Button } from 'antd';
import React, { useState } from 'react';

const Home = () => {
  const orderDetail = useStore((state) => state.orderDetail);
  const setOrderDetail = useStore((state) => state.setOrderDetail);
  const selectedToken = useStore((state: any) => state.selectedToken);

  const currentConnectedAccount = useStore(
    (state) => state.currentConnectedAccount
  );
  const [paramSearch, setParamSearch] = useState({
    page: 1,
    limit: 10,
    sortField: 'price',
    orderBy: 'DESC',
  } as any);
  const [loadingCancel, setLoadingCancel] = useState<any>(false);

  const [type, setType] = useState('match');
  const [typeOrder, setTypeOrder] = useState('buy');

  const [showChatBox, setShowChatBox] = useState(false);

  const showModalTradeToken = useStore((state) => state.showModalTradeToken);
  const setShowModalTradeToken = useStore(
    (state) => state.setShowModalTradeToken
  );
  const strkPrice = useStore((state: any) => state.strkPrice);

  const tradeColumnBuy = [
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (value: any, record: any, index: any) => (
        <div className='flex gap-2 font-semibold text-primary'>
          <STRKToken />
          <FormatPrice
            number={formatBalance(
              record?.priceType == PRICE_TYPE.FIXED ? value : value / strkPrice
            )}
          />{' '}
          STRK
        </div>
      ),
    },
    {
      title: 'Available Amount',
      dataIndex: 'remainAmount',
      key: 'remainAmount',
      render: (value: any, record: any, index: any) => (
        <div className='flex gap-2 font-semibold text-primary'>
          <CustomImage
            width={24}
            height={24}
            src={record?.token0Logo}
            alt='otc'
            className='rounded-full'
          />
          <FormatPrice number={formatBalance(value)} />
          {record?.symbol}
        </div>
      ),
    },
    {
      title: 'Match Type',
      dataIndex: 'matchType',
      key: 'matchType',
      render: (value: any, record: any, index: any) => (
        <div>{ORDER_MATCH_TYPE[value]}</div>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (value: any, record: any, index: any) =>
        currentConnectedAccount != record?.orderCreator ? (
          <Button
            onClick={() => {
              setOrderDetail(record);
              setShowModalTradeToken(true);
            }}
            className='btn-primary !h-[36px] !rounded-lg'
          >
            Buy
          </Button>
        ) : (
          <Button
            loading={loadingCancel && record?.orderId == orderDetail?.orderId}
            onClick={() => {
              setOrderDetail(record);
              handleCancelOffer({
                tokenAddress: record?.token0Address,
                offerId: Number(record?.orderId),
                type: 'buy',
              });
            }}
            className='btn-white !h-[36px] !rounded-lg'
          >
            Cancel
          </Button>
        ),
    },
  ];

  const tradeColumnSell = [
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (value: any, record: any, index: any) => (
        <div className='flex gap-2 font-semibold text-primary'>
          <STRKToken />
          <FormatPrice
            number={formatBalance(
              record?.priceType == PRICE_TYPE.FIXED ? value : value / strkPrice
            )}
          />
          STRK
        </div>
      ),
    },
    {
      title: 'Available Amount',
      dataIndex: 'remainAmount',
      key: 'remainAmount',
      render: (value: any, record: any, index: any) => (
        <div className='flex gap-2 font-semibold text-primary'>
          <CustomImage
            width={24}
            height={24}
            src={record?.token0Logo}
            alt='otc'
            className='rounded-full'
          />
          <FormatPrice number={formatBalance(value)} />
          {record?.symbol}
        </div>
      ),
    },
    {
      title: 'Match Type',
      dataIndex: 'matchType',
      key: 'matchType',
      render: (value: any, record: any, index: any) => (
        <div>{ORDER_MATCH_TYPE[value]}</div>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (value: any, record: any, index: any) =>
        currentConnectedAccount != record?.orderCreator ? (
          <Button
            onClick={() => {
              setOrderDetail(record);
              setShowModalTradeToken(true);
            }}
            className='btn-secondary !h-[36px] !rounded-lg'
          >
            Sell
          </Button>
        ) : (
          <Button
            loading={loadingCancel && record?.orderId == orderDetail?.orderId}
            onClick={() => {
              setOrderDetail(record);
              handleCancelOffer({
                tokenAddress: record?.token0Address,
                offerId: Number(record?.orderId),
                type: 'sell',
              });
            }}
            className='btn-white !h-[36px] !rounded-lg'
          >
            Cancel
          </Button>
        ),
    },
  ];

  const [paginationBuy, setPaginationBuy] = useState({
    page: 1,
    limit: 10,
  });

  const [paginationSell, setPaginationSell] = useState({
    page: 1,
    limit: 10,
  });
  const { cancelOffer } = useStarknet();
  const onChangePaginationBuy = (page: number, pageSize: number) => {
    setPaginationBuy({
      ...paginationBuy,
      page: page,
    });
  };

  const onChangePaginationSell = (page: number, pageSize: number) => {
    setPaginationSell({
      ...paginationSell,
      page: page,
    });
  };
  const setShowModalSelectToken = useStore(
    (state: any) => state.setShowModalSelectToken
  );
  const {
    data: listBuyOrderData,
    isLoading: isLoadingBuy,
    refetch: refetchBuy,
  } = useGetListOrder({
    tokenAddress: selectedToken?.contractAddress,
    ...paginationBuy,
    ...paramSearch,
    orderType: ORDER_TYPE.SELL,
    enabled: !!selectedToken?.contractAddress && type == 'match',
  });

  const {
    data: listSellOrderData,
    isLoading: isLoadingSell,
    refetch: refetchSell,
  } = useGetListOrder({
    tokenAddress: selectedToken?.contractAddress,
    ...paginationBuy,
    ...paramSearch,
    orderType: ORDER_TYPE.BUY,
    enabled: !!selectedToken?.contractAddress && type == 'match',
  });

  const handleCancelOffer = async (params: any) => {
    try {
      setLoadingCancel(true);
      const res = await cancelOffer(params);
      if (res) {
        await delay(5000);
        toastSuccess('Cancel Offer Success!');
        if (params?.type == 'buy') {
          await refetchBuy();
        } else {
          refetchSell();
        }
      }
    } catch (error: any) {
      toastError(error?.message);
    } finally {
      setLoadingCancel(false);
    }
  };

  return (
    <div className='w-full px-4 py-6 lg:w-1/2'>
      <div className='hidden'>
        {showChatBox ? (
          <div className='fixed bottom-[40px] right-[56px] z-10'>
            <div className='inline-flex h-[643px] w-[450px] flex-col items-start justify-start overflow-hidden rounded-2xl shadow-[0px_0px_16px_0px_rgba(29,23,84,0.10)]'>
              <div className='inline-flex items-start justify-between self-stretch bg-primary p-4'>
                <div className='flex items-center gap-2'>
                  <CustomImage
                    width={44}
                    height={44}
                    src='/images/bonk.webp'
                    alt='otc'
                  />
                  <div className='inline-flex w-40 flex-col items-start justify-start gap-0.5'>
                    <div className="self-stretch font-['Archivo'] text-base font-bold leading-normal text-white">
                      Stacey
                    </div>
                    <div className="font-['Archivo'] text-sm font-medium leading-tight text-white">
                      Your Assistant
                    </div>
                  </div>
                </div>

                <IconClose
                  className='cursor-pointer'
                  onClick={() => setShowChatBox(false)}
                />
              </div>

              <div className='flex shrink grow basis-0 flex-col items-start justify-start gap-4 self-stretch bg-[#f2f6ff] p-4'>
                <div className='inline-flex items-start justify-start gap-2 self-stretch'>
                  <div className='flex items-start justify-start gap-2'>
                    <CustomImage
                      width={30}
                      height={30}
                      src='/images/bonk.webp'
                      alt='otc'
                    />
                  </div>
                  <div className='inline-flex w-[298px] flex-col items-start justify-start gap-2'>
                    <div className="self-stretch font-['Archivo'] text-sm font-bold leading-tight text-[#341cff]">
                      Stacey
                    </div>
                    <div className='inline-flex items-start justify-start gap-2.5 self-stretch rounded-2xl bg-white px-3 py-1.5 shadow-[0px_0px_16px_0px_rgba(29,23,84,0.10)]'>
                      <div className="shrink grow basis-0 font-['Archivo'] text-sm font-medium leading-tight text-[#1d1754]">
                        Well, {"that's"} an interesting thing to say. You like
                        the way I smell?
                      </div>
                    </div>
                  </div>
                </div>
                <div className='inline-flex items-start justify-end gap-2 self-stretch'>
                  <div className='inline-flex w-[298px] flex-col items-end justify-center gap-2'>
                    <div className="self-stretch text-right font-['Archivo'] text-sm font-bold leading-tight text-[#e24e59]">
                      You
                    </div>
                    <div className='inline-flex items-start justify-start gap-2.5 self-stretch rounded-2xl bg-white px-3 py-1.5 shadow-[0px_0px_16px_0px_rgba(29,23,84,0.10)]'>
                      <div className="shrink grow basis-0 font-['Archivo'] text-sm font-medium leading-tight text-[#1d1754]">
                        Why not finish your sentence?
                      </div>
                    </div>
                  </div>
                  <div className='flex items-start justify-start gap-2'>
                    <CustomImage
                      width={30}
                      height={30}
                      src='/images/bonk.webp'
                      alt='otc'
                    />
                  </div>
                </div>
                <div className='inline-flex items-start justify-start gap-2 self-stretch'>
                  <div className='flex items-start justify-start gap-2'>
                    <CustomImage
                      width={30}
                      height={30}
                      src='/images/bonk.webp'
                      alt='otc'
                    />
                  </div>
                  <div className='inline-flex w-[298px] flex-col items-start justify-start gap-2'>
                    <div className="self-stretch font-['Archivo'] text-sm font-bold leading-tight text-[#341cff]">
                      Stacey
                    </div>
                    <div className='inline-flex items-start justify-start gap-2.5 self-stretch rounded-2xl bg-white px-3 py-1.5 shadow-[0px_0px_16px_0px_rgba(29,23,84,0.10)]'>
                      <div className="shrink grow basis-0 font-['Archivo'] text-sm font-medium leading-tight text-[#1d1754]">
                        You smell... sniff nice! {"Let's"} hunt.
                      </div>
                    </div>
                  </div>
                </div>
                <div className='inline-flex items-start justify-end gap-2 self-stretch'>
                  <div className='inline-flex w-[298px] flex-col items-end justify-center gap-2'>
                    <div className="self-stretch text-right font-['Archivo'] text-sm font-bold leading-tight text-[#e24e59]">
                      You
                    </div>
                    <div className='inline-flex items-start justify-start gap-2.5 self-stretch rounded-2xl bg-white px-3 py-1.5 shadow-[0px_0px_16px_0px_rgba(29,23,84,0.10)]'>
                      <div className="shrink grow basis-0 font-['Archivo'] text-sm font-medium leading-tight text-[#1d1754]">
                        I {"didn't"} say that... I just{" wasn't"} prepared.{' '}
                        {"You're"}
                        pretty forward, you know that?
                      </div>
                    </div>
                  </div>
                  <div className='flex items-start justify-start gap-2'>
                    <CustomImage
                      width={30}
                      height={30}
                      src='/images/bonk.webp'
                      alt='otc'
                    />
                  </div>
                </div>
                <div className='inline-flex items-start justify-start gap-2 self-stretch'>
                  <div className='flex items-start justify-start gap-2'>
                    <CustomImage
                      width={30}
                      height={30}
                      src='/images/bonk.webp'
                      alt='otc'
                    />
                  </div>
                  <div className='inline-flex w-[298px] flex-col items-start justify-start gap-2'>
                    <div className="self-stretch font-['Archivo'] text-sm font-bold leading-tight text-[#341cff]">
                      Stacey
                    </div>
                    <div className='inline-flex items-start justify-start gap-2.5 self-stretch rounded-2xl bg-white px-3 py-1.5 shadow-[0px_0px_16px_0px_rgba(29,23,84,0.10)]'>
                      <div className="shrink grow basis-0 font-['Archivo'] text-sm font-medium leading-tight text-[#1d1754]">
                        {"You're"} right... my mind is a bit muddled right now.
                        Maybe I should rest, just for a bit.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='inline-flex items-center justify-start gap-2 self-stretch border-t border-[#9eb7fe] bg-[#f2f6ff] p-4'>
                <CustomInput
                  placeholder='Type Something'
                  className='rounded-2xl border-none bg-white placeholder:text-[#788ad0]'
                />
                <button className='flex h-11 w-11 items-center justify-center gap-2.5 overflow-hidden rounded-[32px] bg-[#341cff] p-1'>
                  <IconSend />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <CustomImage
            width={72}
            height={2724}
            src='/images/chat/chat.png'
            className='fixed bottom-[50px] right-[89px] cursor-pointer'
            onClick={() => setShowChatBox(true)}
            alt='err'
          />
        )}
      </div>
      <div className='relative'>
        <img
          className='relative !h-[240px] w-full rounded-2xl object-cover'
          alt=''
          src='/images/banner.webp'
        />
        <div className='absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 transform'>
          <div className='relative flex w-full flex-col items-center justify-start gap-[22px] text-left text-white max-sm:text-[36px] sm:text-[64px]'>
            <div className='flex w-full flex-col items-center justify-center gap-1 self-stretch'>
              <div className='relative font-extrabold leading-[100%]'>
                OTC TRADING
              </div>
              <div className='relative text-center text-base font-semibold leading-[24px]'>
                Welcome to OTC Trading. Deposit some funds and start trading
                today.
              </div>
            </div>
            <div className='flex gap-2'>
              <Button
                onClick={() => setType('match')}
                className={`${type == 'match' ? 'btn-secondary' : 'btn-primary !border-solid !border-white'}`}
              >
                Match Order
              </Button>
              <Button
                onClick={() => setType('create')}
                className={`${type == 'create' ? 'btn-secondary' : 'btn-primary !border-solid !border-white'}`}
              >
                Create Order
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-6 rounded-2xl bg-blue-200 p-4'>
        <div className='font-archivo relative box-border flex w-full flex-row items-start justify-start gap-3 rounded-2xl bg-white p-2 text-left text-[24px] shadow-[0px_0px_16px_rgba(29,_23,_84,_0.1)]'>
          <div
            onClick={() => setTypeOrder('buy')}
            className={`${typeOrder == 'buy' ? 'bg-primary text-white' : 'bg-white'} flex flex-1 cursor-pointer flex-col items-start justify-center gap-1 rounded-xl px-5 py-3`}
          >
            <div className='relative inline-block w-[150px] font-extrabold leading-[24px]'>
              Buy
            </div>
            <div className='relative text-base font-semibold leading-[24px]'>
              I want to buy memecoin
            </div>
          </div>
          <div
            onClick={() => setTypeOrder('sell')}
            className={`${typeOrder == 'sell' ? 'bg-error text-white' : 'bg-white'} flex flex-1 cursor-pointer flex-col items-start justify-center gap-1 rounded-xl px-5 py-3`}
          >
            <div className='relative font-extrabold leading-[24px]'>Sell</div>
            <div className='relative text-base font-semibold leading-[24px]'>
              I want to sell memecoin
            </div>
          </div>
        </div>

        {type == 'match' && (
          <div className=''>
            <div className='mt-[16px] flex items-center gap-2 max-md:grid max-md:grid-cols-2 max-md:justify-end'>
              <button
                onClick={() => {
                  setShowModalSelectToken(true);
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
              <CustomSelect
                // data-aos='fade-up'
                // data-aos-delay={600}
                options={[
                  {
                    value: 'DESC',
                    label: 'Sort by: Highest Price',
                  },
                  {
                    value: 'ASC',
                    label: 'Sort by: Lowest Price',
                  },
                ]}
                value={paramSearch?.orderBy}
                onChange={(value: any) => {
                  setParamSearch({
                    ...paramSearch,
                    sortField: 'price',
                    orderBy: value,
                  });
                }}
              />
              <CustomSelect
                // data-aos='fade-up'
                // data-aos-delay={400}
                placeholder='Match Type'
                options={[
                  { value: ORDER_MATCH_TYPE.FULL, label: 'Match Type: Full' },
                  {
                    value: ORDER_MATCH_TYPE.PARTIAL,
                    label: 'Match Type: Partial',
                  },
                ]}
                value={paramSearch?.matchType}
                onChange={(value: any) => {
                  setParamSearch({
                    ...paramSearch,
                    matchType: value,
                  });
                }}
              />
            </div>
            {selectedToken && (
              <>
                {' '}
                <div className='flex items-center justify-between'>
                  <div className='my-[24px] flex items-center gap-2'>
                    <CustomImage
                      width={62}
                      height={62}
                      src={selectedToken?.logo}
                      className='rounded-full'
                      alt='otc'
                    />
                    <div className='relative flex w-full flex-col items-start justify-center gap-1 text-left text-[24px]'>
                      <div className='flex flex-row items-start justify-start gap-2'>
                        <div className='relative font-extrabold leading-[32px]'>
                          {selectedToken?.tokenName}
                        </div>
                        <div className='relative font-semibold leading-[32px] text-secondary'>
                          {selectedToken?.tokenSymbol}
                        </div>
                      </div>
                      <div className='flex flex-row items-center justify-start gap-1.5 text-xs'>
                        {selectedToken?.websiteUrl && (
                          <div
                            onClick={() => {
                              window.open(selectedToken?.websiteUrl, '_blank');
                            }}
                            className='flex cursor-pointer flex-row items-center justify-center rounded-3xl bg-blue-300 px-2 py-1'
                          >
                            <div className='relative font-semibold leading-[18px]'>
                              Website
                            </div>
                          </div>
                        )}
                        {selectedToken?.twitterUrl && (
                          <div
                            onClick={() => {
                              window.open(selectedToken?.twitterUrl, '_blank');
                            }}
                            className='flex cursor-pointer flex-row items-center justify-center rounded-3xl bg-blue-300 px-2 py-1'
                          >
                            <div className='relative font-semibold leading-[18px]'>
                              Twitter
                            </div>
                          </div>
                        )}
                        {selectedToken?.telegramUrl && (
                          <div
                            onClick={() => {
                              window.open(selectedToken?.telegramUrl, '_blank');
                            }}
                            className='flex cursor-pointer flex-row items-center justify-center rounded-3xl bg-blue-300 px-2 py-1'
                          >
                            <div className='relative font-semibold leading-[18px]'>
                              Telegram
                            </div>
                          </div>
                        )}
                        {selectedToken?.discordUrl && (
                          <div
                            onClick={() => {
                              window.open(selectedToken?.discordUrl, '_blank');
                            }}
                            className='flex cursor-pointer flex-row items-center justify-center rounded-3xl bg-blue-300 px-2 py-1'
                          >
                            <div className='relative font-semibold leading-[18px]'>
                              Discord
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <CustomButton
                    onClick={() => {
                      window.open(
                        'https://starkscan.co/tx/' +
                          selectedToken?.contractAddress,
                        '_blank'
                      );
                    }}
                    className='btn-white'
                  >
                    View Txn <IconExplore />
                  </CustomButton>
                </div>
                <TableTrade
                  columns={
                    typeOrder == 'buy' ? tradeColumnBuy : tradeColumnSell
                  }
                  dataSource={
                    typeOrder == 'buy'
                      ? listBuyOrderData?.data?.rows
                      : listSellOrderData?.data?.rows
                  }
                  rowClassName={(record, index) =>
                    record?.orderId == orderDetail?.orderId
                      ? 'bg-[#D6E1FF]'
                      : ''
                  }
                  scroll={{ x: 400 }}
                  pagination={{
                    current:
                      typeOrder == 'buy'
                        ? paginationBuy.page
                        : paginationSell.page,
                    pageSize: 10,
                    onChange:
                      typeOrder == 'buy'
                        ? onChangePaginationBuy
                        : onChangePaginationSell,
                    total:
                      typeOrder === 'buy'
                        ? listBuyOrderData?.data?.totalCount
                        : listSellOrderData?.data?.totalCount,
                  }}
                  loading={isLoadingBuy}
                />
              </>
            )}
          </div>
        )}
        {type == 'create' && (
          <CreateOffer
            typeOrder={typeOrder}
            openModalSelectToken={() => {
              setShowModalSelectToken(true);
            }}
          />
        )}
      </div>

      <ModalTradeToken
        open={showModalTradeToken}
        onCancel={() => {
          setShowModalTradeToken(false);
        }}
      />
    </div>
  );
};

export default React.memo(Home);
