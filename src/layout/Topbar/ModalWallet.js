import { Button, Form, Input, message, Modal } from "antd";
import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { user } from "src/redux/actions/index.js";
import { user$, wallet$ } from "src/redux/selectors/index.js";
import MetaMaskSelect from "./MetaMaskSelect.js";
import WalletConnect from "./WalletConnect";

function ModalWallet(props) {
	const { isModalVisible, hideWallet } = props;

	const walletConnect = useSelector(wallet$)
	const userData = useSelector(user$)
	const dispatch = useDispatch()

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
					<MetaMaskSelect />
					<WalletConnect />
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
