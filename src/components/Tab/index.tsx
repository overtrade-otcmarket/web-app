import { useRouter } from 'next/navigation';
import React from 'react';

interface ITab {
  tabData: { id: number; title: string }[];
  activeTab: number;
}

const Tab = ({ tabData, activeTab }: ITab) => {
  const router = useRouter();

  return (
    <div className={`grid grid-cols-2 text-center text-[24px] font-[400]`}>
      {tabData.map((item) => (
        <div
          key={item.id}
          className={`${activeTab === item.id && '!text-tertiary !border-tertiary'} font-godOfWar hover:text-tertiary cursor-pointer border-b-[2px] border-[#ECC3C3] px-[5rem] py-[12px] text-[#C08F8F] transition-all`}
          onClick={() => {
            router.push('?tab=' + item.title.toLowerCase());
          }}
        >
          <p className='active:translate-y-[8%]'>{item.title}</p>
        </div>
      ))}
    </div>
  );
};

export default Tab;
