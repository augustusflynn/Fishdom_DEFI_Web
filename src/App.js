

import { useWeb3React } from "@web3-react/core";
import { message } from "antd";
import axios from "axios";
import _ from "lodash";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Routes } from "react-router-dom";
import ScrollTop from "./component/ScrollTop";
import { user } from "./redux/actions";
import { user$ } from "./redux/selectors";
import listRoute, { RenderRoutes } from "./routes";
require("dotenv").config();

function App() {
  const { active, library, chainId, account, activate } = useWeb3React()
  const dispatch = useDispatch()
  const userData = useSelector(user$)
  const SIGN_MESSAGE = `Hello!! Welcome to Fishdom DEFI, ${account}`

  const login = (signature) => {
    axios.post(
      process.env.REACT_APP_API_URL + '/api/users/login',
      {
        walletAddress: account,
        signature: signature,
        message: SIGN_MESSAGE,
        chainId: chainId
      })
      .then((res) => {
        if (res.data && res.data.msg === "INVALID_SIGNER") {
          message.error("Invalid signature")
        } else {
          dispatch(user.setUser({
            ...res.data.user,
            token: res.data.token
          }));
        }
      })
      .catch(() => {
        console.log('login error')
      })
  }

  useEffect(() => {
    if (active && _.isEmpty(userData)) {
      library.getSigner(account)
        .signMessage(SIGN_MESSAGE)
        .then(login)
    }
  }, [active, userData])

  return (
    <BrowserRouter>
      <ScrollTop />
      <Routes>{RenderRoutes(listRoute)}</Routes>
    </BrowserRouter>
  );
}
export default App;
