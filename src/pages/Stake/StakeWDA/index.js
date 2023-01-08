import { Button, Col, Input, message, Row, Select, Spin } from "antd";
import { ethers } from "ethers";
import React, { Fragment, useEffect, useState } from "react";

import BaseHelper from "./../../../utils/BaseHelper";
import FadeAnimationOdd from "../../../layout/fadeAnimation/FadeAnimationOdd";
import Container from "../../../layout/grid/Container";
import History from "./History";

import StakingContract from "../../../constants/contracts/FishdomStaking.sol/FishdomStaking.json";
import TokenContract from "../../../constants/contracts/token/FishdomToken.sol/FishdomToken.json";
import { useSelector } from "react-redux";
import { user$ } from "src/redux/selectors";
import { useWeb3React } from "@web3-react/core";
import axios from "axios";

const { Option } = Select;
var stakingContract;
var tokenContract;

function StakeWDA() {
	const { library, account, active, chainId } = useWeb3React()
	const [stakingData, setStakingData] = useState([
		{
			valueDuration: 0,
			label: "Select Staking Day",
		},
	]);
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

	useEffect(() => {
		if (!active) {
			return
		}
		try {
			(async () => {
				stakingContract = new ethers.Contract(
					StakingContract.networks[process.env.REACT_APP_NETWORK_ID].address,
					StakingContract.abi,
					await library.getSigner(account)
				)
				if (stakingContract) {
					let dataSelect = await stakingContract.getListPackage();

					if (dataSelect?.length > 0) {
						dataSelect = dataSelect.map((item) => {
							return ({
								selectType: item.id,
								valueDuration: item.duration.toString(),
								label: `${item.duration.toString()} Days - ${item.apr.toString()}% APR`,
							})
						});
						setStakingData([
							{
								valueDuration: 0,
								label: "Select Staking Days",
							},
							...dataSelect
						]);
					}

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
					setLoading(false)
				}
			})();
		} catch (error) {
			console.log(error);
		}
	}, [active]);

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
			process.env.REACT_APP_API_URL + '/api/stakings/stake',
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
					Promise.all([await stakingContract.totalStaked(), await storeData(stakingRes.hash)])
						.then((res) => {
							setTotalStaked(
								BaseHelper.numberToCurrencyStyle(
									ethers.utils.formatEther(res["0"].toString())
								)
							);
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
					message.error(error?.data?.message || error?.message);
					setIsLoading(false)
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
										Staked:&nbsp;{totalStaked}&nbsp;FDT
									</div>
								</div>
								<Row justify="center">
									<Col xs={24} md={15} lg={11}>
										<div className="module-content">
											<div style={{ margin: "24px 0px" }}>
												{" "}
												<div className="module-blur c2i-color-title c2i-font-special c2i-no-margin">
													Staking Day
												</div>
												<div className="c2i-form-group">
													<div className="c2i-form-control" id="stake-wda">
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
												<div className="module-blur c2i-color-title c2i-font-special c2i-no-margin">
													Staking
												</div>
												<div className="c2i-form-group">
													<div className="c2i-form-control">
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
export default StakeWDA;
