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
import _ from "lodash";
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

	useEffect(() => {
		(async () => {
			try {
				if (active && !_.isEmpty(userData)) {
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
		})()
	}, [tabKey, active, userData]);

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
				setLoading(false)
			})
		} catch (error) {
			console.log(error);
			setLoading(false)
		}
	};

	const handleFetchHavestData = async (skip) => {
		try {
			setLoading(true);
			await axios.post(
				process.env.REACT_APP_API_URL + '/api/havests/get',
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
					setListHistoryHavestData(res.data.data);
				}
				setLoading(false)
			})
		} catch (error) {
			setLoading(false)
			console.log(error);
		}
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
