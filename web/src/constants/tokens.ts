import { ChainId } from "@lifi/widget";

type tickerAddressMap = Record<string, `0x${string}`>;

const TokenNameAdressMapping: Record<typeof ChainId.HYP, tickerAddressMap> = {
  [ChainId.HYP]: {
    UETH: "0xbe6727b535545c67d5caa73dea54865b92cf7907",
  },
} as const;

export default TokenNameAdressMapping;
