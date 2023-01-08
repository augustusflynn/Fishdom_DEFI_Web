import { Pagination, Row, Spin } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { user$ } from "src/redux/selectors";
import StakingItem from "./StakingItem";

const Staking = () => {
	const pageSize = 10;
	const [stakes, setStakes] = useState({
		data: [],
		total: 0
	});
	const [currentPage, setCurrentPage] = useState(1);
	const [loadData, setLoadData] = useState(false);
	const userData = useSelector(user$)

	async function getData(skip = 0) {
		setLoadData(true)
		await axios.post(
			process.env.REACT_APP_API_URL + '/api/stakings/get',
			{
				skip: skip,
				limit: pageSize
			},
			{
				headers: {
					Authorization: `Bearer ${userData.token}`
				}
			}
		)
			.then(res => {
				if (res.status === 200) {
					setStakes(res.data.data)
				}
			})
			.then(() => {
				setLoadData(false)
			})
			.catch(() => {
				setLoadData(false)
			})
	}

	useEffect(() => {
		getData((currentPage - 1) * pageSize)
	}, [currentPage])

	return loadData ? (
		<Spin style={{ top: "168%" }} />
	) : (
		<>
			<Row id="staking" gutter={[24, 24]}>
				{stakes.data.map((item, idx) => {
					return (
						<StakingItem
							{...{
								item,
								stakes,
								getData,
							}}
							key={idx}
						/>
					);
				})}
			</Row>
			{stakes.total > 0 ? (
				<div
					className="pagination"
					style={{
						marginTop: "64px",
						display: "flex",
						justifyContent: "center",
						flexWrap: "wrap",
					}}
				>
					<Pagination
						onChange={(page) => setCurrentPage(page)}
						defaultCurrent={currentPage}
						total={stakes.total}
						pageSize={pageSize}
					/>{" "}
				</div>
			) : (
				<></>
			)}
		</>
	);
};

export default Staking;
