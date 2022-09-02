import { Row, Space } from "antd";
import React, { useEffect, useState } from "react";
import { ICON_HISTORY_STAKE as icon } from "src/assets/images";
import BaseHelper from "src/utils/BaseHelper";

function Item(props) {
	const { infoItem, onClick, listType, blocknumber } = props;
	const [lockDeadline, setLockDeadline] = useState(0);
	console.log("Info", infoItem);
	useEffect(() => {
		if (infoItem?.lockDeadline && infoItem?.lockDeadline != 0 && blocknumber) {
			setLockDeadline(parseInt(infoItem?.lockDeadline) - parseInt(blocknumber));
		}
	}, [blocknumber]);
	if (infoItem)
		return (
			<div
				className="item-list"
				onClick={() => {
					onClick &&
						onClick(
							infoItem.marketId,
							infoItem.tokenId,
							lockDeadline > 0 ? 1 : 0,
							lockDeadline
						);
				}}
			>
				<div className="boder">
					<Row className="head" align="middle" justify="space-between">
						<Row align="middle">
							<div className="point" />
							<div className="time">{infoItem.time}</div>
						</Row>
						<div>
							{lockDeadline > 0 ? (
								<span className="lock-status c2i-color-title">
									{`Locked ${lockDeadline} blocks`}
								</span>
							) : (
								<span className="status">Normal</span>
							)}
						</div>
					</Row>

					<Row className="content" justify="space-between" align="bottom">
						<div className="flex w-100">
							<div>
								<img
									src={infoItem.image}
									alt=""
									className="item-dashboard-img"
								/>
							</div>
							<div className="info w-100">
								<span className="id">#{infoItem.tokenId}</span>
								<span className="name mb-12">{infoItem.name}</span>
								<div className="flex wrap justify-between">
									{infoItem?.apr && infoItem?.reduce ? (
										<Space direction="horizontal" size={12} className="wrap">
											<div className="apr">
												<span> {infoItem.apr}% APR</span>
											</div>
											<div className="reduce">
												<span>{infoItem.reduce}% Reduce</span>
											</div>
										</Space>
									) : (
										<span>Amount:&nbsp;{infoItem.quantity}</span>
									)}
									<div className="flex align-center ml-12-sm">
										<p className="price c2i-no-margin"> {infoItem.price} BNB</p>
									</div>
								</div>
							</div>
						</div>
					</Row>

					{infoItem.soldFrom && infoItem.soldTo && (
						<Row className="sold-info" align="middle">
							<Row>
								<img src={icon} alt="" />
								<span> {BaseHelper.shortTextAdress(infoItem.soldFrom)}</span>
							</Row>
							<span className="text-sold">sold to</span>
							<Row>
								<img src={icon} alt="" />
								<span> {BaseHelper.shortTextAdress(infoItem.soldTo)}</span>
							</Row>
						</Row>
					)}
					{listType == 1 ? (
						<div style={{ marginTop: "16px" }}>
							<p className="module-blur c2i-no-margin">
								<span className="c2i-color-title">{`${BaseHelper.shortTextAdress(
									infoItem?.seller
								)}`}</span>{" "}
								sold to
								<span className="c2i-color-title">{` ${BaseHelper.shortTextAdress(
									infoItem?.buyer
								)}`}</span>
							</p>
						</div>
					) : (
						<></>
					)}
				</div>
			</div>
		);
	else return <></>;
}

export default Item;
