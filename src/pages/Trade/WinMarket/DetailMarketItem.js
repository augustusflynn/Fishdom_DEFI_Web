import { Button, Col, message, Row } from "antd";
import { ethers } from "ethers";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Scepter from "src/assets/images/Scepter.jpg";
import { InputWaiting } from "src/component/skeleton/Skeleton";
import { abiMarket, addressMarket } from "src/constants/abiMarket.json";
import { market } from "src/redux/actions";
import { market$, wallet$ } from "src/redux/selectors";
import { apiService } from "src/utils/api";
import BaseHelper from "src/utils/BaseHelper";
import { crownNFTAbi, crownNFTAdress } from "../../../constants/constants";
import Container from "../../../layout/grid/Container";
import * as MoralisQuery from "../../../utils/MoralisQuery";
import BuyModal from "./BuyModal";

function DetailMarketItem() {
	const [detailItem, setDetailItem] = useState();
	const walletConnect = useSelector(wallet$);
	const marketBought = useSelector(market$).market;
	const [isShowModal, setShowModal] = useState(false);
	const [buyLoading, setBuyLoading] = useState(false);
	const [metaLoading, setMetaLoading] = useState(false);
	const urlParams = new URLSearchParams(window.location.search);
	const marketId = urlParams.get("marketId");
	const tokenId = urlParams.get("nftId");
	const dispatch = useDispatch();
	const rewardId = urlParams.get("reward");
	const isLocked = urlParams.get("isLocked");
	const lockDeadline = urlParams.get("lockDeadline");
	const navigate = useNavigate();
	const showModal = () => {
		setShowModal(true);
	};
	useEffect(() => {
		if (Object.keys(marketBought).length > 0) {
			let data = sessionStorage.getItem("market")
				? JSON.parse(sessionStorage.getItem("market"))
				: [];
			if (Object.keys(data).length > 0) {
				data = [...data, ...marketBought];
			} else {
				data = [...marketBought];
			}
			sessionStorage.setItem("market", JSON.stringify(data));
		}
	}, [marketBought]);
	useEffect(() => {
		window.scrollTo(0, 0);
		async function init() {
			if (marketId && tokenId) {
				try {
					setMetaLoading(true);
					let query = MoralisQuery.makeQueryBuilder("MarketItem", 1, 0);
					if (rewardId == 1) {
						query = MoralisQuery.makeQueryBuilder(
							"MarketItemTransaction",
							1,
							0
						);
					}
					query.equalTo("itemId", marketId);
					let data = await query.find();
					console.log(data);
					data = data[0];
					if (data) {
						data = data.attributes;
						if (parseInt(data.quantity) > 1) {
							// scepter
							setDetailItem({
								seller: data.seller,
								name: "SCEPTER",
								quantity: data.quantity,
								createdAt: data.block_timestamp,
								price: ethers.utils.formatEther(data.price),
								image: Scepter,
							});
							setMetaLoading(false);
						} else {
							// crown
							const CrownContract = new ethers.Contract(
								crownNFTAdress,
								crownNFTAbi,
								walletConnect
							);
							if (!CrownContract) return;

							const traits = await CrownContract.getTraits(tokenId);
							const uri = await CrownContract.tokenURI(tokenId);
							const metadata = await apiService("get", uri)
								.then((res) => {
									if (res?.status === 200) {
										return res.data;
									}
									return null;
								})
								.catch((err) => {
									console.log("fetch metadata error", err);
								});
							setMetaLoading(false);
							// console.log(metadata);
							let dataCrown = {
								seller: data.seller,
								createdAt: data.block_timestamp,
								price: ethers.utils.formatEther(data.price),
								reduce: traits["0"].toString(),
								apr: traits.aprBonus.toString(),
								quantity: data.quantity.toString(),
							};
							if (metadata) {
								dataCrown = {
									...dataCrown,
									name: metadata.name,
									image: metadata.image,
								};
							}
							setDetailItem(dataCrown);
						}
					}
				} catch (error) {
					console.log("get detail error", error);
				}
			}
		}
		init();
	}, [walletConnect]);

	function renderAddress(add) {
		if (!add) return "";
		const length = add.length;
		return add.slice(0, 4) + "..." + add.slice(length - 4, length);
	}

	const buyHandler = async () => {
		const urlParams = new URLSearchParams(window.location.search);
		const tokenId = urlParams.get("marketId");

		if (!walletConnect) {
			message.error("Please connect wallet!");
			return;
		} else {
			try {
				const contract = new ethers.Contract(
					addressMarket,
					abiMarket,
					walletConnect
				);
				setBuyLoading(true);
				console.log(detailItem);
				let value = ethers.utils.parseEther(detailItem.price).toString();
				const tx = await contract.buyMarketItem(tokenId, {
					value,
				});
				await tx.wait().then((res) => {
					setBuyLoading(false);
					setShowModal(false);
					dispatch(market.marketData([tokenId]));
					message.success("Buy item successfully!");
					navigate("/trade-win-market");
				});
			} catch (err) {
				setBuyLoading(false);

				if (err?.data?.message?.includes("Can not buy your item")) {
					message.warn("Can't buy your item!");
				} else if (
					err?.data?.message?.includes("insufficient") &&
					err?.data?.message?.includes("funds")
				) {
					message.error("You don't have enough BNB!");
				} else {
					if (err.code == 4001) {
						message.error("Transaction cancelled!");
					} else if (
						err?.data?.message &&
						err.data.message.includes("nonexisting token")
					) {
						message.error("Item has been bought!");
					} else if (
						err?.message &&
						err.message.includes("nonexisting token")
					) {
						message.error("Item has been bought!");
					} else {
						message.error(err?.data?.message || "Buy error. Please try again!");
					}
				}
				console.log("err", err);
				return;
			}
		}
	};

	return (
		<>
			<BuyModal
				setShowModal={setShowModal}
				isShowModal={isShowModal}
				data={detailItem}
				buyHandler={buyHandler}
				buyLoading={buyLoading}
			/>
			<section className="section detail-item-container" data-aos="fade-up">
				<Container>
					<div className="detail-item-container-title">NFT Detail</div>
					<Row justify="center">
						<Col md={12}>
							{metaLoading ? (
								<InputWaiting className="nft-img" />
							) : (
								<img src={detailItem?.image} alt="nft" />
							)}
						</Col>
						<Col md={12}>
							<div className="item-name">{detailItem?.name || ""}</div>
							<div className="item-bonus">
								{detailItem?.quantity ? (
									<div>
										<span>Amount</span>:&nbsp;{detailItem?.quantity || 0}
									</div>
								) : (
									<>
										<div className="bonus-apr">
											<div>{detailItem?.apr || "0"}%</div>
											<div>APR Bonus</div>
										</div>
										<div className="divide">
											<div />
										</div>
										<div className="bonus-reduce">
											<div>{detailItem?.reduce || "0"}%</div>
											<div>Mining Reduce</div>
										</div>
									</>
								)}
							</div>

							<div className="item-info">
								<span />
								<span>Born on&nbsp;</span>
								{moment(detailItem?.createdAt || new Date()).format("LL")}
							</div>
							<div className="item-info">
								<span />
								<span>Held by&nbsp;</span>
								{renderAddress(detailItem?.seller || "")}
							</div>
							<hr className="my-2" />
							<div className="item-price">
								<Row justify="space-between">
									<div>
										<div>
											{BaseHelper.numberToCurrencyStyle(
												ethers.utils.formatEther(
													((detailItem?.price || 0) * 10 ** 18).toString()
												)
											)}{" "}
											BNB
										</div>
										<div>Total Price</div>
									</div>
									<Button
										onClick={showModal}
										disabled={
											isLocked == 1 ||
											detailItem?.seller ==
												walletConnect?.provider?.provider?.selectedAddress ||
											rewardId == 1
										}
									>
										{isLocked == 0
											? "Buy Now"
											: "Locked " + lockDeadline + " blocks"}
									</Button>
								</Row>
							</div>
						</Col>
					</Row>
				</Container>
			</section>
		</>
	);
}

export default DetailMarketItem;
