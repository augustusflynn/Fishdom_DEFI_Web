import { Button, Col, Input, message, Row, Select, Spin } from "antd";
import { ethers } from "ethers";
import React, { Fragment, useEffect, useState } from "react";

import BaseHelper from "./../../utils/BaseHelper";
import FadeAnimationOdd from "../../layout/fadeAnimation/FadeAnimationOdd";
import Container from "../../layout/grid/Container";
import History from "./History";

import StakingContract from "../../constants/contracts/FishdomStaking.sol/FishdomStaking.json";
import TokenContract from "../../constants/contracts/token/FishdomToken.sol/FishdomToken.json";
import { useSelector } from "react-redux";
import { user$ } from "src/redux/selectors";
import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import _ from "lodash";

const { Option } = Select;
var stakingContract;
var tokenContract;

function Staking() {
	const { library, account, active, chainId } = useWeb3React()
	const stakingData = [
		{ valueDuration: 0, label: 'Select Staking Days' },
		{ selectType: 0, valueDuration: '30', label: '30 Days - 100% APR' },
		{ selectType: 1, valueDuration: '90', label: '90 Days - 138% APR' },
		{ selectType: 2, valueDuration: '180', label: '180 Days - 220% APR' },
		{ selectType: 3, valueDuration: '0', label: '0 Days - 5% APR' }
	];

	const [loading, setLoading] = useState(true);
	const [disable, setDisbale] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	//hook staking
	const [totalStaked, setTotalStaked] = useState("0");
	const [stakingAmount, setStakingAmount] = useState(0);
	const [valueSelectStakingDay, setValueSelectStakingDay] = useState(
		stakingData[0]
	);

	const userData = useSelector(user$)

	const getTotalStaked = async () => {
		tokenContract = new ethers.Contract(
			TokenContract.networks[process.env.REACT_APP_NETWORK_ID].address,
			TokenContract.abi,
			await library.getSigner(account)
		)
		let totalStaked = await tokenContract.balanceOf(StakingContract.networks[process.env.REACT_APP_NETWORK_ID].address)
		setTotalStaked(
			BaseHelper.numberToCurrencyStyle(
				ethers.utils.formatEther(totalStaked.toString())
			)
		);
	}

	useEffect(() => {
		if (!active || _.isEmpty(userData)) {
			return
		}
		try {
			(async () => {
				stakingContract = new ethers.Contract(
					StakingContract.networks[process.env.REACT_APP_NETWORK_ID].address,
					StakingContract.abi,
					await library.getSigner(account)
				)
				getTotalStaked()
				setLoading(false)
			})();
		} catch (error) {
			console.log(error);
		}
	}, [active, userData]);

	const onchangeValueTypeStaking = (value) => {
		setValueSelectStakingDay(value);
	};

	//onchange value amount
	const onChangeValueAmount = (e) => {
		const splitValue = e.target.value?.split(".")[1];
		if (e.target.value.toString().charAt(0) == "0") {
			setStakingAmount("");
			return;
		}
		if (splitValue?.length > 2) {
			setStakingAmount(stakingAmount);
			return;
		}
		setStakingAmount(e.target.value);
	};

	async function handleClickMax() {
		tokenContract = new ethers.Contract(
			TokenContract.networks[process.env.REACT_APP_NETWORK_ID].address,
			TokenContract.abi,
			await library.getSigner(account)
		)
		let userBalance = await tokenContract.balanceOf(account)
		setStakingAmount(userBalance.toString())
	}

	async function storeData(txHash) {
		await axios.post(
			process.env.REACT_APP_API_URL + '/Staking/stake',
			{
				txHash: txHash
			},
			{
				headers: {
					Authorization: `Bearer ${userData.token}`
				}
			}
		)
	}

	//staking
	async function handleStake() {
		try {
			if (!parseInt(valueSelectStakingDay)) {
				message.error("Staking day is not valid!");
				return;
			}
			if (!stakingAmount || isNaN(stakingAmount)) {
				message.error("Staking amount is not valid!");
				return;
			}

			setIsLoading(true);
			setDisbale(true);
			const stakingPackage = stakingData[parseInt(valueSelectStakingDay)];
			const stakingAmountToWei = ethers.utils.parseEther(
				stakingAmount.toString()
			);
			/// aprove token
			tokenContract = new ethers.Contract(
				TokenContract.networks[process.env.REACT_APP_NETWORK_ID].address,
				TokenContract.abi,
				await library.getSigner(account)
			)
			const approveRes = await tokenContract.approve(
				StakingContract.networks[chainId].address,
				stakingAmountToWei
			);
			await approveRes.wait();
			// stake
			stakingContract = new ethers.Contract(
				StakingContract.networks[process.env.REACT_APP_NETWORK_ID].address,
				StakingContract.abi,
				await library.getSigner(account)
			)
			const stakingRes = await stakingContract.stake(
				stakingPackage.selectType,
				stakingAmountToWei
			);

			await stakingRes
				.wait()
				.then(async () => {
					// fetch new data
					Promise.all([
						await storeData(stakingRes.hash),
						await getTotalStaked()
					])
						.then(() => {
							setValueSelectStakingDay({
								stakingType: 1,
								valueDuration: 0,
								label: "Select Staking Days",
							});
							setStakingAmount(0);
							setIsLoading(false);
							setDisbale(false);
						});
				})
				.then(async () => {
					message.success(
						"Staking successfully! Please wait for 1-3 minutes for actually showing up"
					);
				})
				.catch((error) => {
					if (error.code == 4001) {
						message.error("Transaction cancelled");
					} else {
						message.error("Something went wrong. Please try again");
					}
					setIsLoading(false)
					setDisbale(false);
				});


		} catch (error) {
			setIsLoading(false);
			console.log("stakign error", error);
			if (
				error?.data?.message ==
				"execution reverted: ERC20: transfer amount exceeds balance"
			) {
				message.error("transfer amount exceeds balance");
				setDisbale(false);
				return;
			}
			if (
				error?.data?.message?.includes("nonce") ||
				error?.message.includes("nonce")
			) {
				message.error("Please try again!");
				setDisbale(false);
				return;
			}
			if (
				error?.data?.message?.includes("replacement fee") ||
				error?.message.includes("replacement fee")
			) {
				message.error("Please try again!");
				setDisbale(false);
				return;
			}
			if (
				error?.data?.message?.includes("out-of-bounds") ||
				error?.message.includes("out-of-bounds")
			) {
				message.error("Overallowance amount of staking wda!");
				setDisbale(false);
				return;
			}
			if (error.code == 4001) {
				message.error("Transaction cancelled!");
			} else {
				message.error(error?.data?.message || error?.message);
			}

			setDisbale(false);
		}
	}

	return (
		<Fragment>
			<section className="section" id="section-stake-Wda" data-aos="fade-up">
				<FadeAnimationOdd />
				<Container>
					<div className="module-header text-center" id="header-checkscroll">
						Staking FDT
					</div>

					<Fragment>
						{loading ? (
							<Spin />
						) : (
							<Fragment>
								<div className="border-round">
									<div className="text-title-default item-round text-center">
										Balance of Contract:&nbsp;{parseFloat(totalStaked).toFixed(7)}&nbsp;FDT
									</div>
								</div>
								<Row justify="center">
									<Col xs={24} md={15} lg={11}>
										<div className="module-content">
											<div style={{ margin: "24px 0px" }}>
												{" "}
												<div className="module-blur custom-color-title custom-font-special custom-no-margin">
													Staking Day
												</div>
												<div className="custom-form-group">
													<div className="custom-form-control" id="stake-wda">
														<Select
															value={valueSelectStakingDay}
															getPopupContainer={() =>
																document.querySelector("#stake-wda")
															}
															destroyPopupOnHide
															onChange={onchangeValueTypeStaking}
															className="text-sub"
														>
															{stakingData.map((item, index) => (
																<Option key={index}>{item.label}</Option>
															))}
														</Select>
													</div>
												</div>
											</div>

											<div style={{ margin: "24px 0px" }}>
												{" "}
												<div className="module-blur custom-color-title custom-font-special custom-no-margin">
													Staking
												</div>
												<div className="custom-form-group">
													<div className="custom-form-control">
														<Input
															type="number"
															width="100%"
															className="text-sub"
															value={stakingAmount}
															placeholder="FDT Amount..."
															onChange={onChangeValueAmount}
														/>
														<Button
															className="d-flex align-center"
															onClick={handleClickMax}
														>
															Max
														</Button>
													</div>
												</div>
											</div>

											<p className="module-line"></p>
											<div style={{ margin: "24px 0px" }}>
												<Button
													style={{ width: "100%" }}
													loading={isLoading}
													disabled={disable}
													onClick={handleStake}
												>
													<span className="text-sub"> Stake Now</span>
												</Button>
											</div>
										</div>
									</Col>
								</Row>
							</Fragment>
						)}
					</Fragment>
				</Container>
			</section>
			<History />
		</Fragment>
	);
}
export default Staking;
