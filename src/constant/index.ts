export const FE_URL = process.env.NEXT_PUBLIC_FE_URL;
export const BE_URL = process.env.NEXT_PUBLIC_BE_URL;
export const RPC_URL =
  process.env.NEXT_PUBLIC_RPC_URL ||
  'https://starknet-sepolia.public.blastapi.io/rpc/v0_7';
export const DISCORD_CLIENT_ID =
  process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || '1234567890';
export const TWITTER_CLIENT_ID =
  process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID || '1234567890';

export const DEFAULT_IMAGE = '/images/logo.webp';

export const COLOR_PRIMARY = '#341CFF';
export const numberRegexQuantity = /^\d+$/;

export enum ORDER_TYPE {
  BUY,
  SELL,
}

export enum PRICE_TYPE {
  FIXED,
  FLEXIBLE,
  }

export enum ORDER_TYPE_FOR_USER {
  SELL,
  BUY,
}

export enum ORDER_MATCH_TYPE {
  PARTIAL,
  FULL,
}

export enum ORDER_STATUS {
  CANCEL,
  ACTIVE,
}

export const ACCESS_TOKEN = 'access_token';
export const REFRESH_TOKEN = 'refresh_token';

export const STARKNET_OFFSET = 10 ** 18;

export const STARKNET_STRK_ADDRESS =
  '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d';

export const router_contract_address =
  '0x06bfd251dae01b9169cc96607d8d3bb46b039fde1757f4f86739442e3039ff74';
