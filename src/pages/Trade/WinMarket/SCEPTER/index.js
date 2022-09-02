import { Col, Pagination, Row, Select, Space, Spin } from "antd";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BaseHelper from "src/utils/BaseHelper";
import * as MoralisQuery from "src/utils/MoralisQuery";
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
			key: "totalPrice",
			value: "asc",
		},
	},
	{
		label: "Highest Price",
		value: {
			key: "totalPrice",
			value: "desc",
		},
	},
];

function SCEPTER() {
	const walletConnect = useSelector(wallet$);
	const [listScepter, setListScepter] = useState([]);
	const [sortValue, setSortValue] = useState(
		'{"key":"createdAt","value":"asc"}'
	);
	const [isLoading, setLoading] = useState(false);

	const [total, setTotal] = useState(0);
	const pageSize = 20;

	const handleFetchData = async (skip, order) => {
		try {
			let countBought = 0;
			let dataBought = sessionStorage.getItem("market")
				? JSON.parse(sessionStorage.getItem("market"))
				: [];
			setLoading(true);
			const query = MoralisQuery.makeQueryBuilder("MarketItem", pageSize, skip);
			query.equalTo("tokenId", "0");
			const listItem = await query.equalTo("confirmed", true).find();
			const listTg = [];
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
			if (listItem?.length > 0) {
				for await (const item of listFilteredItem) {
					const itemDetail = item.attributes;
					const itemTg = {
						name: "SCEPTER",
						fixedPrice:
							parseFloat(ethers.utils.formatEther(itemDetail.price)) /
							parseInt(itemDetail.quantity),
						totalPrice: parseFloat(ethers.utils.formatEther(itemDetail.price)),
						x: itemDetail.quantity,
						time: BaseHelper.dashboardFormatDay(itemDetail.block_timestamp),
						quantity: itemDetail.quantity,
						status: 1,
						tokenId: itemDetail.tokenId,
						marketId: itemDetail.itemId,
						createdAt: itemDetail.createdAt.getTime() || 0,
					};
					listTg.push(itemTg);
				}
			}
			setListScepter(listTg);
			const count = await query.count();
			setTotal(count - countBought);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			console.log("fetch data error", error);
		}
	};
	useEffect(() => {
		const getSigner = async () => {
			await handleFetchData(0);
		};
		getSigner();
	}, [walletConnect]);

	return isLoading ? (
		<div className="flex justify-center">
			<Spin />
		</div>
	) : (
		<div className="tab-crown">
			<Row justify="center" align="middle">
				<div className="c2i-form-group w100">
					<div className="c2i-form-control">
						<div className="c2i-form-group w100">
							<div className="c2i-form-control">
								<Select
									className="select-sort"
									placeholder="Sort by"
									optionFilterProp="children"
									value={sortValue}
									onChange={(value) => {
										setSortValue(value);
									}}
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
					</div>
				</div>
				<div className="list-crown">
					{Object.keys(listScepter).length > 0 &&
						listScepter
							.sort((a, b) => {
								let arrSortValue = JSON.parse(sortValue);
								if (arrSortValue.value == "asc") {
									return a[arrSortValue.key] - b[arrSortValue.key];
								} else {
									return -a[arrSortValue.key] + b[arrSortValue.key];
								}
							})
							.map((item, index) => {
								return (
									<Col xl={6} lg={8} md={12} sm={24} xs={24} key={index}>
										<Item key={index} infoItem={item} />
									</Col>
								);
							})}
				</div>
			</Row>

			<Space direction="vertical" className="pagination" align="center">
				<Pagination
					total={total}
					showSizeChanger={false}
					defaultPageSize={pageSize}
					onChange={(num) => {
						const nextSkip = (num - 1) * pageSize;
						handleFetchData(nextSkip);
					}}
				/>
			</Space>
		</div>
	);
}

export default SCEPTER;
