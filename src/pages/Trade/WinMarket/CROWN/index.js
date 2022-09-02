import { Col, Pagination, Row, Select, Space, Spin } from "antd";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { providerFake } from "src/constants/apiContants";
import { apiService } from "src/utils/api";
import BaseHelper from "src/utils/BaseHelper";
import * as MoralisQuery from "src/utils/MoralisQuery";
import { crownNFTAbi, crownNFTAdress } from "../../../../constants/constants";
import { wallet$ } from "../../../../redux/selectors";
import Item from "./Item";

const { Option } = Select;

const listSortBy = [
	{
		label: "Recenlty Listed",
		value: {
			key: "createdAt",
			value: "asc",
		},
	},
	{
		label: "Lowest Price",
		value: {
			key: "price",
			value: "asc",
		},
	},
	{
		label: "Highest Price",
		value: {
			key: "price",
			value: "desc",
		},
	},
];

function CROWN() {
	const walletConnect = useSelector(wallet$);
	const [blockNumber, setBlockNumber] = useState(0);
	const [listDefault, setListDefault] = useState({
		data: [],
		count: 0,
	});
	const [sortValue, setSortValue] = useState(
		'{"key":"createdAt","value":"asc"}'
	);
	const pageSize = 20;
	const [skip, setSkip] = useState(0);
	const [loading, setLoading] = useState(true);

	const handleChangeSort = (value) => {
		setSortValue(value);
	};

	const handleFetchData = async (skip) => {
		try {
			let countBought = 0;
			let dataBought = sessionStorage.getItem("market")
				? JSON.parse(sessionStorage.getItem("market"))
				: [];
			setLoading(true);
			const query = await MoralisQuery.makeQueryBuilder(
				"MarketItem",
				pageSize,
				skip
			);
			query.equalTo("quantity", "1").equalTo("confirmed", true);
			const listItem = await query.find("MarketItem", pageSize, skip);
			let listFilteredItem = listItem;
			if (
				Object.keys(dataBought).length > 0 &&
				Object.keys(listItem).length > 0
			) {
				listFilteredItem = listItem.filter((item) => {
					if (dataBought.indexOf(item?.attributes?.itemId) != -1) {
						countBought++;
						return false;
					}
					return true;
				});
			}
			const count = await query.count();
			if (count == 0) {
				setLoading(false);
			} else {
				let signer = new ethers.getDefaultProvider("kovan");
				if (walletConnect) {
					signer = walletConnect;
				}
				const CrownContract = new ethers.Contract(
					crownNFTAdress,
					crownNFTAbi,
					signer
				);
				if (!CrownContract) return;
				new Promise(async (resolve) => {
					let listTg = [];
					for (const item of listFilteredItem) {
						const itemDetail = item.attributes;
						const tokenId = itemDetail.tokenId;
						const itemTg = {
							time: BaseHelper.dashboardFormatDay(itemDetail.block_timestamp),
							quantity: itemDetail.quantity,
							status: 1,
							name: `CROWN`,
							apr: 0,
							reduce: 0,
							price: ethers.utils.formatEther(itemDetail.price),
							marketId: itemDetail.itemId,
							tokenId: tokenId,
							createdAt: itemDetail.createdAt.getTime() || 0,
						};
						const url = await CrownContract.tokenURI(tokenId);
						const _dataTraits = await CrownContract.getTraits(tokenId);
						itemTg.apr = _dataTraits?.aprBonus?.toString() || "0";
						itemTg.lockDeadline = _dataTraits?.lockDeadline?.toString() || "0";
						itemTg.reduce = _dataTraits?.["0"]?.toString() || "0";
						const infoNft = await apiService("get", url);
						if (infoNft.status === 200) {
							itemTg.image = infoNft.data.image;
							itemTg.name = infoNft.data.name;
						}
						listTg.push(itemTg);
					}
					resolve(listTg);
				})
					.then(async (res) => {
						setListDefault({
							data: res,
							count: count - countBought,
						});
						setLoading(false);
					})
					.catch((err) => {
						setLoading(false);
						setListDefault({
							data: [],
							count: 0,
						});
					});
			}
		} catch (error) {
			setLoading(false);
			console.log("fetch data market error: ", error);
		}
	};

	useEffect(() => {
		const getSigner = async () => {
			await handleFetchData(0);
		};
		getSigner();
	}, [walletConnect]);
	useEffect(() => {
		(async () => {
			let provider = new ethers.getDefaultProvider("kovan");
			let blocknumber = await provider.getBlockNumber();
			setBlockNumber(blocknumber.toString());
		})();
	}, []);
	return loading ? (
		<div className="flex justify-center">
			<Spin />
		</div>
	) : (
		<div className="tab-crown">
			<Row justify="center" align="middle">
				<div className="c2i-form-group w100">
					<div className="c2i-form-control">
						<Select
							className="select-sort"
							placeholder="Sort by"
							optionFilterProp="children"
							value={sortValue}
							onChange={handleChangeSort}
						>
							{listSortBy.map((item) => {
								return (
									<Option
										value={JSON.stringify(item.value)}
										key={JSON.stringify(item.value)}
									>
										{item.label}
									</Option>
								);
							})}
						</Select>
					</div>
				</div>
				{Object.keys(listDefault.data).length >= 0 &&
					listDefault?.data
						.sort((a, b) => {
							let arrSortValue = JSON.parse(sortValue);
							if (arrSortValue.value == "asc") {
								return (
									parseFloat(a[arrSortValue.key]) -
									parseFloat(b[arrSortValue.key])
								);
							} else {
								return (
									-parseFloat(a[arrSortValue.key]) +
									parseFloat(b[arrSortValue.key])
								);
							}
						})
						.map((item, index) => {
							return (
								<Col xl={6} lg={8} md={12} sm={24} xs={24} key={index}>
									<Item key={index} infoItem={item} blocknumber={blockNumber} />
								</Col>
							);
						})}
			</Row>

			{listDefault?.count == 0 ? (
				<></>
			) : (
				<Space direction="vertical" className="pagination" align="center">
					<Pagination
						total={Math.ceil(listDefault.count / pageSize)}
						showSizeChanger={false}
						defaultPageSize={pageSize}
						onChange={(num) => {
							const nextSkip = (parseInt(num) - 1) * pageSize;
							handleFetchData(nextSkip);
							setSkip(nextSkip);
						}}
					/>
				</Space>
			)}
		</div>
	);
}

export default CROWN;
