'use client';

import useMounted from '@/hook/useMounted';
import { formatTimeUnit } from '@/utils';
import { useRouter } from 'next/navigation';
import React from 'react';
// import Countdown from 'react-countdown';

const Renderer = ({ days, hours, minutes, seconds, completed }: any) => {
  return (
    <div className='flex items-center gap-3 font-medium text-[#FFE794]'>
      <div className='bg-tertiary flex flex-col items-center rounded-lg px-[16px] pb-2'>
        <p className='text-[32px]'>{formatTimeUnit(days)}</p>
        <p className='font-medium'>Days</p>
      </div>
      <div className='bg-tertiary flex flex-col items-center rounded-lg px-[16px] pb-2'>
        <p className='text-[32px]'>{formatTimeUnit(hours)}</p>
        <p className='font-medium'>Hours</p>
      </div>
      <div className='bg-tertiary flex flex-col items-center rounded-lg px-[16px] pb-2'>
        <p className='text-[32px]'>{formatTimeUnit(minutes)}</p>
        <p className='font-medium'>Minutes</p>
      </div>
      <div className='bg-tertiary flex flex-col items-center rounded-lg px-[16px] pb-2'>
        <p className='text-[32px]'>{formatTimeUnit(seconds)}</p>
        <p className=''>Seconds</p>
      </div>
    </div>
  );
};

const Maintain = () => {
  const { isMounted } = useMounted();
  const router = useRouter();

  return (
    <div className='scale_layout flex h-[var(--100vh)] w-full flex-col items-center justify-center gap-[0.5rem] bg-white bg-[url("/images/bg-loading.webp")] bg-cover bg-center max-sm:px-[16px]'>
      <h4 className='font-godOfWar mb-[1rem] text-[38px] font-[400] text-[#8F3A2D] sm:text-[48px]'>
        Coming Soon
      </h4>
      {/* {isMounted && (
        <Countdown
          date={1722826800000}
          renderer={Renderer}
          onComplete={() => router.push('play')}
        />
      )} */}
    </div>
  );
};

export default Maintain;
