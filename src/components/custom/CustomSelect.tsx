import React, { useState } from 'react';
import { Select, SelectProps } from 'antd';
import cx from 'classnames';
import IconArrowDown from '@/assets/icons/IconArrowDown';

const CustomSelect = ({ className, ...rest }: SelectProps) => {
  const [open, setOpen] = useState(false);
  return (
    <Select
      className={cx('custom-select', className)}
      suffixIcon={
        <IconArrowDown
          className={`${open && 'rotate-180'} transition-all`}
        />
      }
      bordered={false}
      popupClassName='custom-popup'
      onDropdownVisibleChange={(visible) => setOpen(visible)}
      {...rest}
    />
  );
};

export default CustomSelect;
