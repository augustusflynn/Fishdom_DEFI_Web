import { Col, Space } from "antd";
import React from "react";
import fakeImg from "src/assets/images/fake-img-profile.svg";
import LuckyTicketHelper from "src/constants/lucky";
import { ethers } from "ethers";
import BaseHelper from "src/utils/BaseHelper";
import LuckyIcons from "../../../../../assets/images/lucky-history-icons.svg";

const HistoryWinTicket = ({ winTicketDetails }) => {
	return (
		<Col xs={24} md={12} lg={8}>
			<div className="lucky-history-items">
				<div style={{ display: "flex", justifyContent: "space-between" }}>
					{winTicketDetails?.ticketType == LuckyTicketHelper.luckyTicketType ? (
						<div className="lucky-luck-badge">
							<p className="module-text-12px" style={{ color: `#72DE99` }}>
								Lucky Win
							</p>
						</div>
					) : (
						<div className="lucky-jacket-badge">
							<p className="module-text-12px" style={{ color: `#FBCB4E` }}>
								Jackpot Win
							</p>
						</div>
					)}
					<img
						src={LuckyIcons}
						alt="lucky-item-icon"
						className="lucky-item-icon"
					/>
				</div>
				<Space
					direction="horizontal"
					size={16}
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-start",
					}}
				>
					<p
						className="module-title"
						style={{ whiteSpace: "nowrap", color: "#F4F4F4" }}
					>{`${parseInt(
						ethers.utils.formatEther(winTicketDetails.amount.toString())
					)} WDA`}</p>
					<div className="lucky-line"></div>
					<div
						style={{ display: "flex", alignItems: "center" }}
						id="address-container"
					>
						<img className="profile-img" src={fakeImg} alt="profile-img" />
						<p className="module-blur">
							{BaseHelper.shortTextAdress(`${winTicketDetails.owner}`)}
						</p>
					</div>
				</Space>
			</div>
		</Col>
	);
};

export default HistoryWinTicket;
