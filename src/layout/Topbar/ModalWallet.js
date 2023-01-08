import { message, Modal } from "antd";
import React, { useEffect, useState } from "react";
import MetaMaskSelect from "./MetaMaskSelect.js";
import WalletConnect from "./WalletConnect";
import { connectorsByName } from '../../connector';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import {
	URI_AVAILABLE
} from '@web3-react/walletconnect-connector';
import { useEagerConnect, useInactiveListener } from '../../hooks';
import * as MetaMaskFunctions from '../../metamask';
import chains from '../../chains';
import axios from "axios";
import { user } from "src/redux/actions/index.js";
import { useDispatch, useSelector } from "react-redux";
import { user$ } from "src/redux/selectors/index.js";
import _ from "lodash";

function ModalWallet(props) {
	const { isModalVisible, hideWallet } = props;

	const [selectedWallet, setSelectedWallet] = useState(localStorage.getItem('selectedWallet'))

	const context = useWeb3React();
	const {
		connector,
		activate,
		deactivate,
		error,
		active
	} = context;

	// handle logic to recognize the connector currently being activated
	const [activatingConnector, setActivatingConnector] = React.useState();
	React.useEffect(() => {
		console.log('running');
		if (activatingConnector && activatingConnector === connector) {
			setActivatingConnector(undefined);
		}
	}, [activatingConnector, connector]);

	React.useEffect(() => {
		const REQUIRED_CHAIN = chains.find(chain => chain.chainId === parseInt(process.env.REACT_APP_NETWORK_ID));
		if (error && error instanceof UnsupportedChainIdError) {
			MetaMaskFunctions.switchChain('0x' + Number(REQUIRED_CHAIN.chainId).toString(16)).catch(error => {
				if (error.code === 4902) {
					MetaMaskFunctions.addChain({
						chainId: '0x' + REQUIRED_CHAIN.chainId.toString(16),
						chainName: REQUIRED_CHAIN.chainName,
						nativeCurrency: REQUIRED_CHAIN.nativeCurrency,
						rpcUrls: REQUIRED_CHAIN.rpcUrls,
						blockExplorerUrls: REQUIRED_CHAIN.blockExplorerUrls,
					}).catch(err => {
						alert('Cannot add ' + REQUIRED_CHAIN.chainName + ' to your MetaMask');
					});
				}
			});
		}

		return () => { };
	}, [error]);

	// handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
	const triedEager = useEagerConnect();

	// handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
	useInactiveListener(!triedEager || !!activatingConnector);

	React.useEffect(() => {
		console.log('running');
		const logURI = uri => {
			console.log('WalletConnect URI', uri);
		};
		connectorsByName.WalletConnect.on(URI_AVAILABLE, logURI);

		return () => {
			connectorsByName.WalletConnect.off(URI_AVAILABLE, logURI);
		};
	}, []);

	const onDeactivate = () => {
		deactivate()
		setActivatingConnector(undefined);
		localStorage.removeItem('selectedWallet')
		setSelectedWallet(undefined)
	}

	return (
		<Modal
			className="modal-wallet"
			title={null}
			visible={isModalVisible}
			onCancel={hideWallet}
			footer={null}
			closable={false}
		>
			<div>
				<div className="back" onClick={hideWallet}>
					<div className="icon-back"></div>
					<span>Go Back</span>
				</div>
				<div className="header">
					<span>Choose Your Wallet </span>
				</div>
				<div className="content">
					<MetaMaskSelect
						onClick={() => {
							if (active) {
								onDeactivate()
							} else {
								setActivatingConnector(connectorsByName['Injected']);
								activate(connectorsByName["Injected"]);
								localStorage.setItem('selectedWallet', 'Injected')
								setSelectedWallet("Injected")
							}
						}}
						isActive={active && selectedWallet && selectedWallet === "Injected"}
					/>
					<WalletConnect
						onClick={() => {
							if (active) {
								onDeactivate()
							} else {
								setActivatingConnector(connectorsByName["WalletConnect"]);
								activate(connectorsByName["WalletConnect"]);
								localStorage.setItem('selectedWallet', 'WalletConnect')
								setSelectedWallet("WalletConnect")
							}
						}}
						isActive={active && selectedWallet && selectedWallet === "WalletConnect"}
					/>
				</div>
			</div>
		</Modal>
	);
}
export default ModalWallet;
