import React from "react";
import IconMetaMask from "../../assets/png/topbar/icon-metamask.png";

function MetaMaskSelect({
	onClick, isActive
}) {
	return (
		<div className={`item-wallet margin-top-0`}>
			<div className="wallet">
				<img src={IconMetaMask} />
				<span>Metamask</span>
			</div>

			<div
				className="connect"
				onClick={onClick}
			>
				<div className="icon-connect"></div>
				{isActive ? <span>{"Disconnect"}</span> : <span>{"Connect"}</span>}
			</div>
		</div>
	);
}
export default MetaMaskSelect;
