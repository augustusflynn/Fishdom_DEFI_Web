import { Modal } from "antd";
import React from "react";
import MetaMaskSelect from "./MetaMaskSelect.js";
import WalletConnect from "./WalletConnect";

function ModalWallet(props) {
	const { isModalVisible, hideWallet, setShowMenu } = props;
	const handleCancel = () => {
		hideWallet();
	};

	return (
		<Modal
			className="modal-wallet"
			title={null}
			visible={isModalVisible}
			onCancel={handleCancel}
			footer={null}
			closable={false}
		>
			<div>
				<div className="back" onClick={handleCancel}>
					<div className="icon-back"></div>
					<span>Go Back</span>
				</div>
				<div className="header">
					<span>Choose Your Wallet </span>
				</div>
				<div className="content">
					<MetaMaskSelect
						setShowMenu={setShowMenu}
						handleCancel={handleCancel}
					/>
					<WalletConnect
						setShowMenu={setShowMenu}
						handleCancel={handleCancel}
					/>
				</div>
			</div>
		</Modal>
	);
}
export default ModalWallet;
