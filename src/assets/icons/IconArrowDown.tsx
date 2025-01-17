import * as React from 'react';
import { SVGProps } from 'react';
const IconArrowDown = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={25}
    height={24}
    fill='none'
    {...props}
  >
    <path
      stroke='#1D1754'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='m5.667 9 7 6 7-6'
    />
  </svg>
);
export default IconArrowDown;
