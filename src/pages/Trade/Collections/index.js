import { Button, Col, Empty, message, Pagination, Row, Spin, Tabs } from "antd";
import { ethers } from "ethers";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ModalWallet from "src/layout/Topbar/ModalWallet";
import { user$, wallet$ } from "src/redux/selectors";
import IconWallet from "../../../assets/png/topbar/icon-wallet-white.svg";
import MarketAbi from "../../../constants/contracts/FishdomMarket.sol/FishdomMarket.json";
import FishdomNFTAbi from "../../../constants/contracts/FishdomNFT.sol/FishdomNFT.json";
import Container from "../../../layout/grid/Container";
import MarketItem from "./MarketItem";
import ModalConfirm from "./ModalConfirm";
import axios from "axios";

const Collection = () => {
	const userData = useSelector(user$)
	const walletConnect = useSelector(wallet$);
	const [listMarket, setListMarket] = useState({
		data: [],
		count: 0,
	});
	const [listCollection, setListCollection] = useState({
		data: [],
		count: 0,
	});
	const [currentPage, setCurrentPage] = useState(1);
	const page_size = 8;
	const [currentTabKey, setCurrentTabKey] = useState("#marketItem");
	const [skip, setSkip] = useState(0);
	const [isShowModal, setIsShowModal] = useState(false);
	const [selectedItem, setSelectedItem] = useState();
	const [sellLoading, setSellLoading] = useState(false);
	const [withdrawLoading, setWithdrawLoading] = useState(false);

	const [isLoadingAllSiteA, setIsLoadingAllSiteA] = useState(true);
	const [isLoadingAllSiteB, setIsLoadingAllSiteB] = useState(true);

	const [showPopupWallet, setShowPopupWallet] = useState(false);

	useEffect(() => {
		window.scrollTo(0, 0);
		handleChangeKey(currentTabKey)
	}, [currentTabKey, userData, walletConnect]);

	async function handleFetchDataMarket(nextSkip) {
		try {
			setIsLoadingAllSiteA(true);
			axios.post(
				process.env.REACT_APP_API_URL + "/api/markets/get",
				{
					walletAddress: walletConnect._address,
					skip: nextSkip,
					limit: page_size
				},
				{
					headers: {
						Authorization: `Bearer ${userData.token}`
					}
				}
			).then(res => {
				setListMarket(res.data.data)
				setIsLoadingAllSiteA(false);
			})
		} catch (error) {
			setIsLoadingAllSiteA(false);
		}
	}

	async function handleFetchDataCollection(skip) {
		try {
			setIsLoadingAllSiteB(true);
			axios.post(
				process.env.REACT_APP_API_URL + "/api/games/getListNFT",
				{
					"limit": page_size,
					"skip": skip
				},
				{
					headers: {
						Authorization: `Bearer ${userData.token}`
					}
				}
			).then(res => {
				setListCollection(res.data);
				setIsLoadingAllSiteB(false);
			})
		} catch (error) {
			setIsLoadingAllSiteB(false);
		}
	}

	const handleChangeKey = useCallback(async (key) => {
		setCurrentPage(1);
		setSkip(1);
		if (key === "#marketItem") {
			await handleFetchDataMarket(0);
		} else {
			await handleFetchDataCollection(0);
		}
		window.location.hash = key
		currentTabKey !== key && setCurrentTabKey(key);
	}, [currentTabKey, userData, walletConnect])

	async function handleSellItem(values) {
		try {
			setSellLoading(true);
			const MarketContract = new ethers.Contract(
				MarketAbi.networks['97'].address,
				MarketAbi.abi,
				walletConnect
			);

			const FishdomNFTContract = new ethers.Contract(
				FishdomNFTAbi.networks['97'].address,
				FishdomNFTAbi.abi,
				walletConnect
			);

			const approveRes = await FishdomNFTContract.approve(
				MarketAbi.networks['97'].address,
				values.nftId
			);
			message.loading("Please wait for approve transaction", 1)
			await approveRes.wait();
			window.open(`https://testnet.bscscan.com/tx/${approveRes.hash}`)

			const priceToWei = ethers.utils.parseEther(values.price).toString();
			const createMarket = await MarketContract.createMarketItem(
				values.nftId,
				priceToWei
			);
			await createMarket
				.wait()
				.then((res) => {
					axios.post(
						process.env.REACT_APP_API_URL + "/api/markets/sell",
						{
							txHash: createMarket.hash
						},
						{
							headers: {
								Authorization: `Bearer ${userData.token}`
							}
						}
					).then(() => {
						handleChangeKey("#marketItem");
						message.success("Sell item successfully");
						window.open(`https://testnet.bscscan.com/tx/${createMarket.hash}`)
						setIsShowModal(false);
					}).catch(() => {
						message.error("Something went wrong. Please try again");
					})
					setSellLoading(false);
				})
				.catch((err) => {
					message.error("Something went wrong. Please try again");
					setSellLoading(false);
				});
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
				MarketAbi.networks['97'].address,
				MarketAbi.abi,
				walletConnect
			);

			setWithdrawLoading(true);
			const withdrawRes = await MarketContract.withdrawNFT(itemMarketId);
			message.loading("Please wait for transaction be confirmed", 1)
			await withdrawRes
				.wait()
				.then(() => {
					axios.post(
						process.env.REACT_APP_API_URL + "/api/markets/withdraw",
						{
							txHash: withdrawRes.hash
						},
						{
							headers: {
								Authorization: `Bearer ${userData.token}`
							}
						}
					).then(() => {
						window.open(`https://testnet.bscscan.com/tx/${withdrawRes.hash}`)
						message.success("Withdraw item successfully");
					})
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
																currentTabKey={currentTabKey}
																isLoading={withdrawLoading}
																title="Withdraw"
																onClick={(data) => {
																	handleWithdrawItem(data.itemId);
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
																title="Sell"
																currentTabKey={currentTabKey}
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
							{
								(
									(currentTabKey === "#marketItem" && listMarket.count) ||
									(currentTabKey === "#collectionItem" && listCollection.count)
								)
									? (
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
									) : (<></>)
							}
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
