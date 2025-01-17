import {
  router_contract_address,
  STARKNET_OFFSET,
  STARKNET_STRK_ADDRESS,
} from '@/constant';
import { checkTxsSuccess, getContract } from '@/utils';
import { useAccount, useProvider } from '@starknet-react/core';
import { cairo, CallData } from 'starknet';
import BigNumber from 'bignumber.js';

const useStarknet = () => {
  const { account } = useAccount() as any;
  const { provider } = useProvider();

  const createOffer = async (data: any) => {
    const token_contract_address = data?.tokenAddress;
    const router = await getContract(provider, router_contract_address);
    const pair_raw = await router.get_pair(
      token_contract_address,
      data?.asset_id
    );
    const pair_contract = '0x' + pair_raw.toString(16);

    const price_info = await router.get_market_price(data?.asset_id);
    const price_pair = Number(price_info[0]);
    const decimals = Number(price_info[1]);
    const negative = Number(price_info[2]);

    const market_price =
      price_pair * 10 ** (negative ? decimals : -1 * decimals);

    const price = data?.isDC
      ? new BigNumber(market_price)
          .multipliedBy(100 - data?.DCValue)
          .dividedBy(100)
          .multipliedBy(STARKNET_OFFSET)
          .toFixed(0)
      : new BigNumber(data?.price).multipliedBy(STARKNET_OFFSET).toFixed(0);

    const amount = new BigNumber(data?.amount)
      .multipliedBy(STARKNET_OFFSET)
      .toFixed(0);

    const res = await account.execute([
      {
        contractAddress:
          data?.typeOrder == 'buy'
            ? STARKNET_STRK_ADDRESS
            : token_contract_address,
        entrypoint: 'approve',
        calldata: CallData.compile({
          spender: pair_contract,
          amount: cairo.uint256(
            data?.typeOrder == 'buy'
              ? new BigNumber(price).multipliedBy(data?.amount).toFixed(0)
              : amount
          ),
        }),
      },
      {
        contractAddress: router_contract_address,
        entrypoint: 'make_offer',
        calldata: CallData.compile({
          asset_id: data?.asset_id,
          token: token_contract_address,
          action: data?.typeOrder == 'buy' ? true : false,
          fill: data?.typeMatch == 'full' ? false : true,
          amount: cairo.uint256(amount),
          price_type: data?.isDC,
          price: cairo.uint256(data?.isDC ? 100 - data?.DCValue : price),
          expired: data?.expired,
        }),
      },
    ]);

    const receipt = await provider.waitForTransaction(res?.transaction_hash);
    return checkTxsSuccess(receipt);
  };

  const cancelOffer = async (data: any) => {
    const token_contract_address = data?.tokenAddress;
    const res = await account.execute([
      {
        contractAddress: router_contract_address,
        entrypoint: 'cancel_offer',
        calldata: CallData.compile({
          offer_id: cairo.uint256(data?.offerId),
          token: token_contract_address,
        }),
      },
    ]);

    const receipt = await provider.waitForTransaction(res?.transaction_hash);
    return checkTxsSuccess(receipt);
  };

  const acceptOffer = async (data: any) => {
    const token_contract_address = data?.tokenAddress;
    const router = await getContract(provider, router_contract_address);

    const pair_raw = await router.get_pair(
      token_contract_address,
      data?.asset_id
    );
    const pair_contract = '0x' + pair_raw.toString(16);

    const price = new BigNumber(data?.price)
      .multipliedBy(STARKNET_OFFSET)
      .multipliedBy(1.01)
      .toFixed(0);

    const amount = new BigNumber(data?.amount)
      .multipliedBy(STARKNET_OFFSET)
      .toFixed(0);

    const res = await account.execute([
      {
        contractAddress:
          data?.typeOrder == 'sell'
            ? STARKNET_STRK_ADDRESS
            : token_contract_address,
        entrypoint: 'approve',
        calldata: CallData.compile({
          spender: pair_contract,
          amount: cairo.uint256(
            data?.typeOrder == 'sell'
              ? new BigNumber(price).multipliedBy(data?.amount).toFixed(0)
              : amount
          ),
        }),
      },
      {
        contractAddress: router_contract_address,
        entrypoint: 'match_offer',
        calldata: CallData.compile({
          offer_id: cairo.uint256(data?.offerId),
          token: token_contract_address,
          amount: cairo.uint256(amount),
        }),
      },
    ]);

    const receipt = await provider.waitForTransaction(res?.transaction_hash);
    return checkTxsSuccess(receipt);
  };

  return { createOffer, cancelOffer, acceptOffer };
};

export default useStarknet;
