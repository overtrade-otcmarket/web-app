'use client';
import IconSearch from '@/assets/icons/IconSearch';
import IconTxs from '@/assets/icons/IconTxs';
import CustomImage from '@/components/custom/CustomImage';
import CustomInput from '@/components/custom/CustomInput';
import CustomSelect from '@/components/custom/CustomSelect';
import FormatPrice from '@/components/FormatPrice';
import STRKToken from '@/components/STRKToken';
import TableTrade from '@/components/table/TableTrade';
import { ORDER_TYPE, PRICE_TYPE } from '@/constant';
import {
  useGetListPool,
  useGetListTxs,
  useGetNewTxs,
} from '@/hook/queries/useGetListPool';
import useDebounce from '@/hook/useDebounce';
import useStore from '@/store';
import { formatBalance, formatWallet } from '@/utils';
import { Button } from 'antd';
import moment from 'moment';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

const Explore = () => {
  const strkPrice = useStore((state: any) => state.strkPrice);
  const [type, setType] = useState('tokens');
  const tradeColumn = [
    {
      title: 'No.',
      dataIndex: 'no',
      key: 'no',
      width: 60,
      render: (value: any, record: any, index: any) => (
        <div className={type == 'txs' ? 'hidden' : ''}>{index + 1}</div>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'poolName',
      key: 'poolName',
      render: (value: any, record: any, index: any) => (
        <Link
          href={`/token/${record?.token0Address}`}
          className='flex gap-2 font-semibold text-primary'
        >
          <CustomImage
            className='relative h-6 w-6 rounded-full object-cover'
            width={48}
            height={48}
            alt=''
            src={record?.token0Logo}
          />
          {value}
          {/* <div className='font-normal text-secondary'>{record?.symbol}</div> */}
        </Link>
      ),
    },
    {
      title: 'Lowest Price',
      dataIndex: 'lowestPrice',
      key: 'lowestPrice',
      render: (value: any, record: any, index: any) => (
        <div className='flex gap-2 font-semibold text-primary'>
          <STRKToken />
          <div className='flex items-center gap-2'>
            <FormatPrice number={formatBalance(value)} /> STRK
          </div>
        </div>
      ),
    },
    {
      title: 'Highest Price',
      dataIndex: 'highestPrice',
      key: 'highestPrice',
      render: (value: any, record: any, index: any) => (
        <div className={`flex gap-2 font-semibold text-primary`}>
          <STRKToken />
          <div className='flex items-center gap-2'>
            <FormatPrice number={formatBalance(value)} /> STRK
          </div>
        </div>
      ),
    },
    {
      title: 'Volume',
      dataIndex: 'volume',
      key: 'volume',
      render: (value: any, record: any, index: any) => (
        <div className='flex gap-2 font-semibold text-primary'>
          <STRKToken />
          <div className='flex items-center gap-2'>
            <FormatPrice number={formatBalance(value)} /> STRK
          </div>
        </div>
      ),
    },
    {
      title: 'Volume Change',
      dataIndex: 'volumeChange',
      key: 'volumeChange',
      render: (value: any, record: any, index: any) => (
        <div
          className={`${Number(value) >= 0 ? 'text-success' : 'text-error'}`}
        >
          {Number(value) > 0 ? '+' : ''}
          {value}%
        </div>
      ),
    },
  ];

  const txsColumn = [
    {
      title: 'Time',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value: any, record: any, index: any) => (
        <div>{moment(value).format('YYYY-MM-DD HH:mm')}</div>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (value: any, record: any, index: any) => (
        <div className='flex gap-2 font-semibold text-primary'>
          <CustomImage
            className='relative h-6 w-6 rounded-full object-cover'
            width={48}
            height={48}
            alt=''
            src={record?.token0Logo}
          />
          {value}
          <div className='font-semibold'>{record?.token0Name}</div>
          <div className='font-normal text-secondary'>
            {record?.token0Symbol}
          </div>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'orderType',
      key: 'orderType',
      render: (value: any, record: any, index: any) => (
        <div
          className={`relative box-border flex w-[60px] flex-row items-center justify-center rounded-xl px-2 py-1 text-left text-xs ${ORDER_TYPE[value] == 'BUY' ? 'bg-[#bcf8cc] text-success' : 'bg-[#FFB1B7] text-error'}`}
        >
          <p className='relative font-bold leading-[18px]'>
            {ORDER_TYPE[value]}
          </p>
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (value: any, record: any, index: any) => (
        <div className='flex gap-2 font-semibold text-primary'>
          <STRKToken />
          <div className='flex items-center gap-1'>
            <FormatPrice
              number={formatBalance(
                record?.typeOrder == PRICE_TYPE?.FIXED
                  ? value
                  : value / strkPrice
              )}
            />{' '}
            STRK
          </div>
        </div>
      ),
    },
    // {
    //   title: 'Volume',
    //   dataIndex: 'volume',
    //   key: 'volume',
    //   render: (value: any, record: any, index: any) => (
    //     <FormatPrice number={value} prefix='$' />
    //   ),
    // },
    {
      title: 'Wallet',
      dataIndex: 'orderCreator',
      key: 'orderCreator',
      render: (value: any, record: any, index: any) => (
        <div className={`text-error`}>{formatWallet(value)}</div>
      ),
    },
    {
      title: 'Transaction',
      dataIndex: 'transactionHash',
      key: 'transactionHash',
      render: (value: any, record: any, index: any) => (
        <Link
          target='_blank'
          rel='noreferrer'
          href={`https://starkscan.co/tx/${value}`}
        >
          <IconTxs />
        </Link>
      ),
    },
  ];

  const [searchValue, setSearchValue] = useState(undefined);

  const debounceSearch = useDebounce(async (value: any) => {
    setSearchValue(value);
  }, 300);

  const [paramSearch, setParamSearch] = useState({
    page: 1,
    limit: 10,
    sortField: 'lowestPrice',
    orderBy: 'DESC',
  } as any);

  const onChangePaginationPool = (page: number, pageSize: number) => {
    setParamSearch({
      ...paramSearch,
      page: page,
    });
  };

  const {
    data: listPoolData,
    isLoading: isLoadingPool,
    refetch: refetchPool,
  } = useGetListPool({
    ...paramSearch,
    search: searchValue,
  });

  const [paginationTxs, setPaginationTxs] = useState({
    page: 1,
    limit: 10,
  });

  const onChangePaginationTxs = (page: number, pageSize: number) => {
    setPaginationTxs({
      ...paginationTxs,
      page: page,
    });
  };

  const {
    data: listTxsData,
    isLoading: isLoadingTxs,
    refetch: refetchTxs,
  } = useGetListTxs({
    ...paginationTxs,
    enabled: type == 'transactions',
  });

  const { data: listNewTxsData } = useGetNewTxs({});

  const newTokenRef = useRef<any>(null);

  useEffect(() => {
    if (!newTokenRef?.current || !listNewTxsData || listNewTxsData?.data?.rows?.length < 6)
      return;
    let margin = 0;
    let count = 0;
    const interval = setInterval(() => {
      if (count === listNewTxsData?.data?.rows?.length - 7) {
        count = 0;
        margin = 0;
        newTokenRef.current.style.marginLeft = 0 + 'px';
      }
      margin -= 500 + 8;
      count++;
      newTokenRef.current.style.marginLeft = margin + 'px';
    }, 3000);
    return () => clearInterval(interval);
  }, [listNewTxsData]);

  return (
    <div className='flex w-full flex-col items-center gap-[1rem]'>
      <div className='relative w-full'>
        <img
          className='relative !h-[350px] w-full object-cover'
          alt=''
          src='/images/banner.webp'
        />
        <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform'>
          <div className='relative flex w-full flex-col items-center justify-start gap-[22px] text-center text-white max-sm:text-[32px] sm:text-[64px]'>
            <div className='flex w-full flex-col items-center justify-center gap-1 self-stretch'>
              <div className='relative font-extrabold leading-[100%]'>
                Live Meme-Markets
              </div>
              <div className='relative text-center text-base font-semibold leading-[24px]'>
                Trade OTC meme tokens.
              </div>
            </div>
            <Button className='btn-secondary'>How it Works?</Button>
          </div>
        </div>
      </div>

      <div
        className='relative mt-[-4rem] flex max-w-full items-center justify-center gap-[24px] transition-all duration-500 ease-out [scrollbar-width:none]'
        ref={newTokenRef}
      >
        {listNewTxsData?.data?.rows?.map((item: any, index: any) => (
          <Link
            key={index}
            href={`/token/${item?.token0Address}`}
            className='inline-flex h-[78px] min-w-[330px] items-center justify-start gap-3 rounded-2xl bg-white p-3 shadow-[0px_0px_16px_0px_rgba(29,23,84,0.10)]'
          >
            <CustomImage
              width={60}
              height={60}
              src={item?.token0Logo}
              alt='otc'
              className='rounded-full'
            />
            <div className='inline-flex flex-col items-start justify-center max-w-[220px] three_dot_1_line'>
              <div className='inline-flex items-start justify-start gap-2'>
                <div className="font-['Archivo'] text-lg font-extrabold leading-relaxed text-[#1d1653]">
                  {item?.token0Symbol}
                </div>
                <div className="font-['Archivo'] text-lg font-medium leading-relaxed text-[#788ad0]">
                  {item?.token0Symbol}/STRK
                </div>
              </div>
              <div className='inline-flex items-start justify-start gap-2 self-stretch'>
                <div className="font-['Archivo'] text-base font-bold leading-normal text-[#e24e59]">
                  {formatWallet(item?.orderCreator)}
                </div>
                <div
                  className={`relative box-border flex w-[60px] flex-row items-center justify-center rounded-xl px-2 py-1 text-left text-xs ${ORDER_TYPE[item?.orderType] == 'BUY' ? 'bg-[#bcf8cc] text-success' : 'bg-[#FFB1B7] text-error'}`}
                >
                  <p className='relative font-bold leading-[18px]'>
                    {ORDER_TYPE[item?.orderType]}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className='mt-6 w-full max-w-[1280px] rounded-2xl bg-blue-200 p-4 max-sm:max-w-[96%]'>
        <div className='mb-6 flex flex-wrap justify-between gap-2'>
          <div className='flex gap-1.5 rounded-2xl bg-white p-1.5 text-left text-base text-white shadow-[0px_0px_16px_rgba(29,_23,_84,_0.1)]'>
            <div
              onClick={() => setType('tokens')}
              className={`flex w-[170px] flex-1 cursor-pointer flex-col items-center justify-center rounded-xl ${type == 'tokens' ? 'bg-primary text-white' : 'bg-white text-primary'} px-5 py-1.5`}
            >
              <div className='relative font-extrabold leading-[24px]'>
                Tokens
              </div>
            </div>
            <div
              onClick={() => setType('transactions')}
              className={`flex w-[170px] flex-1 cursor-pointer flex-col items-center justify-center rounded-xl ${type == 'transactions' ? 'bg-primary text-white' : 'bg-white text-primary'} px-5 py-1.5`}
            >
              <div className='relative font-extrabold leading-[24px]'>
                Transactions
              </div>
            </div>
          </div>
          {type == 'tokens' && (
            <div className='flex items-center gap-[18px]'>
              <CustomInput
                placeholder='Search'
                prefix={<IconSearch fill='#1D1754' />}
                className='explore-search-input max-w-[407px] gap-[10px] rounded-[16px] border-none !bg-white py-[12px] !text-primary'
                onChange={(e: any) => debounceSearch(e.target.value)}
              />
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
                    orderBy: value,
                  });
                }}
              />
            </div>
          )}
        </div>
        {type == 'tokens' ? (
          <TableTrade
            columns={tradeColumn}
            dataSource={listPoolData?.data?.rows}
            scroll={{ x: 'max-content' }}
            pagination={{
              current: paramSearch?.page,
              pageSize: 10,
              onChange: onChangePaginationPool,
              total: listPoolData?.data?.totalCount,
            }}
            loading={isLoadingPool}
          />
        ) : (
          <TableTrade
            columns={txsColumn}
            dataSource={listTxsData?.data?.rows}
            scroll={{ x: 'max-content' }}
            pagination={{
              current: paginationTxs?.page,
              pageSize: 10,
              onChange: onChangePaginationTxs,
              total: listTxsData?.data?.totalCount,
            }}
            loading={isLoadingTxs}
          />
        )}
      </div>
    </div>
  );
};
export default Explore;
