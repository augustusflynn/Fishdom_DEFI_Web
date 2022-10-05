import { Web3ReactProvider } from "@web3-react/core";

import { Web3Provider } from '@ethersproject/providers';

import { BrowserRouter, Routes } from "react-router-dom";
import ScrollTop from "./component/ScrollTop";
import listRoute, { RenderRoutes } from "./routes";
require("dotenv").config();

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 8000;
  return library;
}

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <BrowserRouter>
        <ScrollTop />
        <Routes>{RenderRoutes(listRoute)}</Routes>
      </BrowserRouter>
    </Web3ReactProvider>
  );
}
export default App;
