import { Button, Space } from "antd";
import Modal from "antd/lib/modal/Modal";
import React from "react";
import BaseHelper from "src/utils/BaseHelper";

const SwapModal = (props) => {
	const { isShowModal, setShowModal, swapHandler, price, loading } = props;
	const hideModal = () => {
		setShowModal(false);
	};
	return (
		<Modal
			visible={isShowModal}
			centered
			title={null}
			footer={null}
			closable={null}
			onCancel={hideModal}
			className="swap-modal c2i-modal"
		>
			<Space direction="vertical" size={24}>
				<h2 className="module-title">
					Are you sure to Convert
					<br />
					<span className="c2i-active">
						{`${BaseHelper.numberWithDots(price)}`} SCEPTER
					</span>{" "}
					to 1<br />
					CROWN?
				</h2>
				<div className="btn-container">
					<Button
						className="confirm-btn module-blur"
						htmltype="button"
						onClick={swapHandler}
						loading={loading}
					>
						{"Confirm Swap"}
					</Button>
					<Button
						className="cancel-btn module-blur"
						onClick={hideModal}
						htmltype="button"
					>
						Cancel
					</Button>
				</div>
			</Space>
		</Modal>
	);
};
export default SwapModal;
