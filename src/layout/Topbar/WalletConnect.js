import { useWeb3React } from '@web3-react/core';
import React from 'react';
import IconWalletConnect from '../../assets/png/topbar/walletconnect-logo.png';
import { hooks, walletConnect } from '../../connectors/walletConnect';
import { METAMASK_CONNECT, WALLET_CONNECT } from "../../constants/apiContants";
import { chanId } from '../../constants/index.js';

const { useIsActive } = hooks;

function WalletConnect() {
    const { connector } = useWeb3React()
    const isActive = useIsActive();

    return (
        <div className={`item-wallet`}>

            <div className="wallet">
                <img src={IconWalletConnect} />
                <span>WalletConnect</span>
            </div>

            <div className="connect"
                onClick={() => {
                    localStorage.setItem(METAMASK_CONNECT, "");
                    localStorage.setItem(WALLET_CONNECT, '');
                    connector.deactivate();
                    if (!isActive)
                        walletConnect.activate(chanId)

                }}
            >
                <div className="icon-connect"></div>
                {isActive ?
                    <span>{'DisConnect'}</span>
                    :
                    <span>{'Connect'}</span>
                }
            </div>
        </div>

    );
}
export default WalletConnect;
