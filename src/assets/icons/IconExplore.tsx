import * as React from 'react';
import { SVGProps } from 'react';
const IconExplore = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={14}
    height={14}
    fill='none'
    {...props}
  >
    <path
      stroke='#1D1754'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='M1 13 13 1m0 0H4m9 0v9'
    />
  </svg>
);
export default IconExplore;
