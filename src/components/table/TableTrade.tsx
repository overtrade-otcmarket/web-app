import { PaginationProps, TableProps } from 'antd';
import React from 'react';
import cx from 'classnames';
import IconPrev from '@/assets/icons/IconPrev';
import IconNext from '@/assets/icons/IconNext';
import CustomTable from '../custom/CutomTable';
import NoData from '../NoData';

const TableTrade = ({
  columns,
  dataSource,
  bordered = false,
  loading,
  scroll,
  className,
  pagination,
  ...props
}: TableProps<any>) => {
  const itemRender: PaginationProps['itemRender'] = (
    page,
    type,
    originalElement
  ) => {
    if (type === 'prev') {
      return (
        <div className='flex h-full items-center justify-end'>
          <IconPrev />
        </div>
      );
    }
    if (type === 'next') {
      return (
        <div className='flex h-full items-center pl-1'>
          <IconNext />
        </div>
      );
    }
    if (type === 'page') {
      return (
        <div className='flex h-full w-full items-center justify-center pb-2 text-base font-medium text-primary hover:bg-none'>
          {page}
        </div>
      );
    }
    return originalElement;
  };

  return (
    <>
      <CustomTable
        className={cx('custom-table', className)}
        columns={columns}
        dataSource={dataSource}
        bordered={bordered}
        pagination={
          !pagination
            ? false
            : {
                ...pagination,
                itemRender: itemRender,
                className: 'custom-pagination',
              }
        }
        loading={loading}
        scroll={scroll}
        {...props}
        locale={{
          emptyText: <NoData />,
        }}
      />
    </>
  );
};

export default TableTrade;
