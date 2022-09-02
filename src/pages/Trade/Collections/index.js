import { Button, Col, Empty, message, Pagination, Row, Spin, Tabs } from "antd";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ModalWallet from "src/layout/Topbar/ModalWallet";
import { market } from "src/redux/actions";
import { market$, wallet$ } from "src/redux/selectors";
import { apiService } from "src/utils/api";
import { makeQueryBuilder } from "src/utils/MoralisQuery";
import Scepter from "../../../assets/images/Scepter.jpg";
import IconWallet from "../../../assets/png/topbar/icon-wallet-white.svg";
import MarketAbi from "../../../constants/abiMarket.json";
import ScepterAbi from "../../../constants/abiScepter.json";
import { crownNFTAbi, crownNFTAdress } from "../../../constants/constants";
import Container from "../../../layout/grid/Container";
import MarketItem from "./MarketItem";
import ModalConfirm from "./ModalConfirm";
import crownImgFake from "src/assets/crown/crown.svg";

const Collection = () => {
	const sellData = useSelector(market$).sell;
	const withdrawData = useSelector(market$).withdraw;
	const walletConnect = useSelector(wallet$);
	const dispatch = useDispatch();
	const [blockNumber, setBlockNumber] = useState(0);
	const [listMarket, setListMarket] = useState({
		data: [],
		count: 0,
	});
	const [listCollection, setListCollection] = useState({
		data: [],
		count: 0,
	});
	const [currentPage, setCurrentPage] = useState(1);
	const [page_size, setPageSize] = useState(8);
	const [currentTabKey, setCurrentTabKey] = useState("#marketItem");
	const [skip, setSkip] = useState(0);
	const [isShowModal, setIsShowModal] = useState(false);
	const [selectedItem, setSelectedItem] = useState();
	const [sellLoading, setSellLoading] = useState(false);
	const [withdrawLoading, setWithdrawLoading] = useState(false);

	const [isLoadingAllSiteA, setIsLoadingAllSiteA] = useState(true);
	const [isLoadingAllSiteB, setIsLoadingAllSiteB] = useState(true);

	const [listIdNFT, setListIdNFT] = useState([]);
	const [showPopupWallet, setShowPopupWallet] = useState(false);
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [currentTabKey]);
	useEffect(() => {
		if (Object.keys(sellData).length > 0) {
			sessionStorage.setItem("sell", JSON.stringify(sellData));
		}
	}, [sellData]);

	useEffect(() => {
		if (Object.keys(withdrawData).length > 0) {
			sessionStorage.setItem("withdraw", JSON.stringify(withdrawData));
		}
	}, [withdrawData]);
	useEffect(() => {
		let run = true;
		run &&
			(async () => {
				if (walletConnect) {
					if (walletConnect?.provider) {
						const blocknumber = await walletConnect.provider.getBlock();
						// console.log("Block number", blocknumber.number);
						setBlockNumber(blocknumber.number);
					}
					dispatch(market.withdrawData([]));
					dispatch(market.sellData([]));
					sessionStorage.setItem("sell", JSON.stringify([]));
					sessionStorage.setItem("withdraw", JSON.stringify([]));
					setIsLoadingAllSiteA(true);
					setIsLoadingAllSiteB(true);
					setListMarket({
						data: [],
						count: 0,
					});
					setListCollection({
						data: [],
						count: 0,
					});
					await handleChangeKey("#marketItem");
				}
			})();
		return () => {
			run = false;
		};
	}, [walletConnect]);

	async function fulfillDataMarket(data, count) {
		const CrownContract = new ethers.Contract(
			crownNFTAdress,
			crownNFTAbi,
			walletConnect
		);
		if (!CrownContract) {
			setIsLoadingAllSiteA(false);
			return;
		}
		new Promise(async (resolve) => {
			let result = [];
			for (let i = 0; i < data.length; i++) {
				const itemDetail = data[i].attributes;
				let itemAttr = {
					tokenId: itemDetail.tokenId,
					price: itemDetail.price,
					quantity: itemDetail.quantity,
				};
				if (itemDetail.quantity && itemDetail.quantity !== "1") {
					itemAttr.name = "SCEPTER";
					itemAttr.quantity = itemDetail.quantity;
					itemAttr.image = Scepter;
				} else {
					const uri = await CrownContract.tokenURI(itemDetail.tokenId);
					const traits = await CrownContract.getTraits(itemDetail.tokenId);
					console.log("Im traits", traits);
					const metadata = await apiService("get", uri)
						.then((res) => {
							if (res?.status === 200) {
								return res.data;
							} else {
								return null;
							}
						})
						.catch((err) => {
							console.log("err", err);
						});

					if (metadata) {
						itemAttr.image = metadata.image;
						itemAttr.name = metadata.name;
					} else {
						itemAttr.image = crownImgFake;
						itemAttr.name = "NFT Crown";
					}
					itemAttr.apr = traits.aprBonus.toString();
					itemAttr.reduce = traits["0"].toString();
					itemAttr.lockDeadline = traits.lockDeadline.toString();
				}
				itemAttr.itemMarketId = itemDetail.itemId;
				result.push(itemAttr);
			}
			resolve(result);
		})
			.then(async (res) => {
				setListMarket({
					data: res,
					count: count,
				});
			})
			.catch(() => {
				setIsLoadingAllSiteA(false);
			})
			.finally(() => {
				setIsLoadingAllSiteA(false);
			});
	}

	async function fulfillDataCollection(crownId) {
		try {
			const CrownContract = new ethers.Contract(
				crownNFTAdress,
				crownNFTAbi,
				walletConnect
			);
			if (!CrownContract) {
				setIsLoadingAllSiteB(false);

				return;
			} else {
				const traits = await CrownContract.getTraits(crownId);
				const uri = await CrownContract.tokenURI(crownId);
				const detailCrown = await apiService("GET", uri)
					.then((res) => {
						if (res.status === 200) {
							return res.data;
						} else {
							return {};
						}
					})
					.catch((err) => {
						console.log("get detail crown err", err);
					});

				return {
					image: detailCrown?.image || crownImgFake,
					name: detailCrown?.name || "NFT Crown",
					apr: traits.aprBonus.toString(),
					tokenId: crownId,
					reduce: traits["0"].toString(),
					staked: traits.staked,
					lockDeadline: traits.lockDeadline.toString(),
				};
			}
		} catch (error) {
			console.log("get detail crown err", error);
		}
	}

	async function handleFetchDataMarket(nextSkip) {
		try {
			setIsLoadingAllSiteA(true);
			const tableName = "MarketItem";
			const keyExactor = "seller";
			const query = makeQueryBuilder(tableName, page_size, nextSkip).equalTo(
				"confirmed",
				true
			);
			// const address = await walletConnect.getAddress();
			query.equalTo(
				keyExactor,
				walletConnect?.provider?.provider?.selectedAddress
					? walletConnect?.provider?.provider?.selectedAddress
							?.toString()
							?.toLowerCase()
					: ""
			);
			const data = await query.find();
			const count = await query.count();
			let filteredData = data;
			let countWdraw = 0;
			let dataWithdraw = sessionStorage.getItem("withdraw")
				? JSON.parse(sessionStorage.getItem("withdraw"))
				: [];
			if (
				Object.keys(filteredData).length > 0 &&
				Object.keys(dataWithdraw).length > 0
			) {
				filteredData = data.filter((item) => {
					if (dataWithdraw.indexOf(item?.attributes?.itemId) != -1) {
						if (item?.tokenId == 0 && item?.quantity != 0) {
							return true;
						}
						countWdraw++;
						return false;
					}
					return true;
				});
				if (countWdraw == 0) {
					dispatch(market.withdrawData([]));
					sessionStorage.setItem("withdraw", JSON.stringify([]));
				}
			}
			await fulfillDataMarket(filteredData, count, "#marketItem");
		} catch (error) {
			setIsLoadingAllSiteA(false);
		}
	}

	async function fetchOwnerNFT() {
		try {
			setIsLoadingAllSiteB(true);
			const CrownContract = new ethers.Contract(
				crownNFTAdress,
				crownNFTAbi,
				walletConnect
			);
			let arrayToken = await CrownContract.ownerToTokenArray(
				await walletConnect.getAddress()
			);

			if (arrayToken?.length > 0) {
				setListIdNFT(arrayToken);
				await handleFetchDataCollection(0, arrayToken);
			} else {
				setListIdNFT([]);
				setIsLoadingAllSiteB(false);
			}
		} catch (error) {
			console.log("err", error);
		}
	}

	async function handleFetchDataCollection(skip, data = listIdNFT) {
		try {
			console.log("Collection", data.toString());
			setIsLoadingAllSiteB(true);

			console.log("Start handle collection");
			const CrownContract = new ethers.Contract(
				crownNFTAdress,
				crownNFTAbi,
				walletConnect
			);
			if (!CrownContract) {
				setIsLoadingAllSiteB(false);
				return;
			} else {
				if (Object.keys(data)?.length > 0) {
					new Promise(async (resolve) => {
						let result = [];
						for (let i = skip; i < skip + page_size; i++) {
							const id = data[i]?.toString();
							if (id) {
								result.push(await fulfillDataCollection(id));
							} else {
								break;
							}
						}
						resolve(result);
					})
						.then(async (res) => {
							const ScepterContract = new ethers.Contract(
								ScepterAbi.scepterAddress,
								ScepterAbi.scepterAbi,
								walletConnect
							);
							if (ScepterContract && skip === 0) {
								const scepterAmount = await ScepterContract.balanceOf(
									await walletConnect.getAddress(),
									0
								);
								console.log(await walletConnect.getAddress());
								if (scepterAmount != "0") {
									res = [
										...res,
										{
											name: "SCEPTER",
											tokenId: 0,
											quantity: scepterAmount.toString(),
											image: Scepter,
										},
									];
								}
							}
							let newData = res;
							let sellData = sessionStorage.getItem("sell")
								? JSON.parse(sessionStorage.getItem("sell"))
								: [];
							let countSell = 0;
							if (
								Object.keys(newData).length > 0 &&
								Object.keys(sellData).length > 0
							) {
								newData = res.filter((item) => {
									if (sellData.indexOf(item?.tokenId) != -1) {
										if (item?.tokenId == 0 && item?.quantity != 0) {
											return true;
										}
										countSell++;
										return false;
									}

									return true;
								});
								if (countSell == 0) {
									dispatch(market.sellData([]));
									sessionStorage.setItem("sell", JSON.stringify([]));
								}
							}
							setListCollection({
								data: newData,
								count: data.length - countSell,
							});
						})
						.finally(() => {
							console.log("Run final");
							setIsLoadingAllSiteB(false);
						});
				} else {
					setIsLoadingAllSiteB(false);
				}
			}
		} catch (error) {
			setIsLoadingAllSiteB(false);
		}
	}

	async function handleChangeKey(key) {
		setCurrentPage(1);
		setSkip(1);
		if (key === "#marketItem") {
			await handleFetchDataMarket(0);
		} else {
			fetchOwnerNFT();
		}
		currentTabKey !== key && setCurrentTabKey(key);
	}

	async function handleSellItem(values) {
		try {
			setSellLoading(true);
			const MarketContract = new ethers.Contract(
				MarketAbi.addressMarket,
				MarketAbi.abiMarket,
				walletConnect
			);
			let ScepterContract, CrownContract;
			let itemType;
			console.log(values);
			if (values.tokenId == 0) {
				ScepterContract = new ethers.Contract(
					ScepterAbi.scepterAddress,
					ScepterAbi.scepterAbi,
					walletConnect
				);
				if (!MarketContract || !ScepterContract) {
					setSellLoading(false);
					return;
				}
				const approveRes = await ScepterContract.setApprovalForAll(
					MarketAbi.addressMarket,
					true
				);
				await approveRes.wait();
				itemType = "0";
			} else {
				CrownContract = new ethers.Contract(
					crownNFTAdress,
					crownNFTAbi,
					walletConnect
				);
				if (!MarketContract || !CrownContract) {
					setSellLoading(false);
					return;
				}
				const approveRes = await CrownContract.approve(
					MarketAbi.addressMarket,
					values.tokenId
				);
				await approveRes.wait();
				itemType = "1";
			}

			const priceToWei = ethers.utils.parseEther(values.price).toString();
			console.log(
				values.tokenId || "0",
				priceToWei,
				values.quantity || "1",
				itemType
			);
			let createMarket = await MarketContract.createMarketItem(
				values.tokenId || "0",
				priceToWei,
				values.quantity || "1",
				itemType
			);
			await createMarket
				.wait()
				.then((res) => {
					let data = sessionStorage.getItem("sell")
						? JSON.parse(sessionStorage.getItem("sell"))
						: [];
					data = [...data, values.tokenId || "0"];
					dispatch(market.sellData(data));
					message.success("Sell item successfully");
					setSellLoading(false);
					setIsShowModal(false);
					handleChangeKey("#marketItem");
				})
				.catch((err) => {
					message.error("Something went wrong. Please try again");
					setSellLoading(false);
				});
			setCurrentPage(1);
		} catch (error) {
			if (error.code == 4001) {
				message.error("Transaction cancelled");
			} else if (
				error?.data?.message &&
				error.data.message.includes("nonexisting token")
			) {
				message.error("Item has been bought!");
			} else if (
				error?.message &&
				error.message.includes("nonexisting token")
			) {
				message.error("Item has been bought!");
			} else {
				message.error("Something went wrong. Please try again");
			}
			setSellLoading(false);
			console.log("handle sell error", error);
		}
	}
	async function handleWithdrawItem(itemMarketId) {
		try {
			const MarketContract = new ethers.Contract(
				MarketAbi.addressMarket,
				MarketAbi.abiMarket,
				walletConnect
			);
			if (!MarketContract) return;
			setWithdrawLoading(true);
			const withdrawRes = await MarketContract.withdrawNFT(itemMarketId);
			await withdrawRes
				.wait()
				.then(() => {
					let data = sessionStorage.getItem("withdraw")
						? JSON.parse(sessionStorage.getItem("withdraw"))
						: [];
					dispatch(market.withdrawData([...data, itemMarketId]));
					handleChangeKey("#collectionItem");
					message.success("Withdraw item successfully");
					setWithdrawLoading(false);
				})
				.catch((error) => {
					if (error.code == 4001) {
						message.error("Transaction cancelled");
					} else if (
						error?.data?.message &&
						error.data.message.includes("nonexisting token")
					) {
						message.error("Item has been bought!");
					} else if (
						error?.message &&
						error.message.includes("nonexisting token")
					) {
						message.error("Item has been bought!");
					} else {
						message.error("Something went wrong. Please try again");
					}
					console.log("withdraw error", error);
					setWithdrawLoading(false);
				});
		} catch (error) {
			setWithdrawLoading(false);
			if (error.code == 4001) {
				message.error("Transaction cancelled");
			} else {
				message.error("Something went wrong. Please try again");
			}
			console.log("withdraw error", error);
		}
	}

	return (
		<>
			<section className="section" id="section-win-market">
				<Container>
					<div className="module-header text-center">Your collection</div>
					{!walletConnect ? (
						<>
							<ModalWallet
								isModalVisible={showPopupWallet}
								hideWallet={() => setShowPopupWallet(false)}
							/>
							<div
								style={{
									width: "100%",
									display: "flex",
									justifyContent: "center",
									marginTop: "3em",
								}}
							>
								<Button
									onClick={() => {
										setShowPopupWallet(true);
									}}
								>
									<div className="wallet-button">
										<img src={IconWallet} />
										<span> Connect Wallet </span>
									</div>
								</Button>
							</div>
						</>
					) : (
						<>
							<Tabs
								type="card"
								activeKey={currentTabKey}
								defaultActiveKey={currentTabKey}
								onChange={handleChangeKey}
							>
								<Tabs.TabPane tab="Market Item" key="#marketItem">
									{(isLoadingAllSiteA && currentTabKey == "#marketItem") ||
									(isLoadingAllSiteB && currentTabKey == "#collectionItem") ? (
										<div className="flex justify-center">
											<Spin />
										</div>
									) : (
										<Row justify="center" align="middle">
											{Object.keys(listMarket?.data).length > 0 ? (
												listMarket.data.map((item, index) => {
													return (
														<Col
															xl={6}
															lg={8}
															md={12}
															sm={24}
															xs={24}
															key={index}
														>
															<MarketItem
																infoItem={item}
																// key={item.tokenId}
																blocknumber={blockNumber}
																currentTabKey={currentTabKey}
																isLoading={withdrawLoading}
																title="Withdraw"
																onClick={(data) => {
																	handleWithdrawItem(data.itemMarketId);
																}}
															/>
														</Col>
													);
												})
											) : (
												<>
													<Empty />
												</>
											)}
										</Row>
									)}
								</Tabs.TabPane>
								<Tabs.TabPane tab="In Stock" key="#collectionItem">
									{(isLoadingAllSiteA && currentTabKey == "#marketItem") ||
									(isLoadingAllSiteB && currentTabKey == "#collectionItem") ? (
										<div className="flex justify-center">
											<Spin />
										</div>
									) : (
										<Row justify="center" align="middle">
											{Object.keys(listCollection?.data).length > 0 ? (
												listCollection.data.map((item, idx) => {
													return (
														<Col
															xl={6}
															lg={8}
															md={12}
															sm={24}
															xs={24}
															key={idx}
														>
															<MarketItem
																infoItem={item}
																// key={item?.tokenId}
																blocknumber={blockNumber}
																title="Sell"
																onClick={(data) => {
																	setIsShowModal(true);
																	setSelectedItem(data);
																}}
															/>
														</Col>
													);
												})
											) : (
												<>
													<Empty />
												</>
											)}
										</Row>
									)}
								</Tabs.TabPane>
							</Tabs>
							<div className="pagination">
								<Pagination
									total={
										currentTabKey === "#collectionItem"
											? listCollection.count
											: listMarket.count
									}
									pageSize={page_size}
									current={currentPage}
									onChange={(num) => {
										window.scrollTo(0, 0);
										setCurrentPage(num);
										let pageSize = page_size;
										const nextSkip = (num - 1) * pageSize;
										setSkip(nextSkip);
										if (currentTabKey !== "#collectionItem") {
											handleFetchDataMarket(nextSkip);
										} else {
											handleFetchDataCollection(nextSkip);
										}
									}}
								/>
							</div>
						</>
					)}
				</Container>
			</section>
			<ModalConfirm
				isShowModal={isShowModal}
				data={selectedItem}
				setShowModal={setIsShowModal}
				onClick={handleSellItem}
				isLoading={sellLoading}
			/>
		</>
	);
};

export default Collection;
