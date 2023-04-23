import { Button, Col, Input, message, Space } from "antd";
import { ethers } from "ethers";
import moment from "moment";
import React, { useEffect, useState } from "react";
import StakingContract from "../../../../constants/contracts/FishdomStaking.sol/FishdomStaking.json";
import BaseHelper from "src/utils/BaseHelper";
import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import { useSelector } from "react-redux";
import { user$ } from "src/redux/selectors";
import _ from "lodash";

const UNIT_TO_SECOND = 10

const StakingItem = (props) => {
	const userData = useSelector(user$)
	const { item, stakes, getData } = props;
	const { active, library, account, chainId } = useWeb3React()
	const [isloadingStake, setIsLoadingStake] = useState(false);
	const [isloadingClaim, setIsLoadingClaim] = useState(false);
	const [earnNow, setEarnNow] = useState(0);
	const expiredTime =
		moment(item?.createdAt)
			.add(parseInt(item?.duration * UNIT_TO_SECOND), "seconds")
			.toDate()
			.getTime() || 0


	const disableBtn = moment().toDate().getTime() < expiredTime;

	useEffect(() => {
		(async () => {
			if (active && !_.isEmpty(item)) {
				const stakeContract = new ethers.Contract(
					StakingContract.networks[chainId].address,
					StakingContract.abi,
					await library.getSigner(account)
				);
				const earned = await stakeContract.getEarned(item?.stakeId);
				const parsedEarned = parseFloat(ethers.utils.formatEther(earned.toString())).toFixed(7)
				setEarnNow(parsedEarned);
				if (item?.duration !== 0) {
					localStorage.setItem(`Staking_${item.stakeId}`, parsedEarned)
				}
			}
		})();
		return () => { };
	}, [active, item]);

	const onStoreDataClaim = async (txHash) => {
		await axios.post(
			process.env.REACT_APP_API_URL + '/api/stakings/claim',
			{
				txHash: txHash
			},
			{
				headers: {
					Authorization: `Bearer ${userData.token}`
				}
			}
		)
			.then((res) => {
				if (res.data && res.data.msg === "INVALID_SIGNER") {
					message.error("Invalid signature")
				} else {
					localStorage.removeItem(`Staking_${item.stakeId}`)
					getData(0)
				}
				setIsLoadingClaim(false);
			})
			.catch(() => {
				setIsLoadingClaim(false);
			})
	}

	const onStoreDataUnstake = (txHash) => {
		axios.post(
			process.env.REACT_APP_API_URL + '/api/stakings/unstake',
			{
				txHash: txHash
			},
			{
				headers: {
					Authorization: `Bearer ${userData.token}`
				}
			}
		)
			.then((res) => {
				if (res.data && res.data.msg === "INVALID_SIGNER") {
					message.error("Invalid signature")
				} else {
					localStorage.removeItem(`Staking_${item.stakeId}`)
					getData(0)
				}
			})
	}

	const handleClaim = async () => {
		if (!active) {
			return
		}
		try {
			const stakeContract = new ethers.Contract(
				StakingContract.networks[chainId].address,
				StakingContract.abi,
				await library.getSigner(account)
			)
			setIsLoadingClaim(true);
			const tx = await stakeContract.claim(item?.stakeId);
			await tx.wait()
			setIsLoadingClaim(false);
			await onStoreDataClaim(tx.hash);
			message.success(
				"Successfully! Please wait 2-3 minutes for actually execution!"
			);
		} catch (err) {
			setIsLoadingClaim(false);
			message.error(err?.data?.message || "Cancel execution!");
		}
	}

	const handleUnstake = async () => {
		if (!active) {
			return
		}
		try {
			const stakeContract = new ethers.Contract(
				StakingContract.networks[chainId].address,
				StakingContract.abi,
				await library.getSigner(account)
			)
			setIsLoadingStake(true);
			const tx = await stakeContract.unstake(item.stakeId);
			await tx.wait()
				.then(() => {
					onStoreDataUnstake(tx.hash)
					setIsLoadingStake(false);
					message.success(
						"Successfully! Please wait 2-3 minutes for actually execution!"
					);
				});
		} catch (err) {
			setIsLoadingStake(false);
			console.log(err);
			message.error(err?.data?.message || "Cancel execution!");
		}
	}

	return (
		<Col xs={24} sm={stakes.data.length === 1 ? 24 : 12}>
			<div className="frame">
				<Space direction="vertical" size={16}>
					<Space direction="vertical" size={4}>
						<h2 className="module-title custom-no-margin">
							<span className="custom-color-green">{`${BaseHelper.numberToCurrencyStyle(
								ethers.utils.formatEther(item?.amount)
							)}`}</span>{" "}
							FDT has been staked
						</h2>
						<p className="module-blur custom-no-margin flex wrap">
							<span className="mr-8">Staking Days: </span>
							<span className="custom-color-title">
								{`${item?.duration} Days - ${item?.apr}% APR`}
							</span>
						</p>
						{item?.duration != 0 ? (
							<p className="module-blur custom-no-margin flex wrap">
								<span className="mr-8">Expired Time:</span>
								{expiredTime - moment().toDate().getTime() <= 86400000 ? (
									<span>
										Expired
									</span>
								) : (
									<span className="custom-color-title">{`${moment(
										expiredTime
									).format("LLL")}`}</span>
								)}
							</p>
						) : (
							<p className="module-blur custom-no-margin flex">
								{`${"Expired Time: "}`}
								<span className="custom-color-title ml-8"> Unlimited Time</span>
							</p>
						)}
					</Space>
					<div className="line"></div>
					<Space direction="vertical" size={24} className="buy-section">
						<Space direction="vertical" size={12} className="input-section">
							<h3 className="module-blur custom-no-margin custom-color-title custom-font-special">
								Interest Rate (per year)
							</h3>
							<div className="custom-form-group">
								<div className="custom-form-control">
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
							<h3 className="module-blur custom-no-margin custom-color-title custom-font-special">
								FDT Amount
							</h3>
							<div className="custom-form-group">
								<div className="custom-form-control">
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
							<h3 className="module-blur custom-no-margin custom-color-title custom-font-special">Earned</h3>
							<div className="custom-form-group">
								<div className="custom-form-control">
									<Input
										type="number"
										min={1}
										disabled
										value={earnNow ? BaseHelper.numberToCurrencyStyle(earnNow) : "..."}
										placeholder={`${BaseHelper.numberToCurrencyStyle(earnNow)}`}
									/>
								</div>
							</div>
						</Space>
						<div>
							<Space size="middle">
								<Button
									className={`${item?.duration === '0' ? "confirm-btn" : "confirm-btn-twins"} custom-no-margin`}
									onClick={handleClaim}
									loading={isloadingClaim}
									disabled={item?.duration === '0' ? false : disableBtn}
								>
									Claim Now
								</Button>

								{item?.duration === '0' ? (
									<Button
										className="confirm-btn-twins custom-no-margin"
										onClick={handleUnstake}
										loading={isloadingStake}
									>
										Unstake Now
									</Button>
								) : (
									<></>
								)}
							</Space>
						</div>
					</Space>
				</Space>
			</div>
		</Col>
	);
};

export default StakingItem;
