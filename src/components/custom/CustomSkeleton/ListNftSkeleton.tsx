import React from 'react';
import NftSkeleton from './NftSkeleton';

const ListNftSkeleton = () => {
  return (
    <div className='grid grid-cols-2 gap-[16px] md:grid-cols-3 lg:grid-cols-4'>
      <>
        {[...new Array(8)].map((_, index) => (
          <NftSkeleton key={index} />
        ))}
      </>
    </div>
  );
};

export default ListNftSkeleton;
