import { NumericFormat } from 'react-number-format';
import cx from 'classnames';
import SmallNumber from './SmallNumber';
import { formatBigNumber } from '@/utils';

const FormatPrice = ({
  number,
  className,
  prefix = '',
}: {
  number: number | string;
  className?: string;
  prefix?: string;
}) => {
  return (
    <div className={cx('inline-flex', className)}>
      {Number(number) >= 10000 && (
        <div>{`${prefix}${formatBigNumber(number)}`}</div>
      )}
      {Number(number) < 1000 && <SmallNumber number={number} prefix={prefix} />}
      {Number(number) >= 1000 && Number(number) < 10000 && (
        <NumericFormat
          value={Number(number)}
          displayType='text'
          thousandSeparator=','
          decimalScale={2}
          prefix={prefix}
        />
      )}
    </div>
  );
};
export default FormatPrice;
