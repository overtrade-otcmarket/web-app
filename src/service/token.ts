import AxiosInstance from '@/service/api';

export const fetchListToken = async (data?: any) => {
  const res = await AxiosInstance.get('/token/get-list', {
    params: data,
  });
  return res.data;
};

export const fetchTokenDetail = async ({ tokenAddress, ...data }: any) => {
  const res = await AxiosInstance.get(`/token/get-token-info/${tokenAddress}`, {
    params: data,
  });
  return res.data;
};

export const fetchTokenPrice = async ({ tokenAddress, ...data }: any) => {
  const res = await AxiosInstance.get(`/token/get-token-price/${tokenAddress}`, {
    params: data,
  });
  return res.data;
};

export const fetchPoolDetail = async ({ ...data }: any) => {
  const res = await AxiosInstance.get(`/pool/detail-pool`, {
    params: data,
  });
  return res.data;
};

export const quoteToken = async (data?: any) => {
  const res = await AxiosInstance.get('/token/quote-token', {
    params: data,
  });
  return res.data;
};

export const importToken = async (tokenAddress?: any) => {
  const res = await AxiosInstance.post('/token/import-token', {
    tokenAddress,
  });
  return res.data;
};

export const fetchListOrder = async ({ tokenAddress, ...data }: any) => {
  const res = await AxiosInstance.get(`/orders/get-list/${tokenAddress}`, {
    params: data,
  });
  return res.data;
};

export const fetchUserOrder = async ({ ...data }: any) => {
  const res = await AxiosInstance.get(`/users/orders`, {
    params: data,
  });
  return res.data;
};

export const fetchListActivities = async ({ tokenAddress, ...data }: any) => {
  const res = await AxiosInstance.get(`/orders/order-activity`, {
    params: data,
  });
  return res.data;
};

export const fetchListUserActivities = async ({ ...data }: any) => {
  const res = await AxiosInstance.get(`/users/transactions`, {
    params: data,
  });
  return res.data;
};
