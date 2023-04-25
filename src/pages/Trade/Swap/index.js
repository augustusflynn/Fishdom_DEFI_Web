import React, { useState, useEffect, useRef } from "react";
import { Input, Space, Button, message } from "antd";
import { ethers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { user$ } from "src/redux/selectors";
import BaseHelper from "src/utils/BaseHelper";
import SwapModal from "./Modal";
import IconWallet from "src/assets/png/topbar/icon-wallet-white.svg";
import FdTAbi from '../../../constants/contracts/token/FishdomToken.sol/FishdomToken.json';
import axios from "axios";
import { user } from "src/redux/actions";
import { useWeb3React } from "@web3-react/core";
import _ from "lodash";
import { catchErrorWallet } from "src/metamask";

function SwapPage() {
	const web3Context = useWeb3React()
	const [isShowModalSwapFdTToPoint, setIsShowModalSwapFdTToPoint] = useState(false);
	const [isShowModalSwapPointToFdT, setIsShowModalSwapPointToFdT] = useState(false);
	const [disable, setDisable] = useState(false);
	const pointRef = useRef();
	const FdTRef = useRef();
	const [loading, setLoading] = useState(false);
	const [balanceFdT, setBalanceFdT] = useState(0)
	const userData = useSelector(user$)
	const dispatch = useDispatch()
	//--------------HOOKS---------------//
	useEffect(() => {
		window.scrollTo(0, 0);
	});

	const getBalanceFdT = async () => {
		const FdTContract = new ethers.Contract(
			FdTAbi.networks[process.env.REACT_APP_NETWORK_ID].address,
			FdTAbi.abi,
			await web3Context.library.getSigner(web3Context.account)
		);
		const balanceOf = await FdTContract.balanceOf(web3Context.account)
		setBalanceFdT(ethers.utils.formatEther(balanceOf))
	}

	useEffect(async () => {
		if (web3Context.active && !_.isEmpty(userData)) {
			setDisable(false)
			getBalanceFdT();
		} else {
			setDisable(true)
		}
	}, [web3Context.active, userData]);

	async function handleDeposit() {
		if (!(web3Context.active && userData.token)) {
			message.error("Please connect wallet!");
			setDisable(true)
			return
		}
		setLoading(true);
		try {
			const FdTContract = new ethers.Contract(
				FdTAbi.networks[process.env.REACT_APP_NETWORK_ID].address,
				FdTAbi.abi,
				await web3Context.library.getSigner(web3Context.account)
			);
			const transferTx = await FdTContract.transfer(
				process.env.REACT_APP_MASTER_ADDRESS,
				ethers.utils.parseEther(FdTRef.current.input.value)
			);
			message.warning("Please wait for transaction finished...");

			await transferTx.wait();
			const resp = await axios.post(
				process.env.REACT_APP_API_URL + '/Exchange/requestDepositPoint',
				{
					txHash: transferTx.hash
				},
				{
					headers: {
						Authorization: `Bearer ${userData.token}`
					}
				}
			)
			setLoading(false);
			message.success("Swap successfully!");
			setIsShowModalSwapFdTToPoint(false);
			dispatch(user.setUser(resp.data.data))
			getBalanceFdT();
		} catch (error) {
			setLoading(false);
			catchErrorWallet(error);
		}
	}

	async function handleWithdraw() {
		if (!(web3Context.active && userData.token)) {
			message.error("Please connect wallet!");
			setDisable(true)
			return
		}
		setLoading(true);
		await axios.post(
			process.env.REACT_APP_API_URL + '/Exchange/requestWithdrawFishdomToken',
			{
				amount: pointRef.current.input.value
			},
			{
				headers: {
					Authorization: `Bearer ${userData.token}`
				}
			}
		).then(res => {
			setLoading(false);
			message.success("Swap successfully!");
			setIsShowModalSwapPointToFdT(false);
			dispatch(user.setUser(res.data.data))
		}).catch(err => {
			message.error("Transaction failed!");
			console.log('withdraw error', err);
			setLoading(false)
		});
	}

	return (
		<>
			{isShowModalSwapFdTToPoint && (
				<SwapModal
					isShowModal={isShowModalSwapFdTToPoint}
					swapHandler={handleDeposit}
					loading={loading}
					setShowModal={setIsShowModalSwapFdTToPoint}
					child={
						<>
							<span className="custom-active">
								{`${BaseHelper.numberWithDots(FdTRef.current.input.value)}`} FDT
							</span>{" "}
							to {FdTRef.current.input.value}<br />
							POINT?
						</>
					}
				/>
			)}
			{isShowModalSwapPointToFdT && (
				<SwapModal
					isShowModal={isShowModalSwapPointToFdT}
					swapHandler={handleWithdraw}
					loading={loading}
					setShowModal={setIsShowModalSwapPointToFdT}
					child={
						<>
							<span className="custom-active">
								{`${BaseHelper.numberWithDots(pointRef.current.input.value)}`} POINT
							</span>{" "}
							to {pointRef.current.input.value * 0.9}<br />
							FDT?
						</>
					}
				/>
			)}
			<div id="win-swap" data-aos="fade-up">
				<div className="page-container">
					<div style={{ width: "35%" }}>
						<div className="swap-head-container">
							<h2 className="module-header">{`Deposit`}</h2>
							<div className="balance-container">
								<img src={IconWallet} style={{ marginRight: "8px" }}></img>
								<p className="module-blur custom-no-margin">{`${balanceFdT} FDT`}</p>
							</div>
						</div>
						<Space
							direction="vertical"
							size={24}
							className="swap-content-container"
						>
							<Space size={24} className="swap-item ">
								<p className="module-blur custom-no-margin text-left">Pricing</p>
								<p className="module-blur custom-default custom-no-margin text-left">
									1 FDT = 1 POINT
								</p>
							</Space>
							<Space direction="horizontal" size={8} align="start">
								<div className="custom-form-group">
									<div className="custom-form-control">
										<Input
											type="number"
											min={1}
											ref={FdTRef}
											placeholder="1 FdT"
											disabled={disable}
										/>
									</div>
								</div>
							</Space>
							<div className="module-line"></div>
							<div className="btn-price-container">
								<div className="price-container">
									<p className="module-blur"></p>
								</div>
								<Button
								className="swap-confirm-btn module-blur"
									onClick={() => {
										let value = FdTRef?.current?.input?.value || 0
										if (value && !isNaN(value) && value > 0) {
											setIsShowModalSwapFdTToPoint(prev => !prev)
										}
									}}
								>
									{"Swap now"}
								</Button>
							</div>
						</Space>
					</div>

					<div style={{ width: "35%" }}>
						<div className="swap-head-container">
							<h2 className="module-header">{`Withdraw`}</h2>
							<div className="balance-container">
								<img src={IconWallet} style={{ marginRight: "8px" }}></img>
								<p className="module-blur custom-no-margin">{`${BaseHelper.numberWithRealDots(
									userData?.balance || "0"
								)} POINT`}</p>
							</div>
						</div>
						<Space
							direction="vertical"
							size={24}
							className="swap-content-container"
						>
							<Space size={24} className="swap-item ">
								<p className="module-blur custom-no-margin text-left">Pricing</p>
								<p className="module-blur custom-default custom-no-margin text-left">
									{/* 1 TOKEN = {BaseHelper.numberWithRealDots(price)} FISHDOM TOKEN */}
									1 POINT  = 0.9 FDT
								</p>
							</Space>
							<Space direction="horizontal" size={8} align="start">
								<div className="custom-form-group">
									<div className="custom-form-control">
										<Input
											type="number"
											min={1}
											ref={pointRef}
											placeholder="1 Point"
											disabled={disable}
										/>
									</div>
								</div>
							</Space>
							<div className="module-line"></div>
							<div className="btn-price-container">
								<div className="price-container">
									<p className="module-blur"></p>
								</div>
								<Button
									className="swap-confirm-btn module-blur"
									onClick={() => {
										let value = pointRef?.current?.input?.value || 0
										if (value && !isNaN(value) && value > 0) {
											setIsShowModalSwapPointToFdT(prev => !prev)
										}
									}}
								>
									{"Swap now"}
								</Button>
							</div>
						</Space>
					</div>
				</div>
			</div>
		</>
	);
}
export default SwapPage;
