import { DownOutlined } from "@ant-design/icons";
import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import IconWallet from "../../assets/png/topbar/icon-wallet-white.svg";
import { METAMASK_CONNECT, WALLET_CONNECT } from "../../constants/apiContants";
import { wallet$ } from "../../redux/selectors";
import BaseHelper from "../../utils/BaseHelper";
import Container from "../grid/Container";
import MenuTop from "./MenuTop";
import ModalWallet from "./ModalWallet";


function Topbar() {
  const navigate = useNavigate();
  const { connector } = useWeb3React();

  const [isShowWallet, setShowWallet] = useState(false);
  const [address, setAdress] = useState("no connect");
  const walletConnect = useSelector(wallet$);

  useEffect(() => {
    const getSigner = async () => {
      if (walletConnect) {
        const adress = await walletConnect.getAddress();
        setAdress(adress);
        hideWallet();
      } else {
        setAdress("");
      }
    };
    getSigner();
  }, [walletConnect]);

  const goHome = () => {
    navigate("/");
  };

  const showWallet = () => {
    setShowWallet(true);
  };

  const hideWallet = () => {
    setShowWallet(false);
  };

  const disconnectWallet = () => {
    localStorage.setItem(METAMASK_CONNECT, "");
    localStorage.setItem(WALLET_CONNECT, "");
    connector.deactivate();
    // dispatch(wallet.walletSetData(""));
    // deactivate();
  };

  // attempt to connect eagerly on mount
  useEffect(() => {
    // void metaMask.connectEagerly()
  }, []);

  return (
    <Container>
      <div id="menu">
        <div className="logo logo-pc" onClick={goHome} data-aos="fade-down" />
        <div className="top-layout" data-aos="fade-right">
          {isShowWallet ? (
            <ModalWallet
              isModalVisible={isShowWallet}
              hideWallet={hideWallet}
            />
          ) : null}
          <MenuTop />
          {!walletConnect ? (
            <div className="wallet-button" onClick={showWallet}>
              <img src={IconWallet} />
              <span> Connect Wallet </span>
            </div>
          ) : (
            <div className="wallet-address">
              <img src={IconWallet} />

              <p>{BaseHelper.shortTextAdress(address)}</p>
              <DownOutlined />
              <div className="tooltip">
                <span onClick={showWallet}>Switch Wallet</span>
                <span onClick={disconnectWallet}>Disconnect</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}

export default Topbar;
