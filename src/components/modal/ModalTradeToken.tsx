import React, { useEffect } from 'react';
import CustomModal from '../custom/CustomModal';
import CustomImage from '@/components/custom/CustomImage';
import { useRouter } from 'next/navigation';
import { Button } from 'antd';
import TradeToken from '@/containers/tokenDetail/tradeToken';

const ModalTradeToken = ({ open, onCancel }: any) => {
  const router = useRouter();

  return (
    <CustomModal open={open} onCancel={onCancel} width={700}>
      <div className=' bg-[#f2f6ff] shadow-[0px_0px_16px_0px_rgba(29,23,84,0.10)] rounded-3xl'>
        <TradeToken />
      </div>
    </CustomModal>
  );
};

export default ModalTradeToken;
