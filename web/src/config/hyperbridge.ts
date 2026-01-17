import { type WidgetConfig, ChainId, type BaseToken } from "@lifi/widget";
import { INTEGRATOR } from "../constants/hyperbridge";
//import { TestnetChainId } from "../constants/chains";
import TokenNameAddressMapping from "@constants/tokens";
import TokenNameAdressMapping from "@constants/tokens";
/*
 *
 * To chains:
 *  - HYPER_EVM (mainnet test net), usol, eth, ubtc,
 *  -
 * */

const tokenWhitelist: BaseToken[] = [
  {
    address: TokenNameAddressMapping[ChainId.HYP].UETH,
    chainId: ChainId.HYP,
  },
  {
    address: TokenNameAddressMapping[ChainId.HYP].USOL,
    chainId: ChainId.HYP,
  },
  {
    address: TokenNameAdressMapping[ChainId.HYP].UBTC,
    chainId: ChainId.HYP,
  },
  {
    address: TokenNameAdressMapping[ChainId.HYP].WHYPE,
    chainId: ChainId.HYP,
  },
];
//
// keep in sync with getChainNameFromId
const chainWhitelist: Array<ChainId> = [
  ChainId.ETH, // Ethereum
  ChainId.POL, // Polygon
  ChainId.BSC, // BNB Chain
  ChainId.ARB, // Arbitrum
  ChainId.OPT, // Optimism
  ChainId.BAS, // Base
  ChainId.AVA, // Avalanche
  ChainId.LNA, // Linea
  ChainId.ERA, // zkSync Era
  ChainId.SCL, // Scroll
  ChainId.BLS, // Blast
  ChainId.MNT, // Mantle
  ChainId.DAI, // Gnosis

  ChainId.HYP,

  // Non-EVM
  ChainId.SOL,
  ChainId.BTC,
  ChainId.SUI,
];

//const testnetWhitelist: Array<TestnetChainId> = [
//  TestnetChainId.SEP,
//  TestnetChainId.HYPE_T,
//];

// Docs: https://docs.li.fi/widget/configure-widget
const widgetConfig: WidgetConfig = {
  integrator: INTEGRATOR,
  toChain: ChainId.HYP,
  chains: {
    allow: [], // [...testnetWhitelist], //[...chainWhitelist, ...testnetWhitelist],
    deny: [], // Allow all chains as source
  },
  tokens: {
    // allow to eth, btc, sol on HYP
    to: {
      allow: tokenWhitelist,
    },
    from: {
      allow: [...tokenWhitelist],
    },
  },
  // Docs: https://docs.li.fi/widget/configuration/widget-configuration#hidden-ui
  // hiddenUI: ["toAddress"], // Hide toAddress since we auto-set it
  appearance: "dark",
  variant: "compact",
  // https://docs.li.fi/widget/select-widget-variants
  subvariant: "default",
  // Docs: https://docs.li.fi/widget/configure-widget/widget-configuration#theme
  theme: {
    palette: {
      primary: { main: "#00c853" },
      secondary: { main: "#7c3aed" },
    },
    container: {
      boxShadow: "none",
      borderRadius: "16px",
      // Remove default max height to allow full expansion
      maxHeight: "none",
      height: "auto",
    },
  },
};

export default widgetConfig;
