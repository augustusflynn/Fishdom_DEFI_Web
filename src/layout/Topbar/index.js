import { DownOutlined } from "@ant-design/icons";
import { useWeb3React } from "@web3-react/core";
import { message } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import IconWallet from "../../assets/png/topbar/icon-wallet-white.svg";
import Container from "../grid/Container";
import MenuTop from "./MenuTop";
import ModalWallet from "./ModalWallet";
import { useDispatch } from 'react-redux'
import { user } from "src/redux/actions/index.js";

function Topbar() {
  const navigate = useNavigate();
  const { library, account, active, chainId } = useWeb3React();
  const SIGN_MESSAGE = `Hello!! Welcome to Fishdom DEFI, ${account}`
  const dispatch = useDispatch()

  const [isShowWallet, setShowWallet] = useState(false);

  const goHome = () => {
    navigate("/");
  };

  const showWallet = () => {
    setShowWallet(true);
  };

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

  const onGetAccount = () => {
    library.getSigner(account)
      .signMessage(SIGN_MESSAGE)
      .then(login)
  }

  return (
    <Container>
      <div id="menu">
        <div className="logo logo-pc" onClick={goHome} data-aos="fade-down" />
        <div className="top-layout" data-aos="fade-right">
          {isShowWallet ? (
            <ModalWallet
              isModalVisible={isShowWallet}
              hideWallet={() => setShowWallet(false)}
            />
          ) : null}
          <MenuTop />
          {!active ? (
            <div className="wallet-button" onClick={showWallet}>
              <img src={IconWallet} />
              <span> Connect Wallet </span>
            </div>
          ) : (
            <div className="wallet-address">
              <img src={IconWallet} />

              <p>{account}</p>
              <DownOutlined />
              <div className="tooltip">
                <span onClick={showWallet}>Switch Wallet</span>
                <span onClick={onGetAccount}>Get Account</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}

export default Topbar;
