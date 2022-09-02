import {
	Button,
	Col,
	Image,
	InputNumber,
	message,
	Progress,
	Row,
	Space,
	Tag,
} from "antd";
import axios from "axios";
import { ethers } from "ethers";
import moment from "moment";
import React, { Fragment, useEffect, useState } from "react";
import { useMoralisSubscription } from "react-moralis";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ConnectWallet from "src/component/button/ConnectWallet";
import notif from "src/component/notif";
import { InputWaiting } from "src/component/skeleton/Skeleton";
import { providerFake } from "src/constants/apiContants";
import BaseHelper from "src/utils/BaseHelper";
import CrownLuckyContract from "../../../constants/abiCrownLucky.json";
import {
	crownNFTAbi,
	crownNFTAdress,
	wdaAbi,
	wdaAddress,
} from "../../../constants/constants";
import Container from "../../../layout/grid/Container";
import CountdownClock from "../../../layout/grid/CountdownClock";
import { wallet$ } from "../../../redux/selectors";
import HistoryWinner from "./HistoryCrown";

const TICKET_COST = 50;
const USER_MAX_ALLOW = 250;
var crownLuckyContract;

const messageObject = {
	0: {
		message: "You can buy ticket at this time!",
		type: "success",
	},
	1: {
		message:
			"You shouldn't buy ticket at this time because the system is generating random winner, please reload after 3 minutes to see next state!",
		type: "warning",
	},
	2: {
		message:
			"You shouldn't buy ticket at this time because the system is burning crown, please reload after 3 minutes to see next state!",
		type: "warning",
	},
	3: {
		message:
			"You shouldn't buy ticket at this time because the system is paying winner, please reload after 3 minutes to see next state!",
		type: "warning",
	},
};

function CROWNLucky() {
	const navigate = useNavigate();

	//util
	const { crownLuckyAddress, crownLuckyAbi } = CrownLuckyContract;
	const walletConnect = useSelector(wallet$);
	const [dataListener, setDataListener] = useState([]);
	//loading
	const [joinNowLoading, setJoinNowLoading] = useState(false);
	const [disableJoinNow, setDisableJoinNow] = useState(false);
	const [contractState, setContractState] = useState(null);

	const [metaLoading, setMetaLoading] = useState(false);
	//main useState

	const [crownQuantity, setCrownQuantity] = useState(0);
	const [scepterQuantity, setScepterQuantity] = useState(0);
	const [ticketSold, setTicketSold] = useState(0);
	const [ownerTicketHeld, setOwnerTicketHeld] = useState(0);
	const [maxTicketProvidePerDay, setMaxTicketProvidePerDay] = useState(50000);

	///end main
	const [totalSupplyCrown, setTotalSupplyCrown] = useState(0);
	const [ticketAmount, setTicketAmount] = useState();
	const [detailTodayToken, setDetailTodayToken] = useState(null);
	const dailyExpiredTime = moment(
		`${moment().utc().format("YYYY-MM-DD")} 01:00 PM`,
		"YYYY-MM-DD HH:mm"
	);
	const nowUTCDate = moment().utc().toDate().getTime();
	const expiredTime =
		dailyExpiredTime.toDate().getTime() < nowUTCDate
			? dailyExpiredTime.add(1, "day")
			: dailyExpiredTime;
	//initialize
	useEffect(() => {
		try {
			if (!walletConnect) {
				return;
			}
			if (
				ownerTicketHeld >= USER_MAX_ALLOW ||
				ticketSold >= maxTicketProvidePerDay
			) {
				setDisableJoinNow(true);
			} else {
				setDisableJoinNow(false);
			}
		} catch (error) {}
	}, [ownerTicketHeld, ticketSold, walletConnect]);
	useEffect(() => {
		let run = true;
		try {
			run &&
				(async () => {
					window.scrollTo(0, 0);
					setTicketAmount(0);
					await init();
				})();
		} catch (error) {}
		return () => {
			run = false;
		};
	}, [walletConnect]); // tung dat depend vao ownerTicketHold
	useMoralisSubscription(
		"CrownTicketWin",
		(query) => query.descending("createdAt").limit(1),
		[],
		{
			live: true,
			onUpdate: async (data) => {
				if (!BaseHelper.checkHasItemInArrayMoralis(dataListener, data)) {
					setDataListener([...dataListener, data]);
					setTicketAmount(0);
					setDisableJoinNow(true);
				}
			},
		}
	);
	useMoralisSubscription(
		"CrownMint",
		(query) => query.descending("createdAt").limit(1),
		[],
		{
			live: true,
			onUpdate: async (data) => {
				try {
					await init();
					setDisableJoinNow(false);
				} catch (error) {}
			},
		}
	);
	async function init() {
		let provider;
		if (walletConnect) {
			provider = walletConnect;
		} else {
			provider = new ethers.providers.JsonRpcProvider(providerFake);
		}
		crownLuckyContract = new ethers.Contract(
			crownLuckyAddress,
			crownLuckyAbi,
			provider
		);
		if (!crownLuckyContract) return;
		setMetaLoading(true);
		try {
			Promise.all([
				await crownLuckyContract.getOwnerCrownNFT(), //số lượng crown đã trúng thưởng
				await crownLuckyContract.getOwnerTicket(), //số lượng vé đã mua
				await crownLuckyContract.ticketSoldPerDay(), //số vé đã bán hết trong 1 ngày
				await crownLuckyContract.todayTokenId(), //id crown được thưởng ngày hôm nay
				walletConnect &&
					(await crownLuckyContract.ownerScepterNFT(
						await walletConnect.getAddress() //số scepter được nhận nắm giữ
					)),
				await crownLuckyContract.maxTicketProvidePerDay(), //số lượng tối đa được mua trong 1 ngày
				await crownLuckyContract.contractState(),
			])
				.then(async (res) => {
					// console.table([
					// 	"số lượng crown đã trúng thưởng: " + res[0]
					// 		? res[0].toString()
					// 		: 0, //số lượng crown đã trúng thưởng
					// 	"số lượng vé đã mua: " + res[1].toString(), //số lượng vé đã mua
					// 	"số vé đã bán hết trong 1 ngày: " + res[2].toString(), //số vé đã bán hết trong 1 ngày
					// 	"id crown được thưởng ngày hôm nay: " + res[3].toString(), //id crown được thưởng ngày hôm nay
					// 	"số scepter được nhận: " + res[4] ? res[4].toString() : 0, //số scepter được nhận nắm giữ
					// 	"số lượng tối đa được mua trong 1 ngày: " + res[5].toString(), //số lượng tối đa được mua trong 1 ngày
					// ]);
					setCrownQuantity(res[0] ? res[0].toString() : 0);
					setScepterQuantity(res[4] ? res[4].toString() : 0);
					setTicketSold(res[2].toString());
					handleGetTraitsNFT(res[3].toString());
					res[1] && setOwnerTicketHeld(res[1].toString());
					setMaxTicketProvidePerDay(res[5].toString());
					setContractState(res[6].toString());
					notif(res[6].toString(), messageObject);
				})
				.catch((error) => {
					console.log(error);
				})
				.finally(() => {
					setMetaLoading(false);
				});
		} catch (error) {
			console.clear();
			console.log("get data crown lucky error", error);
		}
	}
	async function handleGetTraitsNFT(nftId) {
		try {
			let provider;
			if (walletConnect) {
				provider = walletConnect;
			} else {
				provider = new ethers.providers.JsonRpcProvider(providerFake);
			}
			const crownNFTContract = new ethers.Contract(
				crownNFTAdress,
				crownNFTAbi,
				provider
			);
			if (!crownNFTContract) return;
			const totalSupply = await crownNFTContract.totalSupply();
			setTotalSupplyCrown(totalSupply.toString());
			const NFTURI = await crownNFTContract.tokenURI(nftId);
			const NFTDetail = await axios
				.get(NFTURI)
				.then((res) => {
					if (res.status === 200) {
						return res.data;
					}
					return {};
				})
				.catch((e) => {
					console.error(e);
				});
			console.log("nft detail");
			console.log(NFTDetail);
			setDetailTodayToken({
				reduce: NFTDetail?.attributes.find(
					(item) => item.trais_type === "Reduce"
				)?.value,
				aprBonus: NFTDetail?.attributes.find(
					(item) => item.trais_type === "AprBonus"
				)?.value,
				...NFTDetail,
			});
		} catch (error) {
			console.log("get traits error", error);
		}
	}
	async function handleClickMax() {
		try {
			if (walletConnect) {
				const _ownerTicket = await crownLuckyContract.getOwnerTicket();
				let max = USER_MAX_ALLOW - _ownerTicket;
				setTicketAmount(parseInt(max));
			}
		} catch (error) {}
	}
	function handleFormatQuantity(stringQuantity) {
		if (!stringQuantity) return "0";
		if (stringQuantity.length !== 4) return stringQuantity;
		return `${stringQuantity[0]}.${stringQuantity.substring(1)}`;
	}

	async function handleBuyTicket(e) {
		e.preventDefault();
		if (!walletConnect) {
			message.error("Please connect wallet!");
			return;
		}
		try {
			if (!Number.isInteger(ticketAmount)) {
				message.error("Please input valid format ticket!");
				return;
			}
			if (ticketAmount <= 0) {
				message.error("Ticket amount is greater than 0!");
				return;
			}

			if (maxTicketProvidePerDay - ticketSold + ticketAmount < 0) {
				message.error("Over ticket amount per day");
				return;
			}

			if (USER_MAX_ALLOW - ticketAmount - ownerTicketHeld < 0) {
				message.error("Over ticket amount per user");
				return;
			}
			setJoinNowLoading(true);
			const WDAContract = new ethers.Contract(
				wdaAddress,
				wdaAbi,
				walletConnect
			);
			crownLuckyContract = new ethers.Contract(
				crownLuckyAddress,
				crownLuckyAbi,
				walletConnect
			);
			// approve WDA
			const approveRes = await WDAContract.approve(
				crownLuckyContract.address,
				ethers.utils.parseEther(`${ticketAmount * TICKET_COST}`)
			);
			await approveRes.wait();
			// buy
			const buyRest = await crownLuckyContract.buyTicket(
				ticketAmount.toString()
			);
			await buyRest.wait().then(async () => {
				message.success("Buy ticket successfully");
				// fetch new data
				Promise.all([
					await crownLuckyContract.ownerScepterNFT(
						await walletConnect.getAddress()
					),
					await crownLuckyContract.getOwnerTicket(),
					await crownLuckyContract.ticketSoldPerDay(),
				]).then(async (res) => {
					setScepterQuantity(res["0"].toString());
					setOwnerTicketHeld(res["1"].toString());
					setTicketSold(handleFormatQuantity(res["2"].toString()));
					setTicketAmount(0);
					setJoinNowLoading(false);
				});
			});
		} catch (error) {
			console.log("buy ticket error ", error);
			setJoinNowLoading(false);
			if (error?.data?.message?.includes("nonce")) {
				message.error("Please try again!");
				return;
			}
			if (error.code === 4001) {
				message.error("Transaction canceled");
				return;
			} else {
				message.error(
					error?.data?.message || error?.message || "Buy lucky crown error!"
				);
			}
		}
	}

	return (
		<Fragment>
			<section className="section" id="section-lucky-ticket" data-aos="fade-up">
				<Container>
					<Row justify="center">
						<div className="module-header text-center">
							{parseInt(totalSupplyCrown) < 5000 &&
							parseInt(ticketSold) < parseInt(maxTicketProvidePerDay)
								? "Lucky CROWN"
								: "The Lucky CROWN has ended!"}
						</div>
						<div className="text-center w-100">
							<Col xs={24} md={13} className="text-center">
								<div
									className="module-blur"
									style={{ maxWidth: 476, margin: "auto" }}
								>
									{parseInt(totalSupplyCrown) < 5000 &&
									ticketSold < maxTicketProvidePerDay
										? "Every day at 13:00 UTC,the lucky prize will be spun once. Each participating ticket will receive 1 SCEPTER. Only 1 ticket will Win and get 1 CROWN NFT."
										: "Let’s check out the winners from all the previous Lucky CROWN below."}
								</div>
							</Col>
							{parseInt(totalSupplyCrown) < 5000 &&
							parseInt(ticketSold) < parseInt(maxTicketProvidePerDay) ? (
								<>
									<Row
										justify="center"
										className="text-center timer"
										gutter={[20, 50]}
										style={{ marginTop: 60 }}
									>
										<Col xs={24} sm={12} md={7}>
											<div className="module-blur">Ends In</div>
											{expiredTime.toDate().getTime() ? (
												<CountdownClock
													expiredTime={expiredTime.toDate().getTime()}
													className="module-title"
												/>
											) : (
												<>Error</>
											)}
										</Col>
										<Col xs={24} sm={12} md={7}>
											<div className="module-blur">Ends On</div>

											<div
												className="module-title"
												style={{ maxWidth: 226, margin: "auto" }}
											>
												{expiredTime.format("LLL")}&nbsp;UTC
											</div>
										</Col>
									</Row>

									<Row gutter={[20, 50]} style={{ marginTop: 70 }}>
										<Col sm={12} xs={24}>
											{metaLoading ? (
												<InputWaiting
													className="img-main-bid w-100"
													animate={true}
													height={472}
												/>
											) : (
												<Image
													src={detailTodayToken?.image || ""}
													preview={false}
													width={"100%"}
												/>
											)}
										</Col>
										<Col sm={12} xs={24} className="pl-xl-3">
											<div className="bottom-section-lucky">
												<div className="crown_name">
													{metaLoading ? (
														<InputWaiting className="crown-main-content-text-header" />
													) : (
														detailTodayToken?.name || "CROWN"
													)}
												</div>
												<div className="crown_tag">
													{metaLoading ? (
														<InputWaiting className="crown-main-content-text-header" />
													) : (
														<Tag>{detailTodayToken?.aprBonus || "0"}% APR</Tag>
													)}

													{metaLoading ? (
														<InputWaiting className="crown-main-content-text-header" />
													) : (
														<Tag>{detailTodayToken?.reduce || "0"}% Reduce</Tag>
													)}
												</div>
												<Space direction="vertical" size={20}>
													<div className="pricing">
														<div className="text-pricing module-blur">
															Pricing
														</div>
														<div className="text-right">1 Ticket = 50 WDA</div>
													</div>
													<div className="ticket-hold">
														<div className="text-ticket-hold module-blur">
															Your Ticket Held
														</div>
														<div className="text-right">
															{ownerTicketHeld}&nbsp;
															<span className="module-blur">
																/{USER_MAX_ALLOW}
															</span>{" "}
														</div>
													</div>
												</Space>
												<div className="module-line" />
												<Progress
													percent={parseInt(
														(
															(ticketSold / maxTicketProvidePerDay) *
															100
														).toString()
													)}
													showInfo={false}
												/>

												<div className="quantity" style={{ marginTop: 10 }}>
													{handleFormatQuantity(ticketSold)}&nbsp;/&nbsp;
													<span>50.000</span>
												</div>
												<div className="form_get_quantity">
													<InputNumber
														value={ticketAmount}
														type="number"
														placeholder="Ticket amount..."
														onChange={(val) => {
															setTicketAmount(parseInt(val));
														}}
													/>
													<Button onClick={handleClickMax}>MAX</Button>
												</div>
												<div className="join_button w-100">
													{walletConnect ? (
														<Button
															loading={joinNowLoading}
															disabled={
																disableJoinNow ||
																joinNowLoading ||
																expiredTime.toDate().getTime() <=
																	moment().toDate().getTime() ||
																(contractState && contractState != 0)
															}
															onClick={(e) => {
																if (
																	expiredTime.toDate().getTime() <=
																	moment().toDate().getTime()
																) {
																	message.error("Lucky crown is ended!");
																	return;
																}
																handleBuyTicket(e);
															}}
														>
															Join Now
														</Button>
													) : (
														<ConnectWallet className="w-100" />
													)}
												</div>
											</div>
										</Col>
									</Row>
								</>
							) : (
								<></>
							)}
						</div>

						<Space
							direction="vertical"
							className="text-center claim_nft_container"
						>
							<Row justify="space-between" gutter={[50, 50]}>
								<Col xs={24} sm={24} md={24} xl={12}>
									<div
										style={{ padding: "37px 30px 20px 30px" }}
										className={`module-card ${
											scepterQuantity > 0 ? "" : "disabled"
										}`}
									>
										<div className="module-card-header c2i-flex c2i-justify-between">
											<div>
												<div className="module-blur">You have received</div>
												<div className="module-card-body">
													<div className="module-card-wda">
														{scepterQuantity}&nbsp;SCEPTER!
													</div>
												</div>
											</div>
											<div className="module-card-button float-right">
												<Button
													onClick={() => {
														if (parseInt(scepterQuantity) > 0) {
															navigate("/claim#CrownLucky");
														}
													}}
												>
													Claim Now
												</Button>
											</div>
										</div>
									</div>
								</Col>

								<Col xs={24} sm={24} md={24} xl={12}>
									<div
										style={{ padding: "37px 30px 20px 30px" }}
										className={`module-card ${
											crownQuantity > 0 ? "" : "disabled"
										}`}
									>
										<div className="module-card-header">
											<div className="module-blur">You have received</div>
											<div className="module-card-button float-right">
												<Button
													onClick={() => {
														if (parseInt(crownQuantity) > 0)
															navigate("/claim#CrownLucky");
													}}
												>
													Claim Now
												</Button>
											</div>
										</div>
										<div className="module-card-body">
											<div className="module-card-wda">
												{crownQuantity}&nbsp;CROWN!
											</div>
										</div>
									</div>
								</Col>
							</Row>
						</Space>
						<HistoryWinner />
					</Row>
				</Container>
			</section>
		</Fragment>
	);
}
export default CROWNLucky;
