import React from 'react';
import IconWalletConnect from '../../assets/png/topbar/walletconnect-logo.png';

function WalletConnect({
    onClick, isActive
}) {
    return (
        <div className={`item-wallet`}>
            <div className="wallet">
                <img src={IconWalletConnect} />
                <span>Wallet Connect</span>
            </div>

            <div className="connect"
                onClick={onClick}
            >
                <div className="icon-connect"></div>
                {isActive ?
                    <span>{'Disconnect'}</span>
                    :
                    <span>{'Connect'}</span>
                }
            </div>
        </div>

    );
}
export default WalletConnect;
