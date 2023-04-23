import "antd/dist/antd.min.css";
import "./assets/font/font.scss";
import "./styles/index.scss";

import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { applyMiddleware, compose, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import App from "./App";
import reducers from "./redux/reducers";
import reportWebVitals from "./reportWebVitals";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

require("dotenv").config();

const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(sagaMiddleware)) // Add extensions to check data on Chrome Redux Extension
);

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 8000;
  return library;
}

ReactDOM.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <Provider store={store}>
      <App />
    </Provider>
  </Web3ReactProvider>,
  document.getElementById("root")
);
reportWebVitals();
