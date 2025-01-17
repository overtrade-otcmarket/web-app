import { Table, TableProps } from 'antd';
import React from 'react';

interface ICustomTable extends TableProps {}

const CustomTable = ({ ...props }: ICustomTable) => {
  return <Table {...props} />;
};

export default CustomTable;
