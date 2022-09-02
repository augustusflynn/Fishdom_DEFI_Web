import { Button, Col, Image, Input, message, Row, Select, Spin } from "antd";
import { ethers } from "ethers";
import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ModalWallet from "src/layout/Topbar/ModalWallet";
import { wallet$, walletFake$ } from "src/redux/selectors";
import IconWallet from "../../../assets/png/topbar/icon-wallet-white.svg";
import * as MoralisQuery from "src/utils/MoralisQuery";

import BaseHelper from "./../../../utils/BaseHelper";

import StakingContract from "../../../constants/abiStaking.json";
import {
	crownNFTAbi,
	crownNFTAdress,
	wdaAbi,
	wdaAddress,
} from "../../../constants/constants";
import FadeAnimationOdd from "../../../layout/fadeAnimation/FadeAnimationOdd";
import Container from "../../../layout/grid/Container";
import iconNFT from "./../../../assets/images/staking/iconNFT.svg";
import iconClose from "./../../../assets/images/iconClose.svg";
import iconNFTGreen from "./../../../assets/images/staking/iconNFTGreen.svg";
import History from "./History";
import ModalStaking from "./ModalStaking";
import { providerFake } from "src/constants/apiContants";
import { Navigate, useNavigate } from "react-router-dom";
const { Option } = Select;
/**
 * @author hungc2i
 */
var stakingContract;
var wdaContract;
var nftContract;
var CrownContract;
let count = 0;
function StakeWDA() {
	//hook util\
	const navigate = useNavigate();
	const history = React.useRef(null);
	const walletConnect = useSelector(wallet$);
	const walletConnectFake = useSelector(walletFake$);
	const [listSelect, setListSelect] = useState([]);
	const [stakingData, setStakingData] = useState([
		{
			valueDuration: 0,
			label: "Select Staking Days",
		},
	]);
	const listDuration = [0, 1, 3, 6];
	const [showModalChooseNFT, setShowModalChooseNFT] = useState(false);
	const [ShowPopupWallet, setShowPopupWallet] = useState(false);
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

	let cleanUp = true;

	const { stakingAddress, stakingAbi } = StakingContract;
	//function

	useEffect(() => {
		try {
			handleCancel();
			setValueSelectStakingDay(stakingData[0]);
			window.scrollTo(0, 0);
			var isSubscribed = true;
			const init = async () => {
				// let provider = walletConnect ? walletConnect : walletConnectFake;
				// count++;
				// if (count == 1) {
				//   return;
				// }
				let provider;
				if (walletConnect) {
					provider = walletConnect;
				} else {
					provider = new ethers.getDefaultProvider("kovan");
				}
				CrownContract = new ethers.Contract(
					crownNFTAdress,
					crownNFTAbi,
					provider
				);
				stakingContract = new ethers.Contract(
					stakingAddress,
					stakingAbi,
					provider
				);

				wdaContract = new ethers.Contract(wdaAddress, wdaAbi, provider);
				nftContract = new ethers.Contract(
					crownNFTAdress,
					crownNFTAbi,
					provider
				);
				if (stakingContract && wdaContract && nftContract && CrownContract) {
					isSubscribed && setShowPopupWallet(false);
					try {
						Promise.all([await stakingContract.totalStaked()]).then((res) => {
							setTotalStaked(
								BaseHelper.numberToCurrencyStyle(
									ethers.utils.formatEther(res[0].toString())
								)
							);
						});
					} catch (error) {
						console.log("get data staking error: ", error);
					}
				}
			};
			isSubscribed && init();
		} catch (error) {
			console.log(error);
		}
		return () => ((isSubscribed = false), (cleanUp = false));
	}, [walletConnect]);
	useEffect(() => {
		let isSubscribed = true;
		isSubscribed && totalStaked && setLoading(false);
		return () => (isSubscribed = false);
	}, [totalStaked]);
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
	}, [walletConnect, valueSelectNFT]);

	useEffect(() => {
		try {
			if (listSelect?.length > 0) {
				let listTemp = [];
				listTemp.push({
					valueDuration: 0,
					label: "Select Staking Days",
				});
				listSelect.map((item, idx) => {
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
	//function main
	//get max balance
	async function handleClickMax() {
		if (!walletConnect) {
			setShowPopupWallet(true);
			return;
		}
		try {
			if (!wdaContract) {
				setStakingAmount(0);
				return;
			}
			const address = await walletConnect.getAddress();
			const balanceOfOwner = await wdaContract.balanceOf(address);
			setStakingAmount(
				parseFloat(ethers.utils.formatEther(balanceOfOwner.toString())).toFixed(
					2
				)
			);
		} catch (error) {
			console.log("click maxx error", error);
			message.error(error);
		}
	}
	//staking
	async function handleStake() {
		if (!walletConnect) {
			setShowPopupWallet(true);
			return;
		}
		try {
			if (!parseInt(valueSelectStakingDay)) {
				message.error("Staking day is not valid!");
				return;
			}
			if (
				Number(stakingAmount) < 1 ||
				Number(stakingAmount) == undefined ||
				Number(stakingAmount) == "" ||
				Number(stakingAmount) == "NaN"
			) {
				message.error("Staking amount is not valid!");
				return;
			}

			if (!stakingContract || !wdaContract) return;
			setIsLoading(true);
			setShowPopupWallet(false);
			setDisbale(true);
			const stakingPackage = stakingData[parseInt(valueSelectStakingDay)];
			const stakingAmountToWei = ethers.utils.parseEther(
				stakingAmount.toString()
			);
			/// aprove WDA
			console.log(" so luong stake");
			console.log([stakingAddress, stakingAmountToWei.toString()]);
			const approveRes = await wdaContract.approve(
				stakingAddress,
				stakingAmountToWei
			);
			await approveRes.wait().then((res) => {
				console.log(res);
			});
			/// aprove NFT
			if (valueSelectNFT.id > 0) {
				const approveNFT = await nftContract.approve(
					stakingAddress,
					valueSelectNFT.id
				);
				await approveNFT.wait();
			}
			// stake

			console.log("da fdklfdjfkdjfkdsjfkdj");
			console.table([
				stakingPackage.selectType,
				// stakingPackage.stakingType,
				valueSelectNFT.id,
				stakingAmountToWei.toString(),
			]);
			const stakingRes = await stakingContract.stake(
				stakingPackage.selectType,
				// stakingPackage.stakingType,
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

					// handle
				})
				.then(async () => {
					// history.current("1");
					setNewStaked(await MoralisQuery.makeQueryBuilder("Staked").first());

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
	//function util
	const handleShowModal = () => {
		if (!walletConnect) {
			setShowPopupWallet(true);
			return;
		}
		setShowModalChooseNFT(true);
	};
	const showWallet = () => {
		setShowPopupWallet(true);
	};
	const hideWallet = () => {
		setShowPopupWallet(false);
	};
	const handleCancel = () => {
		setValueSelectNFT({ id: 0 });
	};

	return (
		<Fragment>
			{ShowPopupWallet && (
				<ModalWallet isModalVisible={ShowPopupWallet} hideWallet={hideWallet} />
			)}
			{showModalChooseNFT && (
				<ModalStaking
					CrownContract={CrownContract}
					isShowModal={showModalChooseNFT}
					setShowModal={setShowModalChooseNFT}
					setValueSelectNFT={setValueSelectNFT}
				/>
			)}
			<section className="section" id="section-stake-Wda" data-aos="fade-up">
				<FadeAnimationOdd />
				<Container>
					<div className="module-header text-center" id="header-checkscroll">
						Staking WDA
					</div>

					<Fragment>
						{loading ? (
							<Spin />
						) : (
							<Fragment>
								<div className="border-round">
									<div className="text-title-default item-round text-center">
										Staked:&nbsp;{totalStaked}&nbsp;WDA
									</div>
								</div>
								<Row justify="center">
									<Col xs={24} md={15} lg={11}>
										<div className="module-content">
											<div style={{ margin: "24px 0px" }}>
												{" "}
												<div className="module-blur c2i-color-title c2i-font-special c2i-no-margin">
													Staking Days
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
															placeholder="WDA Amount..."
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
											{valueSelectStakingDay != 4 && (
												<div style={{ margin: "24px 0px" }}>
													{" "}
													<div className="module-blur c2i-color-title c2i-font-special c2i-no-margin">
														Choose NFT
													</div>
													<Row style={{ marginTop: 11 }}>
														<div className="border-round choose-nft">
															<div className="text-sub item-round align-center">
																<Image
																	src={
																		valueSelectNFT?.name
																			? iconNFTGreen
																			: iconNFT
																	}
																	preview={false}
																	alt="box"
																/>
																<span
																	style={{ marginLeft: 5 }}
																	onClick={handleShowModal}
																	className=" choose"
																>
																	{valueSelectNFT?.name
																		? valueSelectNFT?.name
																		: "Choose My NFT"}
																</span>
																<img
																	src={iconClose}
																	onClick={handleCancel}
																	alt=""
																	className="icon-close"
																	style={{ marginLeft: 10 }}
																/>
															</div>
														</div>
														<div
															className="text-title-default"
															style={{
																marginLeft: 12,
																alignItems: "center",
																display: "flex",
																color: valueSelectNFT?.aprBonus
																	? "#72DE99"
																	: "#fff",
															}}
														>
															{valueSelectNFT?.aprBonus || "0"}% APR Bonus
														</div>
													</Row>
												</div>
											)}

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
			{cleanUp && (
				<History
					showWallet={showWallet}
					walletConnect={walletConnect}
					CrownContract={CrownContract}
					history={history}
					newStaked={newStaked}
				/>
			)}
		</Fragment>
	);
}
export default StakeWDA;
