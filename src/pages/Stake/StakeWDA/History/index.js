import { Empty, message, Pagination, Space, Tabs } from "antd";
import FadeAnimationOdd from "src/layout/fadeAnimation/FadeAnimationOdd";
import Container from "src/layout/grid/Container";
import HistoryHavest from "./HistoryHavest/index";
import HistoryStaking from "./HistoryStaking/index";
import * as MoralisQuery from "src/utils/MoralisQuery";
import { useEffect, useState } from "react";
import { toArray } from "lodash";
import IconWallet from "./../../../../assets/png/topbar/icon-wallet-white.svg";
const { TabPane } = Tabs;
const LIMIT_DISPLAY_ITEM = 6;

function History({
	CrownContract,
	newStaked,
	history,
	walletConnect,
	showWallet,
}) {
	//hook
	const [currentPage, setCurrentPage] = useState(1);

	const [skip, setSkip] = useState(0);
	const [tabKey, setTabKey] = useState("1");
	const [loading, setLoading] = useState(true);
	const [address, setAddress] = useState();
	const [listHistoryHavestData, setListHistoryHavestData] = useState({
		data: null,
		count: 0,
	});
	const [listHistoryStakingData, setListHistoryStakingData] = useState({
		data: null,
		count: 0,
	});

	//hook
	useEffect(() => {
		history.current = setTabKey;
	}, []);
	useEffect(async () => {
		if (walletConnect) {
			const address = await walletConnect.getAddress();
			setAddress(address);
		}
	}, [walletConnect]);
	useEffect(async () => {
		try {
			if (address) {
				try {
					setSkip(0);
					setCurrentPage(1);
					if (tabKey == 1) {
						await handleFetchData("Staked", 0);
					} else {
						await handleFetchData("HavestStaking", 0);
					}
				} catch (error) {
					console.log(error);
				}
			}
		} catch (error) {}
	}, [tabKey, newStaked, address]);
	const handleFetchData = async (tableName, skip) => {
		console.log("Choose", tableName);
		try {
			setLoading(true);
			let query = MoralisQuery.makeQueryBuilder(
				tableName,
				LIMIT_DISPLAY_ITEM,
				skip
			).equalTo("owner", address?.toLowerCase());
			const data = await query.find();
			const count = await query.count();

			if (tableName === "HavestStaking") {
				setListHistoryHavestData({
					data,
					count,
				});
			} else {
				setListHistoryStakingData({
					data,
					count,
				});
			}
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<section className="section" id="section-stake-history" data-aos="fade-up">
			<FadeAnimationOdd />
			<Container>
				<div className="module-header text-center">History</div>
				{!walletConnect ? (
					<div className="wallet-button" onClick={showWallet}>
						<img src={IconWallet} />
						<span> Connect Wallet </span>
					</div>
				) : (
					<Tabs
						type="card"
						activeKey={tabKey}
						onChange={(key) => {
							setTabKey(key);
							skip > 0 && setSkip(0);
						}}
					>
						<TabPane tab="Staked" key="1">
							<HistoryStaking
								{...{ loading, setLoading }}
								CrownContract={CrownContract}
								data={listHistoryStakingData.data}
								count={listHistoryStakingData.count}
								handleFetchData={handleFetchData}
								setSkip={setSkip}
								currentPage={currentPage}
								setCurrentPage={setCurrentPage}
							/>
						</TabPane>
						<TabPane tab="Havest" key="2">
							<HistoryHavest
								{...{ loading, setLoading }}
								CrownContract={CrownContract}
								data={listHistoryHavestData.data}
								count={listHistoryHavestData.count}
								handleFetchData={handleFetchData}
								setSkip={setSkip}
								currentPage={currentPage}
								setCurrentPage={setCurrentPage}
							/>
						</TabPane>
					</Tabs>
				)}
			</Container>
		</section>
	);
}

export default History;
