import { Button, Col, Divider, Form, InputNumber, Row, Space } from "antd";
import Modal from "antd/lib/modal/Modal";
import { ethers } from "ethers";
import React, { useEffect, useRef, useState } from "react";

const ModalConfirm = ({
	isShowModal,
	data,
	setShowModal,
	onClick,
	isLoading,
}) => {
	const [form] = Form.useForm();
	const [quantity, setQuantity] = useState(1);
	const [priceBNB, setPriceBNB] = useState(0);
	const priceBNBRef = useRef();

	useEffect(() => {
		setQuantity(1);
		form.resetFields();
		setPriceBNB(0);
	}, [data, isShowModal]);

	const onChangeBNB = (value) => {
		if (value >= 10 ** -18 && value <= 10 ** 18 - 1) {
			setPriceBNB(value);
		} else {
			setPriceBNB(0);
		}
	};

	return (
		<Modal
			className="modal-wallet"
			title={null}
			visible={isShowModal}
			onCancel={() => setShowModal(false)}
			footer={null}
			closable={false}
			id="marketplace-modal"
		>
			<Form
				form={form}
				onFinish={(values) => {
					onClick({ ...values, nftId: data.nftId });
				}}
			>
				<div className="back" onClick={() => setShowModal(false)}>
					<div className="icon-back"></div>
					<span>Go back</span>
				</div>
				<div className="header custom-no-margin">
					<span className="title-buy">Complete your checkout</span>
				</div>
				<Divider />
				<Row align="center" justify="space-between">
					<Col sm={10} className="row-no-margin">
						<Space direction="vertical" size={8}>
							<Form.Item
								name="price"
								rules={[
									{
										required: true,
										message: "Please enter pice",
									},
									() => ({
										validator(_, value) {
											if (Number(value < 0)) {
												return Promise.reject(new Error("Invalid price"));
											} else if (Number(value < 10 ** -18)) {
												return Promise.reject(
													new Error("Price only from 10^-18 to 10^15")
												);
											} else if (Number(value > 10 ** 18 - 1)) {
												return Promise.reject(
													new Error("Price only from 10^-18 to 10^18 - 1")
												);
											} else {
												return Promise.resolve();
											}
										},
									}),
								]}
							>
								<div className="attribute flex column justify-between">
									<InputNumber
										min={0}
										type="number"
										value={priceBNB}
										ref={priceBNBRef}
										placeholder=" Amount"
										className="market-input"
										onChange={onChangeBNB}
										prefix="FdT"
										size="large"
									/>
								</div>
							</Form.Item>

							<p className="module-blur custom-no-margin modal-wrap-text">
								{`Total price: `}
								<span className="custom-color-title">{`${priceBNB * quantity >= 1
									? priceBNB * quantity + " FdT"
									: (priceBNB > 10 ** -18 && priceBNB < 1) ||
										parseFloat(priceBNB) == 0
										? ethers.utils.formatEther(
											parseInt(priceBNB * quantity * 10 ** 18).toString()
										) + " FdT"
										: priceBNB < 10 ** 18 - 1 + " FdT"
											? parseFloat(priceBNB * quantity).toString() + " FdT"
											: "Invalid Value"
									}`}</span>
							</p>

							<p className="module-blur custom-no-margin modal-wrap-text">
								{`Fee:`}
								<span className="custom-color-title">{` ~ ${priceBNB * quantity >= 1
									? priceBNB * quantity * 0.05 + " FdT"
									: (priceBNB > 10 ** -16 && priceBNB < 1) ||
										parseFloat(priceBNB) == 0
										? ethers.utils.formatEther(
											parseInt(
												priceBNB * quantity * 0.05 * 10 ** 18
											).toString()
										) + " FdT"
										: priceBNB < 10 ** 18 - 1 + " FdT"
											? parseFloat(priceBNB * quantity * 0.05).toString() + " FdT"
											: 0
									}`}</span>
							</p>
						</Space>
					</Col>
					<Col sm={10} className="row-no-margin">
						<Form.Item>
							<Button
								className="confirm-btn"
								style={{ maxWidth: "287.5px", width: "100%" }}
								htmlType="submit"
								loading={isLoading}
							>
								Confirm
							</Button>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Modal>
	);
};
export default ModalConfirm;
