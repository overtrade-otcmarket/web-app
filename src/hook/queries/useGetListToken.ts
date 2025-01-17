import {
  fetchListOrder,
  fetchListToken,
  fetchPoolDetail,
  fetchTokenDetail,
  fetchTokenPrice,
} from '@/service/token';
import { useQuery } from '@tanstack/react-query';

export const useGetListToken = ({ open, ...params }: any) => {
  return useQuery({
    queryKey: ['tokenList', params],
    queryFn: async (data) => {
      try {
        return fetchListToken(params);
      } catch (error) {
        console.log(error);
      }
    },
    enabled: open,
  });
};

export const useGetTokenDetail = ({ open, ...params }: any) => {
  return useQuery({
    queryKey: ['tokenDetail', params],
    queryFn: async (data) => {
      try {
        return fetchTokenDetail(params);
      } catch (error) {
        console.log(error);
      }
    },
    enabled: open,
  });
};

export const useGetTokenPrice = ({ tokenAddress }: any) => {
  return useQuery({
    queryKey: ['tokenPrice', { tokenAddress }],
    queryFn: async (data) => {
      try {
        return fetchTokenPrice({ tokenAddress });
      } catch (error) {
        console.log(error);
      }
    },
    enabled: !!tokenAddress,
  });
};

export const useGetPoolDetail = ({ ...params }: any) => {
  return useQuery({
    queryKey: ['poolDetail', params],
    queryFn: async (data) => {
      try {
        return fetchPoolDetail(params);
      } catch (error) {
        console.log(error);
      }
    },
    enabled: !!params?.token0,
  });
};
