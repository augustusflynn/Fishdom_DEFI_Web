import { Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { wallet$ } from "src/redux/selectors";
import Container from "../../../layout/grid/Container";
import CROWN from "./CROWN";
import Dashboard from "./Dashboard";
import SCEPTER from "./SCEPTER";

const { TabPane } = Tabs;

function WinMarket() {
	let location = useLocation();
	const walletConnect = useSelector(wallet$);
	const [tabSelect, setTab] = useState("#dashboard");

	const onChangeTab = (key) => {
		setTab(key);
		// setData(listHis[key - 1])
		window.location.hash = key;
	};

	useEffect(() => {
		try {
			if (location.hash) {
				switch (location.hash) {
					// case "#dashboard":
					// 	setTab("#dashboard");
					// 	break;
					case "#crown":
						setTab("#crown");
						break;
					// case "#scepter":
					// 	setTab("#scepter");
					// 	break;
					default:
						setTab("#dashboard");
						break;
				}
			}
		} catch (err) {}
	}, [location]);

	return (
		<section className="section" id="section-win-market">
			<Container>
				<div className="module-header text-center">Marketplace</div>
				<Tabs type="card" activeKey={tabSelect} onChange={onChangeTab}>
					{/* <TabPane tab="Dashboard" key="#dashboard">
						<Dashboard />
					</TabPane> */}
					<TabPane tab="CROWN" key="#crown">
						<CROWN />
					</TabPane>
					{/* <TabPane tab="SCEPTER" key="#scepter">
						<SCEPTER />
					</TabPane> */}
				</Tabs>
			</Container>
		</section>
	);
}
export default WinMarket;
