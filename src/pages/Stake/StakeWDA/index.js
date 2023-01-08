import { Button, Col, Input, message, Row, Select, Spin } from "antd";
import { ethers } from "ethers";
import React, { Fragment, useEffect, useState } from "react";
import ModalWallet from "src/layout/Topbar/ModalWallet";

import BaseHelper from "./../../../utils/BaseHelper";
import FadeAnimationOdd from "../../../layout/fadeAnimation/FadeAnimationOdd";
import Container from "../../../layout/grid/Container";
// import History from "./History";

import StakingContract from "../../../constants/contracts/FishdomStaking.sol/FishdomStaking.json";
import { useSelector } from "react-redux";
import { user$ } from "src/redux/selectors";
import { useWeb3React } from "@web3-react/core";

const { Option } = Select;
var stakingContract;
var tokenContract;

function StakeWDA() {
	const { library, account, active, chainId } = useWeb3React()
	const [listSelect, setListSelect] = useState([]);
	const [stakingData, setStakingData] = useState([
		{
			valueDuration: 0,
			label: "Select Staking Day",
		},
	]);
	const [showPopupWallet, setshowPopupWallet] = useState(false);
	const [loading, setLoading] = useState(true);
	const [disable, setDisbale] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	//hook staking
	const [totalStaked, setTotalStaked] = useState("0");
	const [stakingAmount, setStakingAmount] = useState(0);
	const [valueSelectNFT, setValueSelectNFT] = useState({ id: 0 });
	const [valueSelectStakingDay, setValueSelectStakingDay] = useState(
		stakingData[0]
	);

	const [newStaked, setNewStaked] = useState();

	const userData = useSelector(user$)

	useEffect(() => {
		try {
			(async () => {
				if (stakingContract) {
					const dataSelect = await stakingContract.getListPackage(
						valueSelectNFT?.id
					);
					setListSelect(dataSelect);
				}
			})();
		} catch (error) {
			console.log(error);
		}
	}, [valueSelectNFT]);

	useEffect(() => {
		try {
			if (listSelect?.length > 0) {
				let listTemp = [];
				listTemp.push({
					valueDuration: 0,
					label: "Select Staking Days",
				});
				listSelect.map((item) => {
					listTemp.push({
						selectType: item.id,
						valueDuration: item.duration,
						label: `${item.duration} Days - ${item.apr}% APR`,
					});
				});
				setStakingData(listTemp);
			}
		} catch (error) {
			console.log(error);
		}
	}, [listSelect]);

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
	console.log(userData);
	async function handleClickMax() {
		setStakingAmount(userData.balance)
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
			/// aprove WDA
			const approveRes = await tokenContract.approve(
				StakingContract.networks[chainId].address,
				stakingAmountToWei
			);
			await approveRes.wait();
			// stake
			const stakingRes = await stakingContract.stake(
				stakingPackage.selectType,
				valueSelectNFT.id,
				stakingAmountToWei.toString()
			);
			await stakingRes
				.wait()
				.then(async (res) => {
					// fetch new data
					Promise.all([await stakingContract.totalStaked()]).then((res) => {
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
						setValueSelectNFT({ id: 0 });
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

	const showWallet = () => {
		setshowPopupWallet(true);
	};
	const hideWallet = () => {
		setshowPopupWallet(false);
	};
	const handleCancel = () => {
		setValueSelectNFT({ id: 0 });
	};

	return (
		<Fragment>
			{showPopupWallet && (
				<ModalWallet isModalVisible={showPopupWallet} hideWallet={hideWallet} />
			)}
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
			{/* <History
				showWallet={showWallet}
				walletConnect={walletConnect}
				CrownContract={CrownContract}
				history={history}
				newStaked={newStaked}
			/> */}
		</Fragment>
	);
}
export default StakeWDA;
