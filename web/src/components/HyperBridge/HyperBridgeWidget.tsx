import { useRef, useEffect } from "react";
import {
  LiFiWidget,
  ChainType,
  type FormState,
  type WidgetConfig,
} from "@lifi/widget";
import { useActiveAccount } from "thirdweb/react";
import { HYPER_EVM, INTEGRATOR } from "./constants";

// LI.FI Widget Configuration
// Docs: https://docs.li.fi/widget/configuration/widget-configuration
const widgetConfig: WidgetConfig = {
  integrator: INTEGRATOR,
  toChain: HYPER_EVM.chainId,
  chains: {
    deny: [], // Allow all chains as source
  },
  // Docs: https://docs.li.fi/widget/configuration/widget-configuration#hidden-ui
  hiddenUI: ["toAddress"], // Hide toAddress since we auto-set it
  appearance: "dark",
  // Docs: https://docs.li.fi/widget/configuration/widget-configuration#variant
  // Use 'expandable' variant so the widget expands content instead of paginating
  variant: "expandable",
  // Docs: https://docs.li.fi/widget/configuration/widget-configuration#subvariant
  subvariant: "default",
  // Docs: https://docs.li.fi/widget/configuration/widget-configuration#theme
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

export default function HyperBridgeWidget() {
  // Docs: https://docs.li.fi/widget/configuration/form-management
  const formRef = useRef<FormState | null>(null);
  const account = useActiveAccount();

  useEffect(() => {
    if (!account) {
      return;
    }

    // Auto-set destination address to connected wallet
    formRef.current?.setFieldValue(
      "toAddress",
      { address: account.address, chainType: ChainType.EVM },
      { setUrlSearchParam: true }
    );

    // Lock destination chain to HyperEVM
    formRef.current?.setFieldValue("toChain", HYPER_EVM.chainId, {
      setUrlSearchParam: true,
    });
  }, [account]);

  return (
    <LiFiWidget integrator={INTEGRATOR} config={widgetConfig} formRef={formRef} />
  );
}
