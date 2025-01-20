import CustomImage from '@/components/custom/CustomImage';
import FormatPrice from '@/components/FormatPrice';
import NoData from '@/components/NoData';
import {
  ORDER_MATCH_TYPE,
  ORDER_TYPE,
  PRICE_TYPE,
  STARKNET_STRK_ADDRESS,
} from '@/constant';
import { useGetUserOrder } from '@/hook/queries/useGetListOrder';
import { useGetTokenDetail } from '@/hook/queries/useGetListToken';
import useStarknet from '@/hook/useStarknet';
import useStore from '@/store';
import { delay, formatBalance } from '@/utils';
import { toastError, toastSuccess } from '@/utils/toast';
import { Button } from 'antd';
import moment from 'moment';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

const UserOrder = () => {
  const strkPrice = useStore((state: any) => state.strkPrice);
  const params = useParams();
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const { cancelOffer } = useStarknet();

  const [loadingCancel, setLoadingCancel] = useState<any>(false);
  const [orderDetail, setOrderDetail] = useState<any>({});

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
    ...pagination,
    token0: params?.id,
    token1: STARKNET_STRK_ADDRESS,
  });
  const { data: tokenDetail } = useGetTokenDetail({
    tokenAddress: params?.id,
  });
console.log(isAuthenticated,"isAuthenticated")
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

  return (
    <div className='flex w-full flex-col gap-4 border-l border-stroke p-6'>
      <div className='text-neural-900 font-semibold-24 relative flex w-full flex-row items-start justify-between text-left text-[24px]'>
        <div className='flex flex-row items-center justify-start gap-3'>
          <div className='relative font-extrabold leading-[32px]'>My Order</div>
          <div className='box-border flex w-9 flex-row items-center justify-center rounded-lg bg-blue-300 px-3 py-1.5 text-base'>
            <b className='relative leading-[24px]'>
              {userOrders?.data?.rows?.length || 0}
            </b>
          </div>
        </div>
        <Link href={'/my-profile'} className='btn-white'>
          View All
        </Link>
      </div>
      <div className='flex flex-col gap-4 font-bold'>
        {userOrders?.data?.rows?.length > 0 ? (
          userOrders?.data?.rows?.map((item: any, index: any) => (
            <div
              key={index}
              className='relative box-border flex w-full flex-col items-start justify-start gap-3 rounded-2xl bg-white p-6 text-left text-base'
            >
              <div className='flex w-full justify-between'>
                <div className='flex w-full items-center gap-2'>
                  <div
                    className={`uppercase ${ORDER_TYPE[item?.orderType]?.toLowerCase() == 'buy' ? 'text-[#341cff]' : 'text-error'}`}
                  >
                    {ORDER_TYPE[item?.orderType]}
                  </div>
                  <CustomImage
                    width={32}
                    height={32}
                    src={tokenDetail?.data?.logo}
                    alt='otc'
                    className='rounded-full'
                  />
                  {tokenDetail?.data?.tokenSymbol}/STRK
                  <div className='box-border flex flex-row items-center justify-center rounded-full bg-blue-300 px-3 py-1 text-sm'>
                    <b className='relative leading-[24px]'>
                      {ORDER_MATCH_TYPE[item?.matchType]}
                    </b>
                  </div>
                </div>
                <Button
                  loading={
                    loadingCancel && item?.orderId == orderDetail?.offerId
                  }
                  onClick={() =>
                    handleCancelOffer({
                      tokenAddress: item?.token0Address,
                      offerId: Number(item?.orderId),
                      type: ORDER_TYPE[item?.orderType]?.toLowerCase(),
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
                  <div className='text-sm text-secondary'>Total Pay</div>
                  {formatBalance(item?.price) *
                    formatBalance(item?.remainAmount)}{' '}
                  STRK
                </div>
                <div className='flex flex-col gap-2'>
                  <div className='text-sm text-secondary'>Matched</div>
                  {formatBalance(item?.matchAmount)}/
                  {formatBalance(item?.token0Amount)} BONK
                </div>
              </div>
            </div>
          ))
        ) : (
          <NoData />
        )}
      </div>
    </div>
  );
};
export default UserOrder;
