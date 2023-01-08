import { Button, Col, Input, Space } from "antd";
import { ethers } from "ethers";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { stakingAbi, stakingAddress } from "src/constants/abiStaking.json";
import CountdownClock from "src/layout/grid/CountdownV2";
import { durationStakeData } from "src/constants/mining";
import BaseHelper from "src/utils/BaseHelper";
import { useWeb3React } from "@web3-react/core";

const StakingItem = (props) => {
	const { item, stakes, setStakes, account } = props;
	const { active, library } = useWeb3React()
	const [isloadingStake, setIsLoadingStake] = useState(false);
	const [canClaim, setCanClaim] = useState(true);
	const [isloadingClaim, setIsLoadingClaim] = useState(false);
	const [earnNow, setEarnNow] = useState(0);
	const [expiredTime, setExpiredTime] = useState(
		moment(item?.createdAt)
			.add(durationStakeData[item?.duration || 0], "seconds")
			.toDate()
			.getTime() || 0
	);

	const [disableBtn, setDisableBtn] = useState(
		moment().toDate().getTime() < expiredTime
	);

	useEffect(() => {
		setDisableBtn(moment().toDate().getTime() < expiredTime);
	}, [expiredTime]);

	useEffect(() => {
		if (item) {
			setExpiredTime(
				moment(item?.createdAt)
					.add(durationStakeData[item?.duration || 0], "hour")
					.toDate()
					.getTime() || 0
			);
		}
	}, [item]);

	useEffect(() => {
		(async () => {
			try {
				if (active) {
					const stakeContract = new ethers.Contract(
						stakingAddress,
						stakingAbi,
						await library.getSigner(account)
					);
					const earned = await stakeContract.getEarned(item?.stakeId);
					if (item?.stakeId && item?.duration == 0) {
						if (parseFloat(earned) - parseFloat(item?.amount) <= 0) {
							setCanClaim(false);
						} else {
							setCanClaim(true);
						}
					}
					setEarnNow(
						parseFloat(ethers.utils.formatEther(earned.toString())).toFixed(7)
					);
				}
			} catch (err) { }
		})();
		return () => { };
	}, [active, item]);

	const buttonHandler = async (stakingId, crownId, typeHandler) => {
		// if (walletConnect) {
		// 	const stakeContract = new ethers.Contract(
		// 		stakingAddress,
		// 		stakingAbi,
		// 		walletConnect
		// 	);
		// 	const crownContract = new ethers.Contract(
		// 		crownNFTAdress,
		// 		crownNFTAbi,
		// 		walletConnect
		// 	);

		// 	try {
		// 		if (typeHandler == 0) {
		// 			setIsLoadingClaim(true);
		// 			console.log("Iam staking", stakingId);
		// 			console.log(item?.nftId);
		// 			if (item?.nftId != 0) {
		// 				const tx1 = await crownContract.approve(
		// 					stakingAddress,
		// 					item?.nftId
		// 				);
		// 				await tx1.wait();
		// 			}
		// 			const tx = await stakeContract.claim(stakingId);
		// 			await tx.wait();
		// 			setIsLoadingClaim(false);
		// 			setEarnNow(
		// 				parseFloat(ethers.utils.formatEther(item?.amount)).toFixed(7)
		// 			);
		// 			setCanClaim(true);
		// 		} else {
		// 			setIsLoadingStake(true);
		// 			const tx = await stakeContract.unstake(stakingId);
		// 			await tx.wait();
		// 			setIsLoadingStake(false);
		// 		}
		// 		if (!(typeHandler == 0 && item?.duration == 0)) {
		// 			setStakes(stakes.filter((item) => item?.stakeId != stakingId));
		// 			dispatch(stakingClaim.stakingClaimed([stakingId]));
		// 		}
		// 		message.success(
		// 			"Successfully! Please wait 2-3 minutes for actually execution!"
		// 		);
		// 	} catch (err) {
		// 		setIsLoadingClaim(false);
		// 		setIsLoadingStake(false);
		// 		message.error(err?.data?.message || "Cancel execution!");
		// 	}
		// } else {
		// 	message.error("Please connect your wallet!");
		// 	return;
		// }
	};

	return (
		<Col xs={24} sm={stakes.length == 1 ? 24 : 12}>
			<div className="frame">
				<Space direction="vertical" size={16}>
					<Space direction="vertical" size={4}>
						<h2 className="module-title c2i-no-margin">
							<span className="c2i-color-green">{`${BaseHelper.numberToCurrencyStyle(
								ethers.utils.formatEther(item?.amount)
							)}`}</span>{" "}
							FDT has been staked
						</h2>
						<p className="module-blur c2i-no-margin flex wrap">
							<span className="mr-8">Staking Days: </span>
							<span className="c2i-color-title">
								{`${item?.duration} Days - ${item?.apr}% APR`}
							</span>
						</p>
						{item?.duration != 0 ? (
							<p className="module-blur c2i-no-margin flex wrap">
								<span className="mr-8">Expired Time:</span>
								{expiredTime - moment().toDate().getTime() <= 86400000 ? (
									<span>
										<CountdownClock
											expiredTime={expiredTime}
											id={`timer ${item?.block_number || 0}`}
											className="c2i-color-title"
											hookFunction={setDisableBtn}
											hookFunctionValue={false}
										/>
									</span>
								) : (
									<span className="c2i-color-title">{`${moment(
										expiredTime
									).format("LLL")}`}</span>
								)}
							</p>
						) : (
							<p className="module-blur c2i-no-margin flex">
								{`${"Expired Time: "}`}
								<span className="c2i-color-title ml-8"> Unlimited Time</span>
							</p>
						)}
						<p className="module-blur c2i-no-margin flex wrap">
							{`Apr Bonus: `}
							<span className="c2i-color-title ml-8">AprBonus</span>
						</p>
					</Space>
					<div className="line"></div>
					<Space direction="vertical" size={24} className="buy-section">
						<Space direction="vertical" size={12} className="input-section">
							<h3 className="module-blur c2i-no-margin c2i-color-title c2i-font-special">
								Interest Rate (per year)
							</h3>
							<div className="c2i-form-group">
								<div className="c2i-form-control">
									<Input
										type="number"
										min={1}
										disabled
										placeholder={`${item?.apr}%`}
									/>
								</div>
							</div>
						</Space>
						<Space direction="vertical" size={12} className="input-section">
							<h3 className="module-blur c2i-no-margin c2i-color-title c2i-font-special">
								FDT Amount
							</h3>
							<div className="c2i-form-group">
								<div className="c2i-form-control">
									<Input
										type="number"
										min={1}
										disabled
										placeholder={BaseHelper.numberToCurrencyStyle(
											ethers.utils.formatEther(item?.amount)
										)}
									/>
								</div>
							</div>
						</Space>
						<Space direction="vertical" size={12} className="input-section">
							<h3 className="module-blur c2i-no-margin c2i-color-title c2i-font-special">
								{item?.duration == 0 ? "Staked Till Now" : "Staked After End"}:
							</h3>
							<div className="c2i-form-group">
								<div className="c2i-form-control">
									<Input
										type="number"
										min={1}
										disabled
										value={BaseHelper.numberToCurrencyStyle(earnNow)}
										placeholder={`${BaseHelper.numberToCurrencyStyle(earnNow)}`}
									/>
								</div>
							</div>
						</Space>
						<div className="flex justify-between wrap">
							<Button
								className={`${item?.duration != 0 ? "confirm-btn" : "confirm-btn-twins"
									} c2i-no-margin`}
								onClick={() => buttonHandler(item?.stakeId, item?.nftId, 0)}
								loading={isloadingClaim}
								disabled={item?.duration == 0 ? !canClaim : disableBtn}
							>
								Claim Now
							</Button>

							{item?.duration != 0 ? (
								<></>
							) : (
								<Button
									className="confirm-btn-twins c2i-no-margin"
									onClick={() => buttonHandler(item?.stakeId, item?.nftId, 1)}
									loading={isloadingStake}
								>
									Unstake Now
								</Button>
							)}
						</div>
					</Space>
				</Space>
			</div>
		</Col>
	);
};

export default StakingItem;
