import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constant';
import { setToken } from '@/service/api';
import useStore from '@/store';
import { deleteData } from '@/utils/localStorage';
import { useAccount, useDisconnect } from '@starknet-react/core';

const useApplication = () => {
  const { disconnect } = useDisconnect();
  const setIsAuthenticated = useStore((state) => state.setIsAuthenticated);
  const setCurrentConnectedAccount = useStore(
    (state) => state.setCurrentConnectedAccount
  );

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentConnectedAccount('');
    disconnect();
    setToken(undefined);
    deleteData(ACCESS_TOKEN);
    deleteData(REFRESH_TOKEN);
  };

  return { handleLogout };
};

export default useApplication;
