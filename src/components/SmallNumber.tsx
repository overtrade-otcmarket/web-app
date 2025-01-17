import { formatSmallNumber } from '@/utils';
import cx from 'classnames';

const SmallNumber = ({
  number,
  className,
  prefix = '$',
}: {
  number: number | string;
  className?: string;
  prefix?: string;
}) => {
  return (
    <div className={cx('flex', className)}>
      {prefix}
      {formatSmallNumber(Number(number))?.first && (
        <div className='flex flex-row items-end'>
          <div>{`${formatSmallNumber(Number(number))?.first}.0`}</div>
          <div className='text-[0.7em] leading-normal'>
            {formatSmallNumber(Number(number))?.numberZero}
          </div>
          <div>{formatSmallNumber(Number(number))?.last}</div>
        </div>
      )}
      {!formatSmallNumber(Number(number))?.first && (
        <div>{`${formatSmallNumber(Number(number))}`}</div>
      )}
    </div>
  );
};
export default SmallNumber;
