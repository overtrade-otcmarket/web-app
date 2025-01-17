import {
  fetchListOrder,
  fetchListToken,
  importToken,
  quoteToken,
} from '@/service/token';
import { messageError, messageSuccess } from '@/utils/message';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

export const useQuoteToken = ({ open, ...params }: any) => {
  return useQuery({
    queryKey: ['quoteToken', params],
    queryFn: async (data) => {
      try {
        return quoteToken(params);
      } catch (error) {
        console.log(error);
      }
    },
    enabled: open,
  });
};

export const useImportToken = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: importToken,
    onSuccess: () => {
      messageSuccess('Import token successfully');
    },
    onError: (error) => {
      console.log(error);
      messageError(error?.message || 'Import token failed');
    },
  });
};
