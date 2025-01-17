import {
  fetchListActivities,
  fetchListOrder,
  fetchListUserActivities,
  fetchUserOrder,
} from '@/service/token';
import { useQuery } from '@tanstack/react-query';

export const useGetListOrder = ({ enabled, ...params }: any) => {
  return useQuery({
    queryKey: ['list-order', params],
    queryFn: () => fetchListOrder(params),
    enabled,
  });
};

export const useGetUserOrder = ({ isAuthenticated, ...params }: any) => {
  return useQuery({
    queryKey: ['user-order', params, isAuthenticated],
    queryFn: () => fetchUserOrder(params),
    enabled: isAuthenticated,
  });
};

export const useGetListActivities = (params: any) => {
  return useQuery({
    queryKey: ['list-activities', params],
    queryFn: () => fetchListActivities(params),
  });
};

export const useGetUserActivities = ({ isAuthenticated, ...params }: any) => {
  return useQuery({
    queryKey: ['user-activities', params, isAuthenticated],
    queryFn: () => fetchListUserActivities(params),
    enabled: isAuthenticated,
  });
};
