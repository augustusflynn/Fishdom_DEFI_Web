import { Button, Form, message, Modal } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { user, wallet } from "src/redux/actions/index.js";
import { user$, wallet$ } from "src/redux/selectors/index.js";
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

function ModalWallet(props) {
	const { isModalVisible, hideWallet } = props;

	const walletConnect = useSelector(wallet$)
	const userData = useSelector(user$)
	const dispatch = useDispatch()
	const [selectedWallet, setSelectedWallet] = useState(localStorage.getItem('selectedWallet'))

	const context = useWeb3React();
	const {
		connector,
		activate,
		deactivate,
		account,
		error,
		library
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
		const REQUIRED_CHAIN = chains.find(chain => chain.chainId === (process.env.NODE_ENV === 'production' ? 56 : 97));
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
		const login = (walletAddress) => {
			axios.post(process.env.REACT_APP_API_URL + '/api/users/login', { walletAddress: walletAddress })
				.then((res) => {
					if (res.data && res.data.msg === "NOT_FOUND") {
						// fix sau :D
					} else {
						dispatch(user.setUser({
							...res.data.user,
							token: res.data.token
						}));
					}
				})
				.catch(err => {
					console.log('login error')
				})
		}

		if (!(!triedEager || !!activatingConnector) && library) {
			let walletData = library
				.getSigner(account)
			login(walletData._address);
			dispatch(wallet.walletSetData(walletData));
		}
	}, [triedEager, activatingConnector])

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

	async function handleRegister(data) {
		await axios.post(
			`${process.env.REACT_APP_API_URL}/api/users/register`,
			{
				...data,
				walletAddress: walletConnect._address
			}
		).then((res) => {
			console.log(res.data);
			dispatch(user.setUser(res.data))
		}).catch(err => {
			message.error("Register failed. Please try again")
		});
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
							if (selectedWallet && selectedWallet === "Injected") {
								deactivate()
							} else {
								setActivatingConnector(connectorsByName['Injected']);
								activate(connectorsByName["Injected"]);
								localStorage.setItem('selectedWallet', 'Injected')
								setSelectedWallet("Injected")
							}
						}}
						isActive={selectedWallet && selectedWallet === "Injected"}
					/>
					<WalletConnect
						onClick={() => {
							if (selectedWallet && selectedWallet === "WalletConnect") {
								deactivate()
							} else {
								setActivatingConnector(connectorsByName["WalletConnect"]);
								activate(connectorsByName["WalletConnect"]);
								localStorage.setItem('selectedWallet', 'WalletConnect')
								setSelectedWallet("WalletConnect")
							}
						}}
						isActive={selectedWallet && selectedWallet === "WalletConnect"}
					/>
				</div>
				{
					walletConnect && Object.keys(userData).length === 0 ? (
						<div>
							<Form
								layout="vertical"
								onFinish={handleRegister}
							>
								<Form.Item
									label="Name"
									name="name"
									required
									rules={[{
										required: true, message: "Please fill in input"
									}]}
								>

									<input className="input-max-modal" />
								</Form.Item>
								<Form.Item
									label="Password"
									name="password"
									required
									rules={[{
										required: true, message: "Please fill in input"
									}]}
								>
									<input type={"password"} className="input-max-modal" />
								</Form.Item>

								<Form.Item>
									<Button className="mt-1" htmlType="submit" type="primary">Submit</Button>
								</Form.Item>
							</Form>
						</div>
					) : (
						<></>
					)
				}
			</div>
		</Modal>
	);
}
export default ModalWallet;
