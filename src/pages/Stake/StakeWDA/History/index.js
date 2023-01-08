import FadeAnimationOdd from "src/layout/fadeAnimation/FadeAnimationOdd";
import Container from "src/layout/grid/Container";
import HistoryHavest from "./HistoryHavest/index";
import HistoryStaking from "./HistoryStaking/index";
import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import { useSelector } from "react-redux";
import { user$ } from "src/redux/selectors";
import { Tabs } from "antd";
const { TabPane } = Tabs;

function History() {
	//hook
	const { active } = useWeb3React()
	const [currentPage, setCurrentPage] = useState(1);
	const [skip, setSkip] = useState(0);
	const [tabKey, setTabKey] = useState("1");
	const [loading, setLoading] = useState(true);
	const [listHistoryHavestData, setListHistoryHavestData] = useState({
		data: null,
		count: 0,
	});
	const [listHistoryStakingData, setListHistoryStakingData] = useState({
		data: null,
		count: 0,
	});

	const userData = useSelector(user$)

	useEffect(async () => {
		try {
			if (active) {
				try {
					setSkip(0);
					setCurrentPage(1);
					if (tabKey == 1) {
						await handleFetchStakedData(0);
					} else {
						await handleFetchHavestData(0);
					}
				} catch (error) {
					console.log(error);
				}
			}
		} catch (error) { }
	}, [tabKey, active]);

	const handleFetchStakedData = async (skip) => {
		try {
			setLoading(true);
			await axios.post(
				process.env.REACT_APP_API_URL + '/api/stakings/get',
				{
					skip: skip,
					limit: 8
				},
				{
					headers: {
						Authorization: `Bearer ${userData.token}`
					}
				}
			).then(res => {
				if (res.status === 200) {
					setListHistoryStakingData(res.data.data);
				}
			})
		} catch (error) {
			console.log(error);
		}
	};

	const handleFetchHavestData = async (skip) => {
		// try {
		// 	setLoading(true);
		// 	await axios.post(
		// 		process.env.REACT_APP_API_URL + '/api/havest-stake/get',
		// 		{
		// 			skip: skip,
		// 			limit: 8
		// 		},
		// 		{
		// 			headers: {
		// 				Authorization: `Bearer ${userData.token}`
		// 			}
		// 		}
		// 	).then(res => {
		// 		if (res.status === 200) {
		// 			setListHistoryStakingData(res.data.data);
		// 		}
		// 	})
		// } catch (error) {
		// 	console.log(error);
		// }
	}

	return (
		<section className="section" id="section-stake-history" data-aos="fade-up">
			<FadeAnimationOdd />
			<Container>
				<div className="module-header text-center">History</div>

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
							loading={loading}
							setLoading={setLoading}
							data={listHistoryStakingData.data}
							count={listHistoryStakingData.count}
							handleFetchData={handleFetchStakedData}
							setSkip={setSkip}
							currentPage={currentPage}
							setCurrentPage={setCurrentPage}
						/>
					</TabPane>
					<TabPane tab="Havest" key="2">
						<HistoryHavest
							{...{ loading, setLoading }}
							data={listHistoryHavestData.data}
							count={listHistoryHavestData.count}
							handleFetchData={handleFetchHavestData}
							setSkip={setSkip}
							currentPage={currentPage}
							setCurrentPage={setCurrentPage}
						/>
					</TabPane>
				</Tabs>
			</Container>
		</section>
	);
}

export default History;
