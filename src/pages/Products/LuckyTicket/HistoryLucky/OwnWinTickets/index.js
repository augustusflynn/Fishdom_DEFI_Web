import { Col, Row } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const OwnWinTickets = ({
	jackpotTicketCount,
	luckyTicketCount,
	claimTicket,
}) => {
	const navigate = useNavigate();
	return (
		<div style={{ marginTop: "56px", marginBottom: "56px" }}>
			<Row justify="space-between" align="middle" gutter={[56, 32]}>
				<Col xs={24} md={12}>
					<Row className="lucky-win-ticket-card">
						<Col xs={24} lg={16}>
							<div id="container-inside-lucky-card">
								<p className="module-blur">{`You have won`}</p>
								<h3 className="module-title">{`${luckyTicketCount} Lucky Tickets`}</h3>
							</div>
						</Col>
						<Col
							xs={24}
							lg={8}
							style={{ display: "flex", justifyContent: "flex-end" }}
						>
							<button
								className="lucky-claim-button"
								onClick={() => navigate("/claim#LuckyTicket")}
							>{`Claim Now`}</button>
						</Col>
					</Row>
				</Col>
				<Col xs={24} md={12}>
					<Row className="lucky-win-jacket-card">
						<Col xs={24} lg={16}>
							<div id="container-inside-lucky-card">
								<p className="module-blur">{`You have won`}</p>
								<h3 className="module-title">{`${jackpotTicketCount} Jackpot Tickets`}</h3>
							</div>
						</Col>
						<Col
							xs={24}
							lg={8}
							style={{ display: "flex", justifyContent: "flex-end" }}
						>
							<button
								className="lucky-claim-button"
								onClick={() => navigate("/claim#LuckyTicket")}
							>{`Claim Now`}</button>
						</Col>
					</Row>
				</Col>
			</Row>
		</div>
	);
};

export default OwnWinTickets;
