import { Pagination, Row, Spin } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { wallet$ } from "src/redux/selectors";
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
