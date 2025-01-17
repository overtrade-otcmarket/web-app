import { Skeleton } from 'antd';
import React from 'react';

const NftSkeleton = ({ ...props }) => {
  return (
    <div {...props} className='w-full rounded-lg p-2'>
      <Skeleton.Button
        shape='square'
        active
        className='skeleton-image aspect-square w-full rounded-lg'
        block
      />
      <div className='mt-2 space-y-2'>
        <div className='w-full'>
          <Skeleton.Button size='small' active block />
        </div>
        <div className='w-4/6'>
          <Skeleton.Button size='small' active block />
        </div>
      </div>
    </div>
  );
};

export default NftSkeleton;
