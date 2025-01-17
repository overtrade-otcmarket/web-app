import React from 'react';
import CustomImage from './custom/CustomImage';
import { DEFAULT_IMAGE } from '@/constant';
import useStore from '@/store';
import { usePathname } from 'next/navigation';

const NoData = () => {
  const setShowModalCreateOffer = useStore(
    (state) => state.setShowModalCreateOffer
  );
  const pathname = usePathname();
  return (
    <div className='flex flex-col items-center py-20'>
      <CustomImage src={DEFAULT_IMAGE} alt='No Data' width={100} height={100} />
      <p className='mt-[1rem] text-[24px]'>No data found!</p>
      {pathname?.includes('/token/') && (
        <p
          onClick={() => setShowModalCreateOffer(true)}
          className='mt-[1rem] text-[24px] underline cursor-pointer'
        >
          Create your own order now!
        </p>
      )}
    </div>
  );
};

export default NoData;
