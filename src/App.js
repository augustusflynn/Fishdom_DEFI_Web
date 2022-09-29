import { Web3ReactProvider } from "@web3-react/core";

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

function App() {
  return (
    <Web3ReactProvider connectors={connectors}>
      <BrowserRouter>
        <ScrollTop />
        <Routes>{RenderRoutes(listRoute)}</Routes>
      </BrowserRouter>
    </Web3ReactProvider>
  );
}
export default App;
