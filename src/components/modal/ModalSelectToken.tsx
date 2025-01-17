import React, { useEffect, useTransition } from 'react';
import CustomModal from '../custom/CustomModal';
import IconClose from '@/assets/icons/IconClose';
import CustomInput from '../custom/CustomInput';
import IconSearch from '@/assets/icons/IconSearch';
import CustomImage from '../custom/CustomImage';
import { useQuery } from '@tanstack/react-query';
import { fetchListToken } from '@/service/token';
import { formatWallet } from '@/utils';
import useDebounce from '@/hook/useDebounce';
import { useGetListToken } from '@/hook/queries/useGetListToken';
import { useImportToken, useQuoteToken } from '@/hook/queries/useQuoteToken';
import CustomButton from '../custom/CustomButton';
import IconLoading from '@/assets/icons/IconLoading';
import { toastError } from '@/utils/toast';
import NoData from '../NoData';

const ModalSelectToken = ({ open, onCancel, setSelectedToken }: any) => {
  const [searchValue, setSearchValue] = React.useState();
  const [loadingToken, setLoadingToken] = React.useState();
  useEffect(() => {
    if (!open) {
      setSearchValue(undefined);
    }
  }, [open]);

  // const { isLoading: loadingQuoteToken, data: quoteTokenList } =
  //   useGetListToken({
  //     open,
  //     limit: 999,
  //     search: searchValue,
  //   });

  const {
    isLoading: loadingQuoteToken,
    data: quoteTokenList,
    refetch: refetchQuoteTokenList,
  } = useQuoteToken({
    open,
    search: searchValue,
  });
  const { mutateAsync, isPending } = useImportToken();

  const handleSelectToken = async (item: any) => {
    if (item?.available) {
      onCancel();
      setSelectedToken(item);
    }
  };

  const handleAddToken = async (item: any) => {
    setLoadingToken(item?.contractAddress);
    await mutateAsync(item?.contractAddress);
    refetchQuoteTokenList();
  };

  const debounceSearch = useDebounce(async (value: any) => {
    setSearchValue(value);
  }, 300);

  const handleSearchToken = async (e: any) => {
    debounceSearch(e.target.value);
  };

  return (
    <CustomModal
      closeIcon={<IconClose fill='#788ad0' />}
      closable
      open={open}
      onCancel={onCancel}
      width={532}
    >
      <div className='inline-flex h-[664px] w-[532px] flex-col items-start justify-start gap-[20px] rounded-3xl bg-[#f2f6ff] p-4 shadow-[0px_0px_16px_0px_rgba(29,23,84,0.10)]'>
        <div className="font-['Archivo'] text-2xl font-extrabold leading-loose text-[#1d1653]">
          Select a Token
        </div>
        <CustomInput
          placeholder='Search'
          onChange={handleSearchToken}
          prefix={<IconSearch fill='#788ad0' />}
          className='select-token-search-input gap-[10px] rounded-[16px] border-none !bg-white py-[12px] !text-primary'
        />
        <div className='w-full overflow-y-auto'>
          {loadingQuoteToken && (
            <IconLoading className='mx-auto animate-spin' />
          )}
          {quoteTokenList?.data?.rows?.length > 0
            ? quoteTokenList?.data?.rows?.map((item: any) => (
                <button
                  onClick={() => {
                    handleSelectToken(item);
                  }}
                  key={item?.id}
                  className='flex h-[72px] w-full items-center justify-between gap-1 rounded-2xl px-5 py-3 transition-all hover:!bg-white hover:shadow-[0px_0px_16px_0px_rgba(29,23,84,0.10)]'
                >
                  <div className='inline-flex items-center justify-start gap-1.5'>
                    <CustomImage
                      alt='err'
                      src={item?.logo}
                      className='rounded-full'
                      width={48}
                      height={48}
                    />
                    <div className='inline-flex flex-col items-start justify-center'>
                      <div className='inline-flex items-start justify-start gap-2'>
                        <div className="font-['Archivo'] text-base font-bold leading-normal text-[#1d1754]">
                          {item?.tokenName}
                        </div>
                        <div className="font-['Archivo'] text-base font-medium leading-normal text-[#788ad0]">
                          {item?.tokenSymbol}
                        </div>
                      </div>
                      <div className="font-['Archivo'] text-base font-medium leading-normal text-[#788ad0]">
                        {formatWallet(item?.contractAddress)}
                      </div>
                    </div>
                  </div>
                  {!item?.available && (
                    <CustomButton
                      onClick={() => {
                        handleAddToken(item);
                      }}
                      loading={
                        isPending && loadingToken === item?.contractAddress
                      }
                    >
                      Add
                    </CustomButton>
                  )}
                </button>
              ))
            : !loadingQuoteToken && <NoData />}
        </div>
      </div>
    </CustomModal>
  );
};

export default ModalSelectToken;
