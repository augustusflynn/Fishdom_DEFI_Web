import "antd/dist/antd.min.css";
import "./assets/font/font.scss";
import "./styles/index.scss";
import ReactDOM from "react-dom";
import { MoralisProvider } from "react-moralis";
import { Provider } from "react-redux";
import { applyMiddleware, compose, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import App from "./App";
import reducers from "./redux/reducers";
import mySaga from "./redux/saga";
import reportWebVitals from "./reportWebVitals";
require("dotenv").config();
const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(sagaMiddleware)) // Add extensions to check data on Chrome Redux Extension
);
sagaMiddleware.run(mySaga);
ReactDOM.render(
  <MoralisProvider
    appId={process.env.REACT_APP_MORALIS_APP_ID}
    serverUrl={process.env.REACT_APP_MORALIS_URL}
  >
    <Provider store={store}>
      <App />
    </Provider>
  </MoralisProvider>,
  document.getElementById("root")
);
reportWebVitals();
