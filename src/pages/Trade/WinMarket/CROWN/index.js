import { Col, Pagination, Row, Select, Space, Spin } from "antd";
import axios from "axios";
// import { ethers } from "ethers";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import { providerFake } from "src/constants/apiContants";
// import { apiService } from "src/utils/api";
// import BaseHelper from "src/utils/BaseHelper";
// import * as MoralisQuery from "src/utils/MoralisQuery";
// import { crownNFTAbi, crownNFTAdress } from "../../../../constants/constants";
import { user$, wallet$ } from "../../../../redux/selectors";
import Item from "./Item";

const { Option } = Select;

const listSortBy = [
	// {
	// 	label: "Recenlty Listed",
	// 	value: {
	// 		key: "createdAt",
	// 		value: "asc",
	// 	},
	// },
	{
		label: "Lowest Price",
		value: {
			"price": 1,
		},
	},
	{
		label: "Highest Price",
		value: {
			"price": -1,
		},
	},
];

function CROWN() {
	const walletConnect = useSelector(wallet$);
	const [listDefault, setListDefault] = useState({
		data: [],
		count: 0,
	});
	const [sortValue, setSortValue] = useState(
		'{"price":1}'
	);
	const pageSize = 8;
	const [loading, setLoading] = useState(true);
	const [skip, setSkip] = useState(0)
	const userData = useSelector(user$)

	const handleChangeSort = (value) => {
		setSortValue(value);
		handleFetchData(skip, value)
	};

	const handleFetchData = useCallback(async (skip, sort = sortValue) => {
		try {
			if (walletConnect && userData && userData.token) {
				await axios.post(
					`${process.env.REACT_APP_API_URL}/api/markets/get`,
					{
						"limit": pageSize,
						"skip": skip,
						"order": sort
					},
					{
						headers: {
							Authorization: `Bearer ${userData.token}`
						}
					}
				).then(res => {
					setListDefault(res.data.data)
				})
			}
		} catch {
			console.log('fetch data market error')
		} finally {
			setLoading(false)
		}
	}, [walletConnect, userData]);

	useEffect(() => {
		handleFetchData(0);
	}, [handleFetchData]);

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
									<Item key={index} infoItem={item} />
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
							setSkip(nextSkip)
						}}
					/>
				</Space>
			)}
		</div>
	);
}

export default CROWN;
