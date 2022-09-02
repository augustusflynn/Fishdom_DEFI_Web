import { Col, Row, Space, Spin } from "antd";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Scepter from "src/assets/images/Scepter.jpg";
import { providerFake } from "src/constants/apiContants";
import { market } from "src/redux/actions";
import { market$ } from "src/redux/selectors";
import { apiService } from "src/utils/api";
import BaseHelper from "src/utils/BaseHelper";
import * as MoralisQuery from "src/utils/MoralisQuery";
import { crownNFTAbi, crownNFTAdress } from "../../../../constants/constants";
import { wallet$ } from "../../../../redux/selectors";
import Item from "./Item";

function Dashboard() {
	const walletConnect = useSelector(wallet$);
	const marketBought = useSelector(market$).market;
	const dispatch = useDispatch();
	const navigate = useNavigate();
	let countClaimed = 0;
	let crownCount = 0;

	// abiMarkets
	const [data, setData] = useState({
		totalCrown: 0,
		totalList: 0,
	});
	const [blockNumber, setBlockNumber] = useState(0);

	const [list, setList] = useState([]);
	const [listSale, setListSale] = useState([]);
	const [loading, setLoading] = useState(false);
	const handleFetchData = async (table, setdata) => {
		try {
			setLoading(true);
			let query = await MoralisQuery.makeQueryBuilder(table, 10, 0);
			let data = sessionStorage.getItem("market")
				? JSON.parse(sessionStorage.getItem("market"))
				: [];
			let listItem = await query.equalTo("confirmed", true).find();
			console.log(table, listItem);
			let listFilteredItem = listItem;
			if (
				Object.keys(data).length > 0 &&
				Object.keys(listItem).length > 0 &&
				table == "MarketItem"
			) {
				listItem.forEach((item) => console.log(item?.attributes?.itemId));
				listFilteredItem = listItem.filter((item) => {
					if (data.indexOf(item?.attributes?.itemId) != -1) {
						countClaimed++;
						if (item?.attributes?.tokenId != 0) {
							crownCount++;
						}
						return false;
					}
					return true;
				});
				// Reset sessionStorage if it has been removed from moralis
				if (countClaimed == 0) {
					console.log("Run here");
					dispatch(market.marketData([]));
					sessionStorage.setItem("market", JSON.stringify([]));
				}
			}
			// console.log(
			// 	"Table",
			// 	table,
			// 	"Data:",
			// 	listItem,
			// 	"Filtered: ",
			// 	listFilteredItem,
			// 	"Data: ",
			// 	data,
			// 	"Counted: ",
			// 	countClaimed
			// );
			if (listFilteredItem?.length > 0) {
				new Promise(async (resolve) => {
					let provider;
					if (walletConnect) {
						provider = walletConnect;
					} else {
						provider = new ethers.getDefaultProvider("kovan");
					}
					const CrownContract = new ethers.Contract(
						crownNFTAdress,
						crownNFTAbi,
						provider
					);
					if (!CrownContract) return;
					let listTg = [];
					for (const item of listFilteredItem) {
						const itemDetail = item.attributes;
						const tokenId = itemDetail.tokenId;
						let itemTg = {};
						if (itemDetail.tokenId != "0") {
							itemTg = {
								time: BaseHelper.dashboardFormatDay(itemDetail.block_timestamp),
								quantity: itemDetail.quantity,
								status: 1,
								tokenId: itemDetail.tokenId,
								marketId: itemDetail.itemId,
								name: `CROWN`,
								apr: 0,
								reduce: 0,
								price: ethers.utils.formatEther(itemDetail.price),
								seller: itemDetail.seller,
								buyer: itemDetail.buyer,
							};
							const url = await CrownContract.tokenURI(tokenId);
							const _dataTraits = await CrownContract.getTraits(tokenId);
							itemTg.apr = _dataTraits?.aprBonus?.toString() || "0";
							itemTg.reduce = _dataTraits["0"]?.toString() || "0";
							itemTg.lockDeadline = _dataTraits?.lockDeadline?.toString() || 0;
							const infoNft = await apiService("get", url)
								.then((res) => {
									if (res?.status === 200) {
										return res.data;
									}
									return null;
								})
								.catch((err) => {
									console.log("fetch metadata crown error", err);
								});
							if (infoNft) {
								itemTg.image = infoNft.image;
								itemTg.name = infoNft.name;
							}
						} else {
							itemTg = {
								time: BaseHelper.dashboardFormatDay(itemDetail.block_timestamp),
								quantity: itemDetail.quantity,
								status: 1,
								tokenId: itemDetail.tokenId,
								marketId: itemDetail.itemId,
								image: Scepter,
								name: `SCEPTER`,
								price: ethers.utils.formatEther(itemDetail?.price),
								seller: itemDetail.seller,
								buyer: itemDetail.buyer,
							};
						}
						listTg.push(itemTg);
					}
					// console.log(table, listTg);
					resolve(listTg);
				})
					.then(async (res) => {
						setdata(res);
						const countQuery = MoralisQuery.makeQueryBuilder("MarketItem");
						const total = await countQuery.equalTo("confirmed", true).count();
						countQuery.notEqualTo("tokenId", "0");
						const crownTotal = await countQuery.count();
						setData({
							totalCrown: crownTotal - crownCount,
							totalList: total - countClaimed,
						});
					})
					.catch(() => {
						setLoading(false);
					})
					.finally(() => {
						setLoading(false);
					});
			} else {
				setLoading(false);
			}
		} catch (error) {
			console.log("fetch data market error: ", error);
		}
	};
	useEffect(() => {
		(async () => {
			let provider = new ethers.getDefaultProvider("kovan");
			let blocknumber = await provider.getBlockNumber();
			setBlockNumber(blocknumber.toString());
		})();
	}, []);
	useEffect(() => {
		(async () => {
			try {
				const getSigner = async () => {
					await handleFetchData("MarketItem", setList);
					await handleFetchData("MarketItemTransaction", setListSale);
				};
				await getSigner();
			} catch (err) {}
		})();
	}, [walletConnect]);

	return (
		<div className="tab-dashboard">
			<Space direction="horizontal" size={40} className="justify-center total">
				<div className="flex column text-center">
					<span className="value">{data.totalCrown}</span>
					<span className="title">Total CROWN</span>
				</div>
				<div className="left" />
				<div className="flex column text-center">
					<span className="value">{data.totalList}</span>
					<span className="title">Total List</span>
				</div>
			</Space>
			{loading ? (
				<div className="flex justify-center">
					<Spin />
				</div>
			) : (
				<Row justify="center" className="list-detail">
					<Col xs={24} md={12}>
						<div>
							<span className="title">Recently List</span>
						</div>
						<div>
							{list.map((item, index) => {
								return (
									<Item
										onClick={(marketId, tokenId, isLocked, lockDeadline) => {
											navigate(
												`/detail-market-item?marketId=${marketId}&nftId=${tokenId}&reward=${0}&isLocked=${isLocked}&lockDeadline=${lockDeadline}`
											);
										}}
										key={index}
										blocknumber={blockNumber}
										listType={0}
										infoItem={item}
									/>
								);
							})}
						</div>
					</Col>
					<Col xs={24} md={12}>
						<div>
							<span className="title">Recently Sale</span>
						</div>
						<div>
							{listSale.map((item, index) => {
								return (
									<Item
										key={index}
										infoItem={item}
										listType={1}
										onClick={(marketId, tokenId, isLocked, lockDeadline) => {
											navigate(
												`/detail-market-item?marketId=${marketId}&nftId=${tokenId}&reward=${1}&isLocked=${isLocked}&lockDeadline=${lockDeadline}`
											);
										}}
									/>
								);
							})}
						</div>
					</Col>
				</Row>
			)}
		</div>
	);
}

export default Dashboard;
