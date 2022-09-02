import { Button, Col, Divider, Row, Space } from "antd";
import Modal from "antd/lib/modal/Modal";
import React from "react";
import BaseHelper from "src/utils/BaseHelper";

const BuyModal = (props) => {
	const { isShowModal, setShowModal, data, buyHandler, buyLoading } = props;
	const hideModal = () => {
		setShowModal(false);
	};

	return (
		<Modal
			className="modal-wallet collection"
			title={null}
			visible={isShowModal}
			onCancel={hideModal}
			footer={null}
			closable={false}
			id="marketplace-modal"
		>
			<div className="back" onClick={hideModal}>
				<div className="icon-back"></div>
				<span>Go back</span>
			</div>
			<div className="header c2i-no-margin">
				<span className="title-buy">Complete your checkout</span>
			</div>
			<Divider />
			<Space direction={"horizontal"} size={21}>
				<img alt="crown-image" src={data?.image} className="market-img" />
				<div className="market-container-modal">
					<h3 className="module-title c2i-no-margin">{data?.name || ""}</h3>
					{data?.apr && data?.reduce ? (
						<Space direction="horizontal" size={40}>
							<div className="attribute">
								<h3 className="module-title c2i-color-green">
									{`${data?.apr || "0"}`}%
								</h3>
								<p className="module-blur c2i-no-margin">APR Bonus</p>
							</div>
							<div className="market-line"></div>
							<div className="attribute">
								<h3 className="module-title c2i-color-green">
									{data?.reduce || "0"}%
								</h3>
								<p className="module-blur c2i-no-margin">Mining Reduce</p>
							</div>
						</Space>
					) : (
						<div className="module-title" style={{ fontSize: "14px" }}>
							Amount:&nbsp;{data?.quantity || ""}
						</div>
					)}
				</div>
			</Space>
			<Divider />
			<Row justify="space-between" className="custom-row">
				<Col xs={24} sm={12}>
					<div className="attribute">
						<h3 className="module-title c2i-color-green c2i-no-margin">
							{BaseHelper.formatPriceWithQuantity(data?.price, 1) || "0"} BNB
						</h3>
						<p className="module-blur c2i-no-margin">Total</p>
					</div>
				</Col>
				<Col xs={24} sm={12}>
					<Button
						className="confirm-btn"
						style={{ maxWidth: "287.5px", width: "100%" }}
						onClick={buyHandler}
						loading={buyLoading}
					>
						Confirm
					</Button>
				</Col>
			</Row>
		</Modal>
	);
};
export default BuyModal;
