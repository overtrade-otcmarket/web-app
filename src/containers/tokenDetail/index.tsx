import CustomImage from '@/components/custom/CustomImage';
import ListOrder from './listOrder';
import IconInfo from '@/assets/icons/IconInfo';
import FormatPrice from '@/components/FormatPrice';
import { Button } from 'antd';
import UserOrder from './userOrder';
import {
  useGetPoolDetail,
  useGetTokenDetail,
  useGetTokenPrice,
} from '@/hook/queries/useGetListToken';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { STARKNET_STRK_ADDRESS } from '@/constant';
import { formatBalance } from '@/utils';
import useStore from '@/store';
import ModalCreateOffer from '@/components/modal/ModalCreateOffer';
import useShowModal from '@/hook/useShowModal';
import TradeToken from './tradeToken';
import { useEffect } from 'react';

const TokenDetailContainer = () => {
  const params = useParams();
  const setSelectedToken = useStore((state) => state.setSelectedToken);
  const setOrderDetail = useStore((state) => state.setOrderDetail);

  const strkPrice = useStore((state: any) => state.strkPrice);

  const { data: tokenPrice } = useGetTokenPrice({
    tokenAddress: params?.id,
  });

  const { data: tokenDetail, isLoading: isLoadingBuy } = useGetTokenDetail({
    tokenAddress: params?.id,
  });

  const { data: poolDetail } = useGetPoolDetail({
    token0: params?.id,
    token1: STARKNET_STRK_ADDRESS,
  });

  const dataInfo = [
    {
      title: (
        <div className='flex items-center gap-2 text-sm font-bold text-secondary'>
          Market Price
        </div>
      ),
      value: (tokenPrice?.data?.priceInUsd || 0) / strkPrice,
    },
    {
      title: (
        <div className='flex items-center gap-2 text-sm font-bold text-secondary'>
          Lowest OTC Price
        </div>
      ),
      value: formatBalance(poolDetail?.data?.lowestPrice),
    },
    {
      title: (
        <div className='flex items-center gap-2 text-sm font-bold text-secondary'>
          Highest OTC Price
        </div>
      ),
      value: formatBalance(poolDetail?.data?.highestPrice),
    },
    {
      title: (
        <div className='flex items-center gap-2 text-sm font-bold text-secondary'>
          24h Volume
        </div>
      ),
      value: formatBalance(poolDetail?.data?.volume),
    },
  ];

  const showModalCreateOffer = useStore((state) => state.showModalCreateOffer);
  const setShowModalCreateOffer = useStore(
    (state) => state.setShowModalCreateOffer
  );
  
  useEffect(() => {
    setOrderDetail({});
    setSelectedToken({});
  }, []);

  return (
    <div className='w-full bg-blue-200 pb-10'>
      <div className='flex border-b border-stroke p-6 max-sm:flex-col max-sm:gap-2 sm:justify-between'>
        <div className='flex items-center gap-2'>
          <CustomImage
            width={60}
            height={60}
            src={tokenDetail?.data?.logo}
            alt='otc'
            className='rounded-full'
          />
          <div className='relative flex w-full flex-col items-start justify-center gap-1 text-left text-[24px]'>
            <div className='flex flex-row items-start justify-start gap-2'>
              <div className='relative font-extrabold leading-[32px]'>
                {tokenDetail?.data?.tokenSymbol}
              </div>
              <div className='relative font-semibold leading-[32px] text-secondary'>
                {tokenDetail?.data?.tokenSymbol}/STRK
              </div>
            </div>
            <div className='flex flex-row items-center justify-start gap-1.5 text-xs'>
              {tokenDetail?.data?.twitterUrl && (
                <Link
                  target='_blank'
                  rel='noreferrer'
                  href={tokenDetail?.data?.twitterUrl}
                  className='flex cursor-pointer flex-row items-center justify-center rounded-3xl bg-blue-300 px-2 py-1'
                >
                  <div className='relative font-semibold leading-[18px]'>
                    Twitter
                  </div>
                </Link>
              )}
              {tokenDetail?.data?.telegramUrl && (
                <Link
                  target='_blank'
                  rel='noreferrer'
                  href={tokenDetail?.data?.telegramUrl}
                  className='flex cursor-pointer flex-row items-center justify-center rounded-3xl bg-blue-300 px-2 py-1'
                >
                  <div className='relative font-semibold leading-[18px]'>
                    Telegram
                  </div>
                </Link>
              )}
              {tokenDetail?.data?.websiteUrl && (
                <Link
                  target='_blank'
                  rel='noreferrer'
                  href={tokenDetail?.data?.websiteUrl}
                  className='flex cursor-pointer flex-row items-center justify-center rounded-3xl bg-blue-300 px-2 py-1'
                >
                  <div className='relative font-semibold leading-[18px]'>
                    Website
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className='grid items-end max-sm:grid-cols-2 max-sm:gap-2 sm:grid-cols-4 sm:gap-6'>
          {dataInfo?.map((item: any, index: any) => (
            <div key={index}>
              {item?.title}
              <div className='flex items-center gap-2 font-bold'>
                <FormatPrice number={item?.value} /> STRK
              </div>
            </div>
          ))}
        </div>
        <Button
          onClick={() => {
            setSelectedToken(tokenDetail?.data);
            setShowModalCreateOffer(true);
          }}
          className='btn-primary'
        >
          Create Order
        </Button>
      </div>
      <div className='flex max-sm:flex-col sm:flex-row'>
        <div className='max-sm:w-full sm:w-2/3'>
          <ListOrder />
        </div>
        <div className='max-sm:w-full sm:w-1/3'>
          <TradeToken />
          <UserOrder />
        </div>
      </div>
      <ModalCreateOffer
        open={showModalCreateOffer}
        onCancel={() => {
          setShowModalCreateOffer(false);
        }}
      />
    </div>
  );
};
export default TokenDetailContainer;
