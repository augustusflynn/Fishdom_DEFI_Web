import { useWeb3React } from "@web3-react/core";
import React from "react";
import IconMetaMask from "../../assets/png/topbar/icon-metamask.png";
import { hooks, metaMask } from "../../connectors/metaMask";
import { METAMASK_CONNECT, WALLET_CONNECT } from "../../constants/apiContants";
import { chanId } from "../../constants/index.js";

const {
	useError,
	useIsActivating,
	useIsActive,
} = hooks;

function MetaMaskSelect(props) {
	const { connector } = useWeb3React();
	const { setShowMenu, handleCancel } = props;
	const isActivating = useIsActivating();
	const error = useError();
	const isActive = useIsActive();
	return (
		<div className={`item-wallet margin-top-0`}>
			<div className="wallet">
				<img src={IconMetaMask} />
				<span>Metamask</span>
			</div>

			<div
				className="connect"
				onClick={() => {
					localStorage.setItem(METAMASK_CONNECT, "");
					localStorage.setItem(WALLET_CONNECT, "");
					connector.deactivate();
					if (!isActive) metaMask.activate(chanId);
					handleCancel();
				}}
			>
				<div className="icon-connect"></div>
				{isActive ? <span>{"DisConnect"}</span> : <span>{"Connect"}</span>}
			</div>
		</div>
	);
}
export default MetaMaskSelect;
