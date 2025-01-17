import { fetchAllTxs, fetchListPool, fetchNewTxs } from '@/service/pool';
import { useQuery } from '@tanstack/react-query';

export const useGetListPool = ({ ...params }: any) => {
  return useQuery({
    queryKey: ['poolList', params],
    queryFn: async (data) => {
      try {
        return fetchListPool(params);
      } catch (error) {
        console.log(error);
      }
    },
  });
};

export const useGetListTxs = ({ enabled, ...params }: any) => {
  return useQuery({
    queryKey: ['allTxsList', params],
    queryFn: async (data) => {
      try {
        return fetchAllTxs(params);
      } catch (error) {
        console.log(error);
      }
    },
    enabled,
  });
};

export const useGetNewTxs = ({ ...params }: any) => {
  return useQuery({
    queryKey: ['newTxsList', params],
    queryFn: async (data) => {
      try {
        return fetchNewTxs(params);
      } catch (error) {
        console.log(error);
      }
    },
  });
};
