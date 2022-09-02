import { Pagination, Row, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { stakingClaim } from "src/redux/actions";
import { wallet$ } from "src/redux/selectors";
import BaseHelper from "src/utils/BaseHelper";
import { makeQueryBuilder } from "src/utils/MoralisQuery";
import StakingItem from "./StakingItem";

const Staking = (props) => {
	const pageSize = 10;
	const walletConnect = useSelector(wallet$);
	const [stakes, setStakes] = useState([]);
	const [claims, setClaims] = useState([]);
	const [length, setLength] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [loadData, setLoadData] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		let run = true;
		run &&
			(async () => {
				try {
					if (walletConnect) {
						setLoadData(true);
						let address = walletConnect?.provider?.provider.selectedAddress
							.toString()
							.toLowerCase();
						let stakeData = await makeQueryBuilder(
							"Staked",
							pageSize,
							pageSize * (currentPage - 1)
						)
							.equalTo("owner", address)
							.find();
						console.log(stakeData);
						dispatch(
							stakingClaim.stakingClaimData(
								BaseHelper.formatDataMoralis(stakeData)
							)
						);

						let claimedData = sessionStorage.getItem("claimStaking")
							? JSON.parse(sessionStorage.getItem("claimStaking"))
							: [];
						// filter data
						let stakeNewData = BaseHelper.formatDataMoralis(stakeData);
						let countClaimed = 0;
						if (
							Object.keys(BaseHelper.formatDataMoralis(stakeData)).length > 0
						) {
							stakeNewData = stakeNewData.filter((item) => {
								if (claimedData.indexOf(item?.stakeId) != -1) {
									countClaimed++;
									return false;
								}
								return true;
							});
							// Reset sessionStorage if it has been removed from moralis
							if (countClaimed == 0) {
								dispatch(stakingClaim.stakingClaimed([]));
								sessionStorage.setItem("claimStaking", JSON.stringify([]));
							}
						}
						let stakeLength = await makeQueryBuilder("Staked")
							.equalTo("owner", address)
							.count();
						console.log(
							"Filter tools: ",
							sessionStorage.getItem("claimStaking")
						);
						console.log("Before filtering: ", stakeData);
						console.log("After filtering: ", stakeNewData);

						setLength(stakeLength);
						setStakes(stakeNewData);

						setLoadData(false);
					}
				} catch (err) {}
			})();
		return () => {
			run = false;
		};
	}, [walletConnect, currentPage]);

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
