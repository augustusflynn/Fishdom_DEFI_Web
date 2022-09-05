import { Col, Empty, Pagination, Row, Space, Spin } from "antd";
import React, { useEffect, useState } from "react";
// import { useMoralisSubscription } from "react-moralis";
import NFTProfile from "src/layout/grid/NFTProfile";
import BaseHelper from "src/utils/BaseHelper";
import * as MoralisQuery from "src/utils/MoralisQuery";

const TOTAL_DISPLAY_ITEM_PER_PAGE = 6;

function HistoryWinner() {
	const [dataHistory, setDataHistory] = useState({
		count: 0,
		data: [],
	});
	const [listCrownTicketWon, setListCrownTicketWon] = useState([]);
	// get attribute only
	const [loading, setLoading] = useState(false);
	const [skip, setSkip] = useState(0);
	async function handleFetchData(skip) {
	try {
		let query = await MoralisQuery.makeQueryBuilder(
			"CrownTicketWin",
			TOTAL_DISPLAY_ITEM_PER_PAGE,
			skip
		);
		query.notEqualTo("owner", "0x0000000000000000000000000000000000000000");
		let data = await query.find();
		let count = await query.count();
		setDataHistory({
			count: count,
			data: data,
		});
	} catch (error) {
		
	}
	}
	useEffect(() => {
	try {
		let run = true;
		run &&
			(async () => {
				window.scrollTo(0, 400);
				setLoading(true);
				await handleFetchData(skip);
				setLoading(false);
			})();
		return () => {
			run = false;
		};
	} catch (error) {
		
	}
	}, [skip]);
	// useEffect(() => {
	// try {
	// 	if (Object.keys(dataHistory.data).length > 0 && dataHistory.data) {
	// 		setListCrownTicketWon(BaseHelper.formatDataMoralis(dataHistory.data));
	// 	} else {
	// 		setListCrownTicketWon([]);
	// 	}
	// } catch (error) {
		
	// }
	// }, [dataHistory]);
	// useMoralisSubscription(
	// 	"CrownTicketWin",
	// 	(query) => query.descending("createdAt").limit(1),
	// 	[],
	// 	{
	// 		live: true,
	// 		onUpdate: (dataListen) => {
	// 			if (!BaseHelper.checkHasItemInArrayMoralis(dataHistory, dataListen)) {
	// 				setDataHistory({
	// 					count: dataHistory.count++,
	// 					data: [dataListen, ...dataHistory],
	// 				});
	// 			}
	// 		},
	// 	}
	// );

	return (
		<section className="section">
			<div data-aos="fade-up" className="w-100">
				<Row align="center">
					<div className="crown_win_container">
						<div className="module-header text-center">Previous Bid</div>
						{loading ? (
							<div style={{ display: "flex", justifyContent: "center" }}>
								<Spin />
							</div>
						) : (
							<Row className="crown_win_container__body">
								{listCrownTicketWon && listCrownTicketWon.length > 0 ? (
									listCrownTicketWon.map((item, index) => {
										return (
											<Col xxl={8} key={index} md={12} xs={24}>
												<NFTProfile
													blockHash={item?.block_hash || ""}
													nftId={item?.crowId || 0}
													profileAddress={item?.owner || ""}
													profileBornOn={item?.createdAt || ""}
												/>
											</Col>
										);
									})
								) : (
									<div className="text-center">
										<Empty />
									</div>
								)}
							</Row>
						)}
					</div>

					<Space direction="vertical" align="center" className="pagination">
						<Pagination
							defaultCurrent={1}
							total={Math.ceil(dataHistory.count)}
							onChange={(pageNum) => {
								const nextSkip = (pageNum - 1) * TOTAL_DISPLAY_ITEM_PER_PAGE;
								setSkip(nextSkip);
							}}
						/>
					</Space>
				</Row>
			</div>
		</section>
	);
}

export default HistoryWinner;
