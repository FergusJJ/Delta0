import { useRef } from "react";
import { LiFiWidget, ChainType, type FormState, type WidgetConfig } from "@lifi/widget";

const widgetConfig: WidgetConfig = {
  fromChain: 137,
  toChain: 10,
  fromToken: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
  toToken: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
  fromAmount: 10,
  toAddress: {
    address: "0x29DaCdF7cCaDf4eE67c923b4C22255A4B2494eD7",
    chainType: ChainType.EVM,
  },
};

export default function Widget() {
  const formRef = useRef<FormState | null>(null);

  const handleClick = () => {
    formRef.current?.setFieldValue("fromChain", 10, { setUrlSearchParam: true });
  };

  return (
    <>
      <LiFiWidget integrator="Your dApp/company name" config={widgetConfig} formRef={formRef} />
      <button onClick={handleClick} type="button">
        Set fromChain to Optimism
      </button>
    </>
  );
}
