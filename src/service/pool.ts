import AxiosInstance from './api';

export const fetchListPool = async (data?: any) => {
  const res = await AxiosInstance.get('/pool/list-pool', {
    params: data,
  });
  return res.data;
};

export const fetchAllTxs = async (data?: any) => {
  const res = await AxiosInstance.get('/orders/all-activity', {
    params: data,
  });
  return res.data;
};

export const fetchNewTxs = async (data?: any) => {
  const res = await AxiosInstance.get('/orders/new-activity', {
    params: data,
  });
  return res.data;
};
