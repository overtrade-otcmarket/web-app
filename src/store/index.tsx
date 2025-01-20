import { create } from 'zustand';

const useStore = create((set: any) => ({
  count: 0,
  setCount: (count: number) => set({ count }),
  profile: {},
  setProfile: (profile: any) => set({ profile }),
  strkPrice: 1,
  setStrkPrice: (strkPrice: any) => set({ strkPrice }),
  showModalConnectWallet: false,
  setShowModalConnectWallet: (showModalConnectWallet: boolean) =>
    set({ showModalConnectWallet }),
  showModalSuccess: false,
  setShowModalSuccess: (showModalSuccess: boolean) => set({ showModalSuccess }),
  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
  currentConnectedAccount: null as any,
  setCurrentConnectedAccount: (currentConnectedAccount: string) =>
    set({ currentConnectedAccount }),
  orderDetail: {} as any,
  setOrderDetail: (orderDetail: any) => set({ orderDetail }),
  selectedToken: undefined,
  setSelectedToken: (selectedToken: any) => set({ selectedToken }),
  showModalCreateOffer: false,
  setShowModalCreateOffer: (showModalCreateOffer: any) =>
    set({ showModalCreateOffer }),
  showModalTradeToken: false,
  setShowModalTradeToken: (showModalTradeToken: any) =>
    set({ showModalTradeToken }),
  showModalSelectToken: false,
  setShowModalSelectToken: (showModalSelectToken: any) =>
    set({ showModalSelectToken }),
}));

export default useStore;
