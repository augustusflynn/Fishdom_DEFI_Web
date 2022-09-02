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
		console.log("Vai ca lon data", data);
		setQuantity(1);
		form.resetFields();
		setPriceBNB(0);
	}, [data, isShowModal]);
	const onChangeQuantity = (value) => {
		console.log(value);
		if (parseInt(value) < 100) {
			setQuantity(100);
		} else {
			const formatValue = Math.round(value).toString();
			form.setFieldsValue({
				quantity: formatValue,
			});
			setQuantity(formatValue);
		}
	};

	const onChangeBNB = (value) => {
		if (value >= 10 ** -18 && value <= 10 ** 18 - 1) {
			setPriceBNB(value);
		} else {
			setPriceBNB(0);
		}
	};

	function formatQuantity(data) {
		if (!data) return " ";
		if (data.length <= 8) return data;
		const length = data.length;
		return data.slice(0, 3) + "..." + data.slice(length - 3, length);
	}

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
					onClick({ ...values, tokenId: data.tokenId });
				}}
			>
				<div className="back" onClick={() => setShowModal(false)}>
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
							<Space direction="horizontal" size={40}>
								<div className="module-title" style={{ fontSize: "14px" }}>
									Amount:&nbsp;{formatQuantity(data?.quantity)}
								</div>
								{(data?.quantity !== "1" || data?.quantity > 1) && (
									<Form.Item
										name={"quantity"}
										rules={[
											{
												required: true,
												message: "Please enter quantity",
											},
											() => ({
												validator(_, value) {
													if (Number(value < 0)) {
														return Promise.reject(new Error("Invalid price"));
													} else if (Number(value >= 10 ** 18)) {
														return Promise.reject(
															new Error("Price only from 0 to 10^18")
														);
													} else {
														return Promise.resolve();
													}
												},
											}),
										]}
									>
										<div className="attribute">
											<InputNumber
												className="market-input"
												placeholder="Amount"
												min={100}
												value={quantity}
												id="quantity_input"
												onChange={onChangeQuantity}
												size="large"
											/>
										</div>
									</Form.Item>
								)}
							</Space>
						)}
					</div>
				</Space>
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
										prefix="BNB"
										size="large"
									/>
								</div>
							</Form.Item>

							<p className="module-blur c2i-no-margin modal-wrap-text">
								{`Total price: `}
								<span className="c2i-color-title">{`${
									priceBNB * quantity >= 1
										? priceBNB * quantity + " BNB"
										: (priceBNB > 10 ** -18 && priceBNB < 1) ||
										  parseFloat(priceBNB) == 0
										? ethers.utils.formatEther(
												parseInt(priceBNB * quantity * 10 ** 18).toString()
										  ) + " BNB"
										: priceBNB < 10 ** 18 - 1 + " BNB"
										? parseFloat(priceBNB * quantity).toString() + " BNB"
										: "Invalid Value"
								}`}</span>
							</p>

							<p className="module-blur c2i-no-margin modal-wrap-text">
								{`Fee:`}
								<span className="c2i-color-title">{` ~ ${
									priceBNB * quantity >= 1
										? priceBNB * quantity * 0.05 + " BNB"
										: (priceBNB > 10 ** -16 && priceBNB < 1) ||
										  parseFloat(priceBNB) == 0
										? ethers.utils.formatEther(
												parseInt(
													priceBNB * quantity * 0.05 * 10 ** 18
												).toString()
										  ) + " BNB"
										: priceBNB < 10 ** 18 - 1 + " BNB"
										? parseFloat(priceBNB * quantity * 0.05).toString() + " BNB"
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
