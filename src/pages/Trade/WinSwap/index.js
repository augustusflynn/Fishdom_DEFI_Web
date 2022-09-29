import React, { useState, useEffect, useRef } from "react";
import { Input, Space, Button, Modal, message } from "antd";
import { ethers } from "ethers";
import {
	swapSceptorAddress,
	swapSceptorAbi,
	sceptorAbi,
	sceptorAddress,
	crownNFTAbi,
	crownNFTAdress,
} from "src/constants/constants";
import { useSelector } from "react-redux";
import { wallet$ } from "src/redux/selectors";
import BaseHelper from "src/utils/BaseHelper";
import SwapModal from "./Modal";
import IconWallet from "src/assets/png/topbar/icon-wallet-white.svg";
import contractCrownLucky from "./../../../constants/abiCrownLucky.json";
function WinSwap(props) {
	const walletConnect = useSelector(wallet$);
	const [isShowModal, setShowModal] = useState(false);
	const [price, setPrice] = useState(0);
	const [currentSceptor, setCurrentSceptor] = useState(0);
	const [maxSupplyCrown, setMaxSupplyCrown] = useState(0);
	const [currentSupply, setCurrentSupply] = useState(0);
	const [disable,setDisable] = useState(false);
	const crownRef = useRef();
	const [loading, setLoading] = useState(false);
	const [contactUseEffect, setContactUseEffect] = useState(false);
	const [ownerCrown, setOwnerCrown] = useState(); //so crown da trung thuong tu crown lucky
	const { crownLuckyAddress, crownLuckyAbi } = contractCrownLucky;
	//--------------HOOKS---------------//
	useEffect(() => {
		window.scrollTo(0, 0);
	});
	useEffect(async () => {
		if (!walletConnect) {
			setDisable(true)
		} else {
			setDisable(false)
			const swapContract = new ethers.Contract(
				swapSceptorAddress,
				swapSceptorAbi,
				walletConnect
			);
			const sceptorContract = new ethers.Contract(
				sceptorAddress,
				sceptorAbi,
				walletConnect
			);
			const crownContract = new ethers.Contract(
				crownNFTAdress,
				crownNFTAbi,
				walletConnect
			);
			const luckyCrownContract = new ethers.Contract(
				crownLuckyAddress,
				crownLuckyAbi,
				walletConnect
			);
			// setMaxSupplyCrown(parseInt(await crownContract.maxSupply()));
			let ownerCrown = await luckyCrownContract.getOwnerCrownNFT();
			let address = await walletConnect.getAddress();
			let maxSceptor = await sceptorContract.balanceOf(address, 0);
			let currentSup = await swapContract.currentSupply();
			let getRatio = await swapContract.PRICE();
			let maxSup = await swapContract.MAX_SUPPLY();
			setOwnerCrown(ownerCrown.toString());
			setMaxSupplyCrown(parseInt(maxSup.toString()));
			setPrice(parseInt(getRatio));
			setCurrentSupply(parseInt(currentSup));
			setCurrentSceptor(parseInt(maxSceptor));
		}
	}, [walletConnect]);
	//--------------FUNC---------------//
	const swapHandler = async () => {
		if (!walletConnect) {
			message.error("Please connect wallet!");
			setDisable(true)
		} else {
			if (currentSupply >= maxSupplyCrown) {
				message.error("Run out of CROWN NFT!");
				return;
			}
			setLoading(true);
			try {
				const sceptorContract = new ethers.Contract(
					sceptorAddress,
					sceptorAbi,
					walletConnect
				);
				const sceptorTx = await sceptorContract.setApprovalForAll(
					swapSceptorAddress,
					true
				);
				message.warning("Please wait for transaction finised...");
				await sceptorTx.wait();
				const swapContract = new ethers.Contract(
					swapSceptorAddress,
					swapSceptorAbi,
					walletConnect
				);
				await swapContract.swapCrown();
				setLoading(false);
				setShowModal(false);
				// setContactUseEffect(!contactUseEffect);
				setCurrentSceptor(currentSceptor - price);
				message.success("Swap scepter to crown successfully!");
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
	};

	const showModal = () => {
		if (currentSceptor >= price) {
			setShowModal(true);
		} else {
			message.error("Not enough sceptor to swap!");
		}
	};

	return (
		<>
			{isShowModal && (
				<SwapModal
					isShowModal={isShowModal}
					swapHandler={swapHandler}
					loading={loading}
					setShowModal={setShowModal}
					price={price}
				/>
			)}
			<div id="win-swap" data-aos="fade-up">
				<div className="c2i-container">
					<div style={{width: "35%"}}>
					<div className="swap-head-container">
						<h2 className="module-header">{`Deposit`}</h2>
						<div className="current-sceptor-container">
							<img src={IconWallet} style={{ marginRight: "8px" }}></img>
							<p className="module-blur c2i-no-margin">{`${BaseHelper.numberWithRealDots(
								currentSceptor
							)} FDT`}</p>
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
								{/* 1 FISHDOM TOKEN = {BaseHelper.numberWithRealDots(price)} POINT */}
								1 FDT = 1 POINT
							</p>
						</Space>
						<Space direction="horizontal" size={8} align="start">
							<div className="c2i-form-group">
								<div className="c2i-form-control">
									<Input
										type="number"
										min={1}
										max={maxSupplyCrown}
										ref={crownRef}
										placeholder="1 POINT"
										disabled={disable}
									/>
								</div>
							</div>
						</Space>
						<div className="module-line"></div>
						<div className="btn-price-container">
							<div className="price-container">
								{/* <p
									className={`module-blur ${
										currentSceptor >= price ? "c2i-active" : "c2i-error"
									}`}
								>
									{BaseHelper.numberWithRealDots(price) + ` SCEPTOR`}
								</p> */}
								<p className="module-blur">Total</p>
							</div>
							<Button
								className="swap-confirm-btn module-blur"
								onClick={showModal}
							>
								{"Swap now"}
							</Button>
						</div>
						<p className="module-blur">
							{currentSceptor >= price
								? ""
								: "You haven’t enough SCEPTER for swapping!"}
						</p>
					</Space>

					</div>

					<div style={{width: "35%"}}>
					<div className="swap-head-container">
						<h2 className="module-header">{`Withdraw`}</h2>
						<div className="current-sceptor-container">
							<img src={IconWallet} style={{ marginRight: "8px" }}></img>
							<p className="module-blur c2i-no-margin">{`${BaseHelper.numberWithRealDots(
								currentSceptor
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
										max={maxSupplyCrown}
										ref={crownRef}
										placeholder="1 FDT"
										disabled = {disable}
									/>
								</div>
							</div>
						</Space>
						<div className="module-line"></div>
						<div className="btn-price-container">
							<div className="price-container">
								{/* <p
									className={`module-blur ${
										currentSceptor >= price ? "c2i-active" : "c2i-error"
									}`}
								>
									{BaseHelper.numberWithRealDots(price) + ` SCEPTOR`}
								</p> */}
								<p className="module-blur">Total</p>
							</div>
							<Button
								className="swap-confirm-btn module-blur"
								onClick={showModal}
							>
								{"Swap now"}
							</Button>
						</div>
						<p className="module-blur">
							{currentSceptor >= price
								? ""
								: "You haven’t enough SCEPTER for swapping!"}
						</p>
					</Space>
					</div>
				</div>

				
			</div>
		</>
	);
}
export default WinSwap;
