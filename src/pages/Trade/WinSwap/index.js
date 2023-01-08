import React, { useState, useEffect, useRef, useCallback } from "react";
import { Input, Space, Button, message } from "antd";
import { ethers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { user$, wallet$ } from "src/redux/selectors";
import BaseHelper from "src/utils/BaseHelper";
import SwapModal from "./Modal";
import IconWallet from "src/assets/png/topbar/icon-wallet-white.svg";
import FdTAbi from '../../../constants/contracts/token/FishdomToken.sol/FishdomToken.json';
import axios from "axios";
import { user } from "src/redux/actions";
import { useWeb3React } from "@web3-react/core";

function WinSwap() {
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
		if (!web3Context.active) {
			setDisable(true)
		} else {
			setDisable(false)
			getBalanceFdT();
		}
	}, [web3Context.active]);

	async function handleDeposit() {
		if (!web3Context.active) {
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
			message.warning("Please wait for transaction finised...");

			await transferTx.wait();
			await axios.post(
				process.env.REACT_APP_API_URL + '/api/users/deposit',
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
			dispatch(user.setUser({ ...userData, balance: parseFloat(userData.balance) + parseFloat(FdTRef.current.input.value) }))
			getBalanceFdT();
		} catch (err) {
			setLoading(false);
			if (err.code == 4001) {
				message.error("Transaction cancelled!");
			} else {
				message.error("Transaction error!");
			}
			console.log(err);
		}
	}

	async function handleWithdraw() {
		if (!web3Context.active) {
			message.error("Please connect wallet!");
			setDisable(true)
			return
		}
		setLoading(true);
		await axios.post(
			process.env.REACT_APP_API_URL + '/api/users/withdraw',
			{
				amount: pointRef.current.input.value
			},
			{
				headers: {
					Authorization: `Bearer ${userData.token}`
				}
			}
		).then(res => {
			window.open(`https://testnet.bscscan.com/tx/${res.data.tx.hash}`, '_blank')
			setLoading(false);
			message.success("Swap successfully!");
			setIsShowModalSwapPointToFdT(false);
			dispatch(user.setUser({ ...userData, balance: parseFloat(userData.balance) - parseFloat(pointRef.current.input.value) }))
		}).catch(err => {
			message.error("Transaction error!");
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
							<span className="c2i-active">
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
							<span className="c2i-active">
								{`${BaseHelper.numberWithDots(pointRef.current.input.value)}`} POINT
							</span>{" "}
							to {pointRef.current.input.value * 0.9}<br />
							FDT?
						</>
					}
				/>
			)}
			<div id="win-swap" data-aos="fade-up">
				<div className="c2i-container">
					<div style={{ width: "35%" }}>
						<div className="swap-head-container">
							<h2 className="module-header">{`Deposit`}</h2>
							<div className="current-sceptor-container">
								<img src={IconWallet} style={{ marginRight: "8px" }}></img>
								<p className="module-blur c2i-no-margin">{`${balanceFdT} FDT`}</p>
							</div>
						</div>
						<Space
							direction="vertical"
							size={24}
							className="swap-content-container"
						>
							<Space size={24} className="swap-item ">
								<p className="module-blur c2i-no-margin text-left">Pricing</p>
								<p className="module-blur c2i-default c2i-no-margin text-left">
									1 FDT = 1 POINT
								</p>
							</Space>
							<Space direction="horizontal" size={8} align="start">
								<div className="c2i-form-group">
									<div className="c2i-form-control">
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
									onClick={() => setIsShowModalSwapFdTToPoint(prev => !prev)}
								>
									{"Swap now"}
								</Button>
							</div>
						</Space>
					</div>

					<div style={{ width: "35%" }}>
						<div className="swap-head-container">
							<h2 className="module-header">{`Withdraw`}</h2>
							<div className="current-sceptor-container">
								<img src={IconWallet} style={{ marginRight: "8px" }}></img>
								<p className="module-blur c2i-no-margin">{`${BaseHelper.numberWithRealDots(
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
								<p className="module-blur c2i-no-margin text-left">Pricing</p>
								<p className="module-blur c2i-default c2i-no-margin text-left">
									{/* 1 TOKEN = {BaseHelper.numberWithRealDots(price)} FISHDOM TOKEN */}
									1 POINT  = 0.9 FDT
								</p>
							</Space>
							<Space direction="horizontal" size={8} align="start">
								<div className="c2i-form-group">
									<div className="c2i-form-control">
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
									onClick={() => setIsShowModalSwapPointToFdT(prev => !prev)}
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
export default WinSwap;
