import { Button, Col, Image, message, Row, Select, Spin } from "antd";
import { ethers } from "ethers";
import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ModalWallet from "src/layout/Topbar/ModalWallet";
import { wallet$, walletFake$ } from "src/redux/selectors";
import * as MoralisQuery from "src/utils/MoralisQuery";
import _miningContract from "../../../constants/abiMining.json";
import iconClose from "./../../../assets/images/iconClose.svg";
import {
	crownNFTAbi,
	crownNFTAdress,
	wdaAbi,
	wdaAddress,
} from "../../../constants/constants";
import FadeAnimationOdd from "../../../layout/fadeAnimation/FadeAnimationOdd";
import Container from "../../../layout/grid/Container";
import iconNFT from "./../../../assets/images/staking/iconNFT.svg";
import iconNFTGreen from "./../../../assets/images/staking/iconNFTGreen.svg";
import History from "./History";
import ModalMining from "./ModalMining";
import BaseHelper from "./../../../utils/BaseHelper";
import { providerFake } from "src/constants/apiContants";
import { useNavigate } from "react-router-dom";
const { Option } = Select;

var miningContract;
var wdaContract;
var nftContract;
var CrownContract;
let count = 0;
function MiningCROWN() {
	const [listSelect, setListSelect] = useState([]);
	const [miniData, setMiningData] = useState([
		{
			miningType: 0,
			label: "Select Mining Days",
		},
	]);
	const listPacketId = [0, 1, 2];
	const navigate = useNavigate();
	const history = React.useRef(null);
	const walletConnect = useSelector(wallet$);
	const walletConnectFake = useSelector(walletFake$);
	const [showModalChooseNFT, setShowModalChooseNFT] = useState(false);
	const [ShowPopupWallet, setShowPopupWallet] = useState(false);
	const [loading, setLoading] = useState(true);
	const [newMining, setNewMining] = useState();

	//start useState staking
	const [totalMinted, setTotalMinted] = useState(0);
	const [valueSelectMiningDay, setValueSelectMiningDay] = useState(miniData[0]);
	const [valueSelectNFT, setValueSelectNFT] = useState({
		id: 0,
		attributes: [
			{
				value: 0,
			},
		],
	});

	const [isLoading, setIsLoading] = useState(false);

	const { miningAddress, miningAbi } = _miningContract;
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [totalMinted]);
	const onchangeValueTypeStaking = (value) => {
		setValueSelectMiningDay(value);
	};

	useEffect(() => {
		try {
			setLoading(true);
			handleCancel();
			setValueSelectMiningDay(miniData[0]);
			var isSubscribed = true;
			const init = async () => {
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
				miningContract = new ethers.Contract(
					miningAddress,
					miningAbi,
					provider
				);
				wdaContract = new ethers.Contract(wdaAddress, wdaAbi, provider);
				nftContract = new ethers.Contract(
					crownNFTAdress,
					crownNFTAbi,
					provider
				);
				if (miningContract && wdaContract && nftContract) {
					if (!isSubscribed) return;

					setShowPopupWallet(false);
					try {
						Promise.all([await CrownContract.totalSupply()]).then((res) => {
							setTotalMinted(res["0"].toString());
						});
					} catch (error) {
						console.log("get data staking error: ", error);
					}
				}
			};
			isSubscribed && init();
			setLoading(false);
		} catch (error) {
			setLoading(false);
		}
		return () => (isSubscribed = false);
	}, [walletConnect]);
	useEffect(() => {
		try {
			(async () => {
				let provider = new ethers.providers.JsonRpcProvider(providerFake);
				if (walletConnect) {
					provider = walletConnect;
				}
				let miningContract = new ethers.Contract(
					miningAddress,
					miningAbi,
					provider
				);
				let data = await miningContract.getListPackage(valueSelectNFT?.id);
				setListSelect(data);
				console.log("data ne");
				console.log(data);
				console.log("data ne");

				data.map((item, index) => {
					console.log("index" + index);
					console.log(item[0].toString());
					console.log(item[1].toString());

					// console.log(item[2].toString());
					// console.log(item[3].toString());
				});
				console.log("data ne");
			})();
		} catch (error) {}
	}, [walletConnect, valueSelectNFT]);

	useEffect(() => {
		try {
			if (listSelect?.length > 0) {
				let listTemp = [];
				listTemp.push({
					miningType: 0,
					label: "Select Staking Days",
				});

				listSelect.map((item) => {
					console.log("fddddddddddddddddddddddddddddddddddddddddddddddddddddd");
					console.log(item);
					console.log("fddddddddddddddddddddddddddddddddddddddddddddddddddddd");

					listTemp.push({
						miningType: +item.id?.toString(),
						label: `${item.duration.toString()} Days - ${parseInt(
							ethers.utils.formatEther(item.amount.toString())
						)} WDA`,
						amount: ethers.utils.formatEther(item.amount.toString()),
					});
				});
				setMiningData(listTemp);
			}
		} catch (error) {
			console.log(error);
		}
	}, [listSelect]);
	// start show modal choose NFT
	const handleShowModal = () => {
		if (!walletConnect) {
			setShowPopupWallet(true);
			return;
		}
		setShowModalChooseNFT(true);
	};
	//end show modal choose NFT
	// start option wallete
	const showWallet = () => {
		setShowPopupWallet(true);
	};
	const hideWallet = () => {
		setShowPopupWallet(false);
	};
	// end option wallet
	async function handleMint() {
		if (!walletConnect) {
			setShowPopupWallet(true);
			return;
		}
		try {
			if (!parseInt(valueSelectMiningDay)) {
				message.error("Mining day is not valid");
				return;
			}
			if (!miningContract || !wdaContract || !nftContract) return;

			setShowPopupWallet(false);
			setIsLoading(true);
			const miningAmount = miniData[parseInt(valueSelectMiningDay)];
			console.log(miningAmount);
			const miningAmountToWei = ethers.utils.parseEther(
				(miningAmount?.amount).toString()
			);
			console.log(" day ne");

			console.log(parseInt(miningAmount?.amount).toString());
			///approve wda
			const approveRes = await wdaContract.approve(
				miningAddress,
				miningAmountToWei
			);
			await approveRes.wait().then((res) => console.log(res));

			console.table([miningAddress, miningAmountToWei.toString()]);
			///approve nft

			if (valueSelectNFT.id > 0) {
				const approveNFT = await nftContract.approve(
					miningAddress,
					valueSelectNFT.id
				);
				console.log(" approve nft");

				await approveNFT.wait().then((res) => console.log(res));
			}
			console.log(" daty nhe");
			console.log(parseInt(miningAmount.miningType));
			console.log(valueSelectNFT?.id);
			// return;
			console.log(" day nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn");
			console.log(parseInt(miningAmount.miningType));
			console.log(valueSelectNFT?.id);
			const minningRes = await miningContract.mint(
				parseInt(miningAmount.miningType),
				// 0,
				valueSelectNFT?.id || 0
				// 0
			);
			await minningRes
				.wait()
				.then(async () => {
					Promise.all([await CrownContract.totalSupply()]).then((res) => {
						setTotalMinted(res["0"].toString());
						setIsLoading(false);
						setValueSelectMiningDay({
							miningType: 0,
							label: "Select Mining Days",
						});
						setValueSelectNFT({
							id: 0,
							attributes: [
								{
									value: 0,
								},
							],
						});
					});
				})
				.then(async () => {
					message.success("Mining successfully");
					message.warning(
						"After 1-3 minutes, it will show up in claim section"
					);
					// navigate("/claim?tab=crown");
					setNewMining(
						await MoralisQuery.makeQueryBuilder("HistoryMining").first()
					);
					setIsLoading(false);
				})
				.catch((error) => {
					message.error(
						error?.data?.message || error?.message || "Mining error!"
					);
					setIsLoading(false);
				});
		} catch (error) {
			setIsLoading(false);
			if (
				error?.data?.message ==
				"execution reverted: ERC20: transfer amount exceeds balance"
			) {
				message.error("transfer amount exceeds balance");
				return;
			}
			if (error?.data?.message?.includes("nonce")) {
				message.error("Please try again!");
				return;
			}
			if (error.code == 4001) {
				message.error("Transaction cancelled!");
			} else {
				message.error(error?.data?.message || error?.message);
			}
		}
	}
	const handleCancel = () => {
		setValueSelectNFT({
			id: 0,
			attributes: [
				{
					value: 0,
				},
			],
		});
	};
	return (
		<Fragment>
			{ShowPopupWallet && (
				<ModalWallet isModalVisible={ShowPopupWallet} hideWallet={hideWallet} />
			)}
			{showModalChooseNFT && (
				<ModalMining
					walletConnect={walletConnect}
					CrownContract={CrownContract}
					isShowModal={showModalChooseNFT}
					setShowModal={setShowModalChooseNFT}
					setValueSelectNFT={setValueSelectNFT}
				/>
			)}
			<section className="section" id="section-stake-Wda" data-aos="fade-up">
				<FadeAnimationOdd />
				<Container>
					<div className="module-header text-center">Mining CROWN</div>
					{totalMinted < 5000 ? (
						<Fragment>
							{loading ? (
								<Spin />
							) : (
								<Fragment>
									<div className="border-round">
										<div className="text-title-default item-round text-center">
											Minted:&nbsp;{totalMinted}&nbsp;/5000 CROWN NFT
										</div>
									</div>
									<Row justify="center">
										<Col xs={24} md={15} lg={11}>
											<div className="module-content">
												<div style={{ margin: "24px 0px" }}>
													{" "}
													<div className="text-title">Mining Days</div>
													<div className="c2i-form-group">
														<div className="c2i-form-control" id="mining">
															<Select
																value={valueSelectMiningDay}
																onChange={onchangeValueTypeStaking}
																className="text-sub"
																getPopupContainer={() =>
																	document.querySelector("#mining")
																}
															>
																{miniData.map((item, index) => (
																	<Option key={index}>{item.label}</Option>
																))}
															</Select>
														</div>
													</div>
												</div>
												<div style={{ margin: "24px 0px" }}>
													{" "}
													<div className="text-title">Choose NFT</div>
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
																	alt=""
																	onClick={handleCancel}
																	className="icon-close"
																	style={{ marginLeft: 10 }}
																/>
															</div>
														</div>
														<div
															className="text-title-default"
															style={{
																marginLeft: 26,
																alignItems: "center",
																display: "flex",
																// color: valueSelectNFT?.aprBonus
																// ?
																//  "#72DE99"
																// : "#fff",
																color: "#72DE99",
															}}
														>
															{/*  {valueSelectNFT?.attributes.value.filter(
                                (item) => item?.trais_type == "Reduce"
                              ).value || "0"} */}
															{(valueSelectNFT?.attributes &&
																Object.keys(valueSelectNFT?.attributes)
																	?.length > 0 &&
																valueSelectNFT?.attributes?.find(
																	(item) => item["trais_type"] == "Reduce"
																)?.value) ||
																"0"}
															% Reduce
														</div>
													</Row>
												</div>
												<p className="module-line"></p>
												<div style={{ margin: "24px 0px" }}>
													<Button
														style={{ width: "100%" }}
														loading={isLoading}
														onClick={handleMint}
														disabled={isLoading}
													>
														<span className="text-sub"> Mine Now</span>
													</Button>
												</div>
											</div>
										</Col>
									</Row>
								</Fragment>
							)}
						</Fragment>
					) : (
						<Fragment>
							<div className="text-center">
								<div className="module-header text-center">
									event has ended!
								</div>
								<div
									className="border-round text-sub"
									style={{
										color: "#FE84CF",
										border: "1.5px solid #FE84CF",
										padding: "8px",
										borderRadius: "38px",
										display: "inline-block",
									}}
								>
									5.000 / 5.000 CROWN has been minted!
								</div>
							</div>
						</Fragment>
					)}
				</Container>
			</section>
			<History
				showWallet={showWallet}
				walletConnect={walletConnect}
				newMining={newMining}
				CrownContract={CrownContract}
				history={history}
			/>
		</Fragment>
	);
}
export default MiningCROWN;
