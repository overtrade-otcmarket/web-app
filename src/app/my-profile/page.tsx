'use client';
import IconExplore from '@/assets/icons/IconExplore';
import IconSearch from '@/assets/icons/IconSearch';
import IconTxs from '@/assets/icons/IconTxs';
import CustomImage from '@/components/custom/CustomImage';
import CustomInput from '@/components/custom/CustomInput';
import CustomSelect from '@/components/custom/CustomSelect';
import FormatPrice from '@/components/FormatPrice';
import NoData from '@/components/NoData';
import STRKToken from '@/components/STRKToken';
import TableTrade from '@/components/table/TableTrade';
import { ORDER_MATCH_TYPE, ORDER_TYPE, PRICE_TYPE } from '@/constant';
import UserOrder from '@/containers/tokenDetail/userOrder';
import {
  useGetUserActivities,
  useGetUserOrder,
} from '@/hook/queries/useGetListOrder';
import useDebounce from '@/hook/useDebounce';
import useStarknet from '@/hook/useStarknet';
import useStore from '@/store';
import { delay, formatBalance, formatWallet } from '@/utils';
import { toastError, toastSuccess } from '@/utils/toast';
import { Button } from 'antd';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const MyProfile = () => {
  const router = useRouter();
  const { cancelOffer } = useStarknet();
  const [searchValue, setSearchValue] = useState(undefined);
  const [searchBy, setSearchBy] = useState('all');
  const [loadingCancel, setLoadingCancel] = useState<any>(false);
  const [orderDetail, setOrderDetail] = useState<any>({});

  const debounceSearch = useDebounce(async (value: any) => {
    setSearchValue(value);
  }, 300);
  const currentConnectedAccount = useStore(
    (state: any) => state.currentConnectedAccount
  );
  const isAuthenticated = useStore((state: any) => state.isAuthenticated);
  const strkPrice = useStore((state: any) => state.strkPrice);
  const [type, setType] = useState('tokens');

  const txsColumn = [
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (value: any, record: any, index: any) => (
        <div>{moment.unix(value).format('YYYY-MM-DD HH:mm')}</div>
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

  // useEffect(() => {
  //   if (!currentConnectedAccount) {
  //     router.push('/');
  //   }
  // }, [currentConnectedAccount]);

  const [paginationOrders, setPaginationOrders] = useState({
    page: 1,
    limit: 10,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const {
    data: userOrders,
    isLoading: isLoading,
    refetch,
  } = useGetUserOrder({
    isAuthenticated: isAuthenticated,
    ...paginationOrders,
    filter: searchValue,
    searchBy: searchBy == 'all' ? undefined : searchBy,
  });

  const loadMoreToken = () => {
    setPaginationOrders({
      ...paginationOrders,
      limit: paginationOrders.limit + 10,
    });
  };

  const { data: userActivities, isLoading: isLoadingActivities } =
    useGetUserActivities({
      isAuthenticated: isAuthenticated && type == 'txs',
      ...pagination,
    });

  const handleCancelOffer = async (params: any) => {
    try {
      setOrderDetail(params);
      setLoadingCancel(true);
      const res = await cancelOffer(params);
      if (res) {
        await delay(5000);
        toastSuccess('Cancel Offer Success!');
        refetch();
      }
    } catch (error: any) {
      toastError(error?.message);
    } finally {
      setLoadingCancel(false);
    }
  };

  const onChangePagination = (page: number, pageSize: number) => {
    setPagination({
      ...pagination,
      page: page,
    });
  };

  return (
    <div className='mt-10 flex flex-col gap-3 md:w-2/3 xl:w-1/2'>
      <div className='relative box-border flex w-full flex-col items-start justify-center gap-6 rounded-2xl bg-white p-6 text-left shadow-[0px_0px_16px_rgba(29,_23,_84,_0.1)]'>
        <div className='flex w-full justify-between'>
          <div className='flex items-center gap-3 text-[24px] font-bold'>
            <CustomImage
              width={60}
              height={60}
              src='/images/bonk.webp'
              alt='otc'
              className='!h-[60px] !w-[60px]'
            />
            <div className='flex flex-col gap-2 text-[24px]'>
              My Profile{' '}
              <div className='flex items-center gap-2 rounded-full bg-blue-200 p-2 text-sm'>
                <STRKToken width={16} height={16} />
                {formatWallet(currentConnectedAccount)}
              </div>
            </div>
          </div>
          <Button
            onClick={() => toastSuccess('Coming soon!')}
            className='btn-white'
          >
            Edit Profile
          </Button>
        </div>
      </div>
      <div className='relative box-border flex w-full flex-col items-start justify-center gap-6 rounded-2xl bg-blue-200 p-6 text-left shadow-[0px_0px_16px_rgba(29,_23,_84,_0.1)]'>
        <div className='mb-6 flex w-full justify-between'>
          <div className='flex gap-1.5 rounded-2xl bg-white p-1.5 text-left text-base text-white shadow-[0px_0px_16px_rgba(29,_23,_84,_0.1)]'>
            <div
              onClick={() => setType('tokens')}
              className={`flex w-[170px] flex-1 cursor-pointer flex-col items-center justify-center rounded-xl ${type == 'tokens' ? 'bg-primary text-white' : 'bg-white text-primary'} px-5 py-1.5`}
            >
              <div className='relative font-extrabold leading-[24px]'>
                My Orders
              </div>
            </div>
            <div
              onClick={() => setType('txs')}
              className={`flex w-[170px] flex-1 cursor-pointer flex-col items-center justify-center rounded-xl ${type == 'txs' ? 'bg-primary text-white' : 'bg-white text-primary'} px-5 py-1.5`}
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
                className='explore-search-input gap-[10px] rounded-[16px] border-none !bg-white py-[12px] !text-primary'
                onChange={(e: any) => debounceSearch(e.target.value)}
              />
              <CustomSelect
                options={[
                  { value: 'all', label: 'SearchBy' },
                  { value: '0', label: 'TypeOrder: Buy' },
                  { value: '1', label: 'TypeOrder: Sell' },
                  { value: '2', label: 'TypeMatch: Partial' },
                  { value: '3', label: 'TypeMatch: Full' },
                ]}
                className='!w-[172px]'
                value={searchBy}
                onChange={(value: any) => {
                  setSearchBy(value);
                }}
              />
            </div>
          )}
        </div>
        {type == 'tokens' && (
          <div id='list-token' className='max-h-[60vh] w-full overflow-scroll'>
            {userOrders?.data?.rows?.length > 0 && (
              <InfiniteScroll
                dataLength={userOrders?.data?.rows?.length}
                next={loadMoreToken}
                hasMore={userOrders?.data?.nextPage}
                loader={<div></div>}
                scrollableTarget='list-token'
              >
                <div className='flex w-full flex-col gap-4 font-bold'>
                  {userOrders?.data?.rows?.length > 0 ? (
                    userOrders?.data?.rows?.map((item: any, index: any) => (
                      <div
                        key={index}
                        className='relative box-border flex w-full flex-col items-start justify-start gap-3 rounded-2xl bg-white p-6 text-left text-base'
                      >
                        <div className='flex w-full justify-between'>
                          <div className='flex w-full items-center gap-2'>
                            <div
                              className={`uppercase ${ORDER_TYPE[item?.orderType] == 'BUY' ? 'text-[#341cff]' : 'text-error'}`}
                            >
                              {ORDER_TYPE[item?.orderType]}
                            </div>
                            <CustomImage
                              width={32}
                              height={32}
                              src={item?.token0Logo}
                              alt='otc'
                              className='rounded-full'
                            />
                            {item?.token0Symbol}/STRK
                            <div className='box-border flex flex-row items-center justify-center rounded-full bg-blue-300 px-3 py-1 text-sm'>
                              <b className='relative leading-[24px]'>
                                {ORDER_MATCH_TYPE[item?.matchType]}
                              </b>
                            </div>
                          </div>
                          <Button
                            loading={
                              loadingCancel &&
                              item?.orderId == orderDetail?.offerId
                            }
                            onClick={() =>
                              handleCancelOffer({
                                tokenAddress: item?.token0Address,
                                offerId: Number(item?.orderId),
                                type: ORDER_TYPE[
                                  item?.orderType
                                ]?.toLowerCase(),
                              })
                            }
                            className='btn-secondary !h-[32px]'
                          >
                            Cancel
                          </Button>
                        </div>
                        <div className='grid w-full grid-cols-4'>
                          <div className='flex flex-col gap-2'>
                            <div className='text-sm text-secondary'>Expire</div>
                            {moment.unix(item?.expiredTime).fromNow()}
                          </div>
                          <div className='flex flex-col gap-2'>
                            <div className='text-sm text-secondary'>Price</div>
                            <div className='flex items-center gap-1'>
                              <FormatPrice
                                number={formatBalance(
                                  item?.priceType == PRICE_TYPE?.FIXED
                                    ? item?.price
                                    : item?.price / strkPrice
                                )}
                              />{' '}
                              STRK
                            </div>
                          </div>
                          <div className='flex flex-col gap-2'>
                            <div className='text-sm text-secondary'>
                              Total Pay
                            </div>
                            <div className='flex items-center gap-2'>
                              <FormatPrice
                                number={
                                  formatBalance(item?.price) *
                                  formatBalance(item?.token0Amount)
                                }
                              />{' '}
                              STRK
                            </div>
                          </div>
                          <div className='flex flex-col gap-2'>
                            <div className='text-sm text-secondary'>
                              Matched
                            </div>
                            <div className='flex items-center gap-1'>
                              <FormatPrice
                                number={formatBalance(item?.matchAmount)}
                              />
                              /
                              <FormatPrice
                                number={formatBalance(item?.token0Amount)}
                              />{' '}
                              {item?.token0Symbol}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <NoData />
                  )}
                </div>
              </InfiniteScroll>
            )}
          </div>
        )}
        {type == 'txs' && (
          <div className='w-full'>
            <TableTrade
              columns={txsColumn}
              dataSource={userActivities?.data?.rows}
              // scroll={{ y: 'max-content', x: 'max-content' }}
              pagination={{
                current: pagination?.page,
                pageSize: 10,
                onChange: onChangePagination,
                total: userActivities?.data?.totalCount,
              }}
              loading={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
