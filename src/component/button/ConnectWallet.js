
import React, { Fragment, useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { wallet$ } from "../../redux/selectors";

import IconWallet from "../../assets/png/topbar/icon-wallet-white.svg";
import ModalWallet from "src/layout/Topbar/ModalWallet";


function ConnectWallet(props) {
    let { classButton } = props;
    // const walletConnect = useSelector(wallet$);
    const [isShowWallet, setShowWallet] = useState(false);
    classButton += ' wallet-button-default'

    // useEffect(() => {
    //     if (walletConnect) {
    //         hideWallet();
    //     }
    // }, [walletConnect]);

    const showWallet = () => {
        setShowWallet(true);
    };

    const hideWallet = () => {
        setShowWallet(false);
    };

    return (
        <Fragment>
            {isShowWallet ? (
                <ModalWallet
                    isModalVisible={isShowWallet}
                    hideWallet={hideWallet}
                />
            ) : null}
            <div className={classButton} onClick={showWallet}>
                <img src={IconWallet} />
                <span> Connect Wallet </span>
            </div>
        </Fragment>
    );
}
export default ConnectWallet;
