import { useWeb3React } from "@web3-react/core";
import { Layout, message } from "antd";
import AOS from "aos";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import CheckNetwork from "src/component/modal/CheckNetwork";
import ConnectMetamask from "../component/modal/ConnectMetamask";
import { hooks as hooksMetaMask, metaMask } from "../connectors/metaMask";
import {
	hooks as hooksWalletConnect,
	walletConnect,
} from "../connectors/walletConnect";
import { METAMASK_CONNECT, WALLET_CONNECT } from "../constants/apiContants";
import { user, wallet } from "../redux/actions";
import "./../../node_modules/aos/dist/aos.css";
import { SFEED_ANIMATION } from "./../constants/const";
import FooterLayout from "./FooterLayout";
import HeaderLayout from "./Topbar/index";
import TopbarMobile from "./TopbarMobile";
import axios from "axios";

const { useChainId, useError, useProvider } = hooksMetaMask;

const {
	useChainId: useChainIdW,
	useError: useErrorW,
	useProvider: useProviderW,
} = hooksWalletConnect;

const { Header, Content, Footer } = Layout;
function LayoutDefault() {
	const dispatch = useDispatch();
	const [isConnectMetaMask, setConnectMetaMask] = useState(false);
	const [isWrongNetWork, setIsWrongNetWork] = useState(false);
	const { connector } = useWeb3React();
	const provider = useProvider();
	const providerW = useProviderW();

	const errorW = useErrorW();
	const error = useError();

	const chainId = useChainId();
	const chainIdW = useChainIdW();

	// window.onbeforeunload = function () {
	//   window.scrollTo(0, 0);
	// };
	// window.onscroll = function (params) {
	//   const offetHeader =
	//     document.getElementById("header-checkscroll")?.offsetTop;
	//   if (offetHeader <= window.pageYOffset) {
	//     console.log("ok");
	//     const dropdown = document.getElementsByClassName(
	//       "ant-select-dropdown"
	//     )[0];
	//     if (dropdown) {
	//       dropdown.classList = "ant-select-dropdown-hidden";
	//     }
	//   }
	// };
	useEffect(() => {
		if (chainId && chainId != 97) {
			setIsWrongNetWork(true);
			localStorage.setItem(METAMASK_CONNECT, "");
			localStorage.setItem(WALLET_CONNECT, "");

			dispatch(wallet.walletSetData(null));
			connector.deactivate();
			message.error("Wrong network");
		} else if (chainId == 97) {
			setIsWrongNetWork(false);
		}
	}, [chainId, chainIdW]);
	//show error
	useEffect(() => {
		if (error) {
			console.log("bug metamask");
			console.log("error.name: ", error.name);

			if (error.message === "MetaMask not installed") {
				setConnectMetaMask(true);
				return;
			}
			message.error(error.message);
		}
		if (errorW) {
			message.error(errorW.message);
		}
	}, [error, errorW]);

	/// get signer

	useEffect(async () => {
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

		const getSigner = async () => {
			try {
				if (provider || providerW) {
					if (provider && chainId === 97) {
						// console.log("Provider", provider);
						if (provider) {
							await provider
								.send("eth_requestAccounts", [])
								.then((data) => {
									console.log("address: " + data);
									login(data[0])
								})
								.catch((error) => {
									if (error.code === 4001) {
										console.log("Please connect to MetaMask.");
									} else {
										console.error(error);
									}
								});

							// let web3Provider = provider.addListener("accountsChanged");
							// console.log("Account changed Provider", web3Provider);
							// console.log("Address", provider?.provider?.selectedAddress);
							const signer = provider.getSigner(
								provider?.provider?.selectedAddress
							); // You have to define your address to get away of error, because in first sight, it doesn't know what address should I sign
							dispatch(wallet.walletSetData(signer));
							localStorage.setItem(METAMASK_CONNECT, "true");
							localStorage.setItem(WALLET_CONNECT, "");
						}
						return;
					}

					if (providerW && chainIdW === 97) {
						// if (providerW) {

						await providerW.send("eth_requestAccounts", []);
						if (providerW) {
							const signer = providerW.getSigner();
							// setSigner(signer)
							dispatch(wallet.walletSetData(signer));
							localStorage.setItem(METAMASK_CONNECT, "");
							localStorage.setItem(WALLET_CONNECT, "true");
						}
						return;
					}
				} else {
					dispatch(wallet.walletSetData(null));
				}
			} catch (err) {
				console.log(err);
			}
		};
		await getSigner();
	}, [provider, providerW, chainId, chainIdW]);

	useEffect(() => {
		window.addEventListener("scroll", (event) => {
			if (document.getElementById("header-layout")) {
				if (window.pageYOffset > 10) {
					document.getElementById("header-layout").classList.add("scrolled");
				} else if (window.pageYOffset == 0) {
					document.getElementById("header-layout").classList.remove("scrolled");
				}
			}
		});
		AOS.init({
			duration: SFEED_ANIMATION.DURATION,
			once: true,
			easing: "ease",
		});
		AOS.refresh();
	}, []);

	useEffect(() => {
		let metamasskConnect = localStorage.getItem(METAMASK_CONNECT);
		if (metamasskConnect) {
			void metaMask.connectEagerly();
			return;
		}

		let iswalletConnect = localStorage.getItem(WALLET_CONNECT);
		if (iswalletConnect) void walletConnect.connectEagerly();
	}, []);

	return (
		<React.Fragment>
			{isWrongNetWork ? (
				<CheckNetwork
					isModalVisible={isWrongNetWork}
					hideWallet={setIsWrongNetWork}
				/>
			) : null}
			{isConnectMetaMask ? (
				<ConnectMetamask
					isModalVisible={isConnectMetaMask}
					hideWallet={setConnectMetaMask}
				/>
			) : null}

			<Layout id="layout" className="layout">
				<Header id="header-layout" className="header-layout">
					<TopbarMobile />
					<HeaderLayout />
				</Header>
				<Content id="main-layout" className="content-layout">
					<Outlet />
				</Content>
				<Footer id="footer-layout" className="footer-layout">
					<FooterLayout />
				</Footer>
			</Layout>
		</React.Fragment>
	);
}
export default LayoutDefault;
