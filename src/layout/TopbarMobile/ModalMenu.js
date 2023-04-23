import { useWeb3React } from "@web3-react/core";
import { Modal } from "antd";
import _ from "lodash";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import IconWallet from "../../assets/png/topbar/icon-wallet-white.svg";
import { user$ } from "../../redux/selectors";
import { navigations } from "../../routerNav";
import BaseHelper from "../../utils/BaseHelper";
import ModalWallet from "../Topbar/ModalWallet";

// import {}
function ModalMenu(props) {
	const { isModalVisible, hideMenu, setShowMenu } = props;
	const navigate = useNavigate();
	const { active, account } = useWeb3React();
	const [isShowWallet, setShowWallet] = useState(false);
	const userData = useSelector(user$)
	const isLoggedIn = !_.isEmpty(userData)

	const handleClick = (key, redirect) => {
		if (redirect) {
			window.location = redirect;
			return;
		}
		navigate(key);
		hideMenu();
		window.scrollTo(0, 0);
	};
	const goHome = () => {
		setShowMenu(false);
		navigate("/");
		window.scrollTo(0, 0);
	};

	const showWallet = () => {
		setShowWallet(true);
	};

	const hideWallet = () => {
		setShowWallet(false);
	};
	const handleScroll = (key, hash) => {
		navigate(key);
		window.location.hash = hash;
		setShowMenu(false);
	};

	return (
		<React.Fragment>
			{isShowWallet ? (
				<ModalWallet
					isModalVisible={isShowWallet}
					hideWallet={hideWallet}
					setShowMenu={setShowMenu}
				/>
			) : null}
			<Modal
				className="modal-menu"
				title={null}
				visible={isModalVisible}
				onCancel={hideMenu}
				footer={null}
				//   closable={false}
			>
				<div className="logo-mobile" onClick={goHome} />
				<div className="head">
					{(isLoggedIn && active) ? (
						<div>
							<div className="flex-center">
								<img src={IconWallet} />
								<span className="color-text-default">
									{BaseHelper.shortTextAdress(account)}
								</span>
							</div>
							<div className="flex-center btn-connect">
								<button className="btn-mobile-default" onClick={showWallet}>
									<span style={{ whiteSpace: "nowrap" }}>Switch Wallet</span>
								</button>
							</div>
						</div>
					) : (
						<div className="wallet-button" onClick={showWallet}>
							<img src={IconWallet} alt="icon-wallet" />
							<span> Connect Wallet </span>
						</div>
					)}
				</div>
				<div className="content">
					<div className="menu">
						{navigations.map((item, index) => {
							return (
								<div key={index} className="item-menu">
									<div className="menu-title">{item.title}</div>
									<div className="item-select">
										{!item.childrent
											? null
											: item.childrent.map((item2, index2) => {
													return !item2.hash ? (
														<span
															key={index2}
															className="item-name"
															onClick={(e) =>
																handleClick(item2.path, item2.redirect)
															}
														>
															{item2.title}
														</span>
													) : (
														<span
															key={index2}
															className="item-name"
															onClick={(e) =>
																handleScroll(item2.path, item2.hash)
															}
														>
															{item2.title}
														</span>
													);
											  })}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</Modal>
		</React.Fragment>
	);
}
export default ModalMenu;
