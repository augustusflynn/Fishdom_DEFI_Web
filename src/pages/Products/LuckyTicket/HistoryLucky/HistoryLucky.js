import React, { useEffect, useState } from "react";
import Container from "../../../../layout/grid/Container";
import OwnWinTickets from "./OwnWinTickets";
import HistoryWinTicket from "./HistoryWinTicket";
import { SFEED_ANIMATION } from "src/constants/const";
import { Row } from "antd";
import { Pagination, Space } from "antd";
import { Spin } from "antd";
import CustomDatePicker from "../../../../layout/grid/DatePicker";
import LuckyTicketHelper from "src/constants/lucky";
import moment from "moment";

const HistoryLucky = ({
	jackpotTicketCount,
	luckyTicketCount,
	claimTicket,
	setTimeData,
	dataState,
}) => {
	// dataState.isLoading

	return (
		<div
			id="history-lucky-ticket"
			style={{ marginTop: "120px" }}
			data-aos="fade-up"
		>
			<Container>
				<h2 className="module-header text-center">{`Winners`}</h2>
				<CustomDatePicker
					// lay 0 gio cua ngay hom nay
					onChange={(e) => {
						// console.log(new Date(`${e.format("YYYY-MM-DD")} 00:00 AM`));
						setTimeData(
							moment(
								`${e.format("YYYY-MM-DD")} 00:00 AM`,
								"YYYY-MM-DD HH:mm"
							).toDate()
						);
					}}
					initDate={moment(
						`${moment().utc().format("YYYY-MM-DD")} 00:00 AM`,
						"YYYY-MM-DD HH:mm"
					).utcOffset(0, true)}
				/>
				<OwnWinTickets
					jackpotTicketCount={jackpotTicketCount}
					luckyTicketCount={luckyTicketCount}
					claimTicket={claimTicket}
				></OwnWinTickets>
				{dataState.isLoading ? (
					<div style={{ display: "flex", justifyContent: "center" }}>
						<Spin />
					</div>
				) : (
					<Row
						gutter={[16, 16]}
						data-aos="fade-up"
						data-aos-delay={SFEED_ANIMATION.DELAY - 900}
					>
						{Object.keys(dataState.data).length > 0 ? (
							dataState.data.map((item, idx) => (
								<HistoryWinTicket
									key={idx}
									winTicketDetails={item?.attributes}
								/>
							))
						) : (
							<></>
						)}
					</Row>
				)}
				<div
					className="pagination"
					style={{
						marginTop: "64px",
						display: "flex",
						justifyContent: "center",
						flexWrap: "wrap",
					}}
				>
					{Object.keys(dataState.data).length > 0 ? (
						<Pagination
							defaultCurrent={1}
							total={dataState.length}
							pageSize={LuckyTicketHelper.historyLimit}
							onChange={(e) => dataState.setCurrentPage(parseInt(e))}
						/>
					) : (
						<></>
					)}
				</div>
			</Container>
		</div>
	);
};

export default HistoryLucky;
