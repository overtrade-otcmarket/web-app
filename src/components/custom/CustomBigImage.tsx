import CustomImage, { ICustomImageProps } from './CustomImage';

const CustomBigImage = ({
  src,
  width,
  height,
  className,
  ...props
}: ICustomImageProps) => {
  return (
    <div
      style={{
        width: width + 'px',
        height: height + 'px',
      }}
      className='relative inline-block overflow-hidden'
    >
      <CustomImage
        width={width}
        height={height}
        src={src}
        className={`${className} absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`}
        {...props}
      />
    </div>
  );
};

export default CustomBigImage;
