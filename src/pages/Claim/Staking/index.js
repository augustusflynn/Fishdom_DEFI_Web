import { Pagination, Row, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { stakingClaim } from "src/redux/actions";
import { wallet$ } from "src/redux/selectors";
import BaseHelper from "src/utils/BaseHelper";
import { makeQueryBuilder } from "src/utils/MoralisQuery";
import StakingItem from "./StakingItem";

const Staking = () => {
	const pageSize = 10;
	const walletConnect = useSelector(wallet$);
	const [stakes, setStakes] = useState([]);
	const [length, setLength] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [loadData, setLoadData] = useState(false);


	return loadData ? (
		<Spin style={{ top: "168%" }} />
	) : (
		<>
			<Row id="staking" gutter={[24, 24]}>
				{stakes &&
					stakes.map((item, idx) => {
						return (
							<StakingItem
								{...{
									idx,
									item,
									stakes,
									walletConnect,
									setStakes,
								}}
								key={idx}
							/>
						);
					})}
			</Row>
			{length > 0 ? (
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
						onChange={(e) => setCurrentPage(e)}
						defaultCurrent={currentPage}
						total={length}
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
