import React, { useEffect, useState } from 'react';
import CustomModal from '../custom/CustomModal';
import CreateOffer from '@/containers/home/createOffer';

const ModalCreateOffer = ({ open, onCancel }: any) => {
  const [typeOrder, setTypeOrder] = useState('buy');

  return (
    <CustomModal open={open} onCancel={onCancel} width={700}>
      <div className='rounded-3xl bg-[#f2f6ff] p-6 shadow-[0px_0px_16px_0px_rgba(29,23,84,0.10)] max-h-[600px] overflow-scroll'>
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
        <CreateOffer typeOrder={typeOrder} openModalSelectToken={() => {}} />
      </div>
    </CustomModal>
  );
};

export default ModalCreateOffer;
