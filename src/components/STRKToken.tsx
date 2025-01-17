import CustomImage from './custom/CustomImage';

const STRKToken = ({ width = 24, height = 24 }: any) => {
  return (
    <CustomImage
      className='relative rounded-[50%] object-cover'
      width={width}
      height={height}
      alt=''
      src='/images/wallet/strk.png'
    />
  );
};
export default STRKToken;
