import { Col, Pagination, Row, Select, Space, Spin } from "antd";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { user$ } from "../../../../redux/selectors";
import Item from "./Item";

const { Option } = Select;

const listSortBy = [
	{
		label: "Recenlty Listed",
		value: JSON.stringify({
			key: "id",
			value: "DESC",
		}),
	},
	{
		label: "Lowest Price",
		value: JSON.stringify({
			key: "price",
			value: "ASC",
		}),
	},
	{
		label: "Highest Price",
		value: JSON.stringify({
			key: "price",
			value: "DESC",
		}),
	},
];

function MarketContent() {
	const [listDefault, setListDefault] = useState({
		data: [],
		total: 0,
	});
	const [sortValue, setSortValue] = useState();
	const pageSize = 8;
	const [loading, setLoading] = useState(false);
	const [skip, setSkip] = useState(0)
	const userData = useSelector(user$)

	const handleChangeSort = (value) => {
		setSortValue(value);
		handleFetchData(skip, value)
	};

	const handleFetchData = useCallback(async (skip, sort = sortValue) => {
		setLoading(true)
		await axios.post(
			`${process.env.REACT_APP_API_URL}/Market/get`,
			{
				"limit": pageSize,
				"skip": skip,
				"order": sort ? JSON.parse(sort) : undefined
			},
			{
				headers: {
					Authorization: `Bearer ${userData.token}`
				}
			}
		).then(res => {
			setListDefault(res.data.data)
		}).finally(() => {
			setLoading(false)
		})
	}, [userData.token]);

	useEffect(() => {
		if (userData.token) {
			handleFetchData(0);
		}
	}, [userData.token, handleFetchData]);

	return loading ? (
		<div className="flex justify-center">
			<Spin />
		</div>
	) : (
		<div className="tab-crown">
			<Row justify="center" align="middle">
				<div className="custom-form-group w100">
					<div className="custom-form-control">
						<Select
							className="select-sort"
							placeholder="Sort by"
							optionFilterProp="children"
							value={sortValue}
							defaultActiveFirstOption
							onChange={handleChangeSort}
						>
							{listSortBy.map((item) => {
								return (
									<Option
										value={item.value}
										key={item.value}
									>
										{item.label}
									</Option>
								);
							})}
						</Select>
					</div>
				</div>
				{listDefault?.data && listDefault?.data.length > 0 &&
						listDefault?.data.map((item, index) => {
							return (
								<Col xl={6} lg={8} md={12} sm={24} xs={24} key={index}>
									<Item key={index} infoItem={item} onFetchData={handleFetchData(skip, sortValue)}/>
								</Col>
							);
						})}
			</Row>
			{listDefault?.total === 0 ? (
				<></>
			) : (
				<Space direction="vertical" className="pagination" align="center">
					<Pagination
						total={Math.ceil(listDefault.total / pageSize)}
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

export default MarketContent;
