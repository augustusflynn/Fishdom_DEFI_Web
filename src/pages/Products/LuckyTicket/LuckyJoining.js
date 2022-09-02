import { Button, Col, message, Row, Space, Spin } from "antd";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import IconWalletBlack from "src/assets/png/topbar/icon-wallet-black.svg";
import IconWalletWhite from "src/assets/png/topbar/icon-wallet-white.svg";
import LuckyTicketHelper from "src/constants/lucky";
import CountdownClock from "src/layout/grid/CountdownClock";
import Container from "../../../layout/grid/Container";
import BaseHelper from "../../../utils/BaseHelper";

const LuckyJoining = ({
	setTicketAmount,
	showWallet,
	walletConnect,
	setMaxTicket,
	maxTicket,
	contractState,
	loadData,
	buyTicketHandler,
	holdingTicket,
	ticketSoldPerPeriod,
	ticketAmount,
	setEndOnTime,
	wda,
	maxTicketAllMarket,
	buyLoading,
	period,
	feePerTicket,
	endOnTime,
}) => {
	const ticketRef = useRef();
	const walletIconRef = useRef();
	const [expiredTime, setExpiredTime] = useState(
		moment(
			`${moment(endOnTime)
				.add(parseInt(period), "second")
				.format("YYYY-MM-DD")} 7:00 PM`,
			"YYYY-MM-DD HH:mm"
		)
	);
	useEffect(() => {
		if (endOnTime && period) {
			try {
				setExpiredTime(
					moment(
						`${moment(endOnTime)
							.add(parseInt(period), "second")
							.format("YYYY-MM-DD")} 7:00 PM`,
						"YYYY-MM-DD HH:mm"
					)
				);
			} catch (err) {}
		}
	}, [endOnTime, period]);
	// FUNCTIONS
	const setToMaxTicket = () => {
		ticketRef.current.value = parseInt(maxTicket);
		setTicketAmount(parseInt(maxTicket));
	};
	const changeWalletIcons = (state) => {
		if (state == `enter`) {
			walletIconRef.current.src = IconWalletBlack;
		} else {
			walletIconRef.current.src = IconWalletWhite;
		}
	};
	useEffect(() => {
		if (ticketRef.current) {
			ticketRef.current.value = ticketAmount;
		}
	}, [ticketAmount]);
	return (
		<section className="section" id="section-lucky-ticket" data-aos="fade-up">
			<Container>
				<Row justify="center">
					<Col xs={24} md={18} lg={13}>
						<div className="module-header text-center">Lucky Ticket</div>
						<Space direction="vertical" size={55} className="text-center">
							<div className="module-blur">
								Lucky prize will be spun once. Lucky 1% of all participating
								tickets will immediately receive WDA bonus. A single lucky
								ticket will get the Jackpot. Winning and non-winning tickets
								will receive full WDA purchased after 5 days.
							</div>
							{!loadData ? (
								<>
									<Row
										justify="center"
										className="text-center"
										gutter={[20, 50]}
									>
										<Col xs={24} sm={12}>
											<div className="module-blur">Ends In</div>
											<CountdownClock
												className="module-title"
												expiredTime={expiredTime.toDate().getTime()}
											></CountdownClock>
										</Col>
										<Col xs={24} sm={12}>
											<div className="module-blur">Ends On</div>
											<div className="module-title">
												{expiredTime.format("LLL")} UTC
											</div>
										</Col>
									</Row>
								</>
							) : (
								<>
									<Row
										justify="center"
										className="text-center"
										gutter={[20, 50]}
									>
										<Col xs={24} sm={12}>
											<div className="module-blur">Ends In</div>
											<div className="module-title">00:00:00</div>
										</Col>
										<Col xs={24} sm={12}>
											<div className="module-blur">Ends On</div>
											<div className="module-title">
												{expiredTime.format("LLL")} UTC
											</div>
										</Col>
									</Row>
								</>
							)}
							<Row justify="center" gutter={[20, 50]}>
								<Col xs={24} sm={12}>
									<div className="module-card">
										<div className="module-card-header">
											<div className="module-blur">Lucky Win</div>
											<div className="module-card-percentage float-right lucky-gray ">
												1%
											</div>
										</div>
										<div className="module-card-body">
											<div
												className="module-card-wda"
												style={{ color: "#72DE99" }}
											>
												{`${BaseHelper.numberWithRealDots(5000)}`} WDA
											</div>
										</div>
									</div>
								</Col>
								<Col xs={24} sm={12}>
									<div className="module-card">
										<div className="module-card-header">
											<div className="module-blur">Jackpot Win</div>
											<div className="module-card-percentage float-right lucky-gray">
												1
											</div>
										</div>
										<div className="module-card-body">
											<div
												className="module-card-wda"
												style={{ color: "#FBCB4E" }}
											>
												{`${BaseHelper.numberWithRealDots(100000)}`} WDA
											</div>
										</div>
									</div>
								</Col>
							</Row>
							{loadData ? (
								<div style={{ display: "flex", justifyContent: "center" }}>
									<Spin />
								</div>
							) : (
								<Row justify="center" gutter={[20, 50]}>
									<Col xs={24} lg={18}>
										<div className="bottom-section-lucky">
											<Space direction="vertical" size={20}>
												<div className="pricing">
													<div className="text-pricing module-blur">
														Pricing
													</div>
													<div className="text-right">
														1 Ticket ={" "}
														{`${BaseHelper.numberWithRealDots(1000)}`} WDA
													</div>
												</div>
												<div className="Contribution">
													<div className="text-Contribution  module-blur">
														Contribution Fee
													</div>
													<div className="text-right ">{`${
														feePerTicket
															? BaseHelper.numberToCurrencyStyle(feePerTicket)
															: 0
													} BNB`}</div>
												</div>
												<div className="ticket-hold">
													<div className="text-ticket-hold module-blur">
														Your Ticket Held
													</div>
													<div className="text-right">
														{holdingTicket}
														<span className="module-blur">
															/{LuckyTicketHelper.ticketMaxPerPerson}
														</span>{" "}
													</div>
												</div>
											</Space>
											<div className="module-line"></div>
											<div className="module-progress ">
												<div
													className="progress-active"
													data-aos="fade-right"
													data-aos-duration="750"
													style={{
														width: `${
															(ticketSoldPerPeriod * 100) / maxTicketAllMarket
														}%`,
													}}
												></div>
											</div>
											<div
												style={{
													width: "100%",
													display: "flex",
													justifyContent: "start",
													paddingTop: "8px",
												}}
											>
												<p className="lucky-text">
													{BaseHelper.numberWithRealDots(ticketSoldPerPeriod)} /{" "}
													{BaseHelper.numberWithRealDots(maxTicketAllMarket)}
												</p>
											</div>
											{!walletConnect ? (
												<div
													onMouseEnter={() => changeWalletIcons(`enter`)}
													onMouseLeave={() => changeWalletIcons(`leave`)}
													className="lucky-join-button"
													onClick={showWallet}
												>
													<Space direction="horizontal" size={9}>
														<img src={IconWalletWhite} ref={walletIconRef} />
														<span> Connect Wallet </span>
													</Space>
												</div>
											) : (
												<>
													<div className="lucky-input-container">
														<input
															type="number"
															className="lucky-input-ticket"
															placeholder="Ticket amount.."
															ref={ticketRef}
															onChange={(e) => {
																try {
																	if (e.target.value > 50) {
																		e.target.value = 50;
																	} else if (e.target.value < 0) {
																		e.target.value = 0;
																	} else if (Number.isNaN(e.target.value)) {
																		e.target.value = 0;
																	} else if (
																		!Number.isInteger(e.target.value) &&
																		!Number.isNaN(e.target.value)
																	) {
																		e.target.value = parseInt(e.target.value);
																	}
																	setTicketAmount(e.target.value);
																} catch (err) {
																	e.target.value = 0;
																	setTicketAmount(0);
																}
															}}
														/>
														<button
															className="lucky-set-max-button"
															onClick={setToMaxTicket}
														>
															{`Max`}
														</button>
													</div>
													<Button
														className="lucky-join-button"
														onClick={async () => {
															try {
																let isExpired =
																	expiredTime - new Date().getTime() <= 0
																		? true
																		: false;
																if (isExpired) {
																	message.error(
																		"Time for lucky ticket is ended!"
																	);
																	return;
																}
																await buyTicketHandler();
															} catch (err) {}
														}}
														loading={buyLoading}
														disabled={
															50 - parseInt(holdingTicket) == 0
																? true
																: contractState && contractState != 0
																? true
																: false
														}
													>
														{`Join Now`}
													</Button>
												</>
											)}
										</div>
									</Col>
								</Row>
							)}
						</Space>
					</Col>
				</Row>
			</Container>
		</section>
	);
};

export default LuckyJoining;
