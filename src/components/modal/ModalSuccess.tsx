import React, { useEffect } from 'react';
import CustomModal from '../custom/CustomModal';
import CustomImage from '@/components/custom/CustomImage';
import { useRouter } from 'next/navigation';
import { Button } from 'antd';

const ModalSuccess = ({ open, onCancel }: any) => {
  const router = useRouter();

  return (
    <CustomModal open={open} onCancel={onCancel} width={450}>
      <div className='flex flex-col items-center rounded-xl p-[40px] font-bold'>
        <CustomImage
          src='/images/success.webp'
          alt='err'
          width={72}
          height={72}
          className='mb-6'
        />
        <div className='text-[24px] font-extrabold'>Success</div>
        <div className='text-sm'>
          Check your profile for managing your order
        </div>
        <div className='mt-4 grid w-full grid-cols-2 gap-4'>
          <Button
            onClick={() => router.push('/my-profile')}
            className='btn-white w-full !rounded-full'
          >
            My Profile
          </Button>
          <Button onClick={() => onCancel()} className='btn-primary w-full'>
            Done
          </Button>
        </div>
      </div>
    </CustomModal>
  );
};

export default ModalSuccess;
