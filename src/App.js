import { useWeb3React, Web3ReactProvider } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import { WalletConnect } from "@web3-react/walletconnect";
import Moralis from "moralis";
import { useEffect } from "react";
import { BrowserRouter, Routes } from "react-router-dom";
import ScrollTop from "./component/ScrollTop";
import { hooks as metaMaskHooks, metaMask } from "./connectors/metaMask";
import {
  hooks as walletConnectHooks,
  walletConnect,
} from "./connectors/walletConnect";
import listRoute, { RenderRoutes } from "./routes";
require("dotenv").config();
const connectors = [
  [metaMask, metaMaskHooks],
  [walletConnect, walletConnectHooks],
];
function getName(connector) {
  if (connector instanceof MetaMask) return "MetaMask";
  if (connector instanceof WalletConnect) return "WalletConnect";
  return "Unknown";
}
function Child() {
  const { connector } = useWeb3React();
  console.log(`Priority Connector is: ${getName(connector)}`);
  return null;
}
function App() {
  const serverUrl = process.env.REACT_APP_MORALIS_URL;
  const appId = process.env.REACT_APP_MORALIS_APP_ID;
  const masterKey = process.env.REACT_APP_MORALIS_MASTER_KEY;
  Moralis.start({ serverUrl, appId, masterKey });
  useEffect(() => {
    // localStorage.removeItem("sell");
    // localStorage.removeItem("market");
    // localStorage.removeItem("claimStaking");
    // localStorage.removeItem("withdraw");
    // localStorage.removeItem("claimMining");
  }, []);

  return (
    <Web3ReactProvider connectors={connectors}>
      <Child />
      <BrowserRouter>
        <ScrollTop />
        <Routes>{RenderRoutes(listRoute)}</Routes>
      </BrowserRouter>
    </Web3ReactProvider>
  );
}
export default App;
