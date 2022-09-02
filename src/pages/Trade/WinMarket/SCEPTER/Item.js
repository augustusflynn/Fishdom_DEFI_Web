import React from "react";
import { Row } from "antd";
import Scepter from "../../../../assets/images/Scepter.jpg";
import { useNavigate } from "react-router-dom";

function Item(props) {
	const { infoItem } = props;
	const navigate = useNavigate();

	if (infoItem)
		return (
			<div
				className="item-list"
				xs={24}
				md={6}
				onClick={() =>
					navigate(
						`/detail-market-item?marketId=${infoItem.marketId}&nftId=${infoItem.tokenId}&isLocked=${0}&lockDeadline=${0}`
					)
				}
			>
				<div className="boder">
					<div>
						<img src={Scepter} alt="" />
					</div>
					<Row className="name-name" align="middle">
						<span className="name">{infoItem.name}</span>
						<div className="x-value">
							<span>x{infoItem.x}</span>
						</div>
					</Row>

					<div className="value-scepter">
						<Row align="middle" justify="space-between" className="item-value">
							<span className="title">Fixed Price</span>
							<span className="value-price">{infoItem.fixedPrice} BNB</span>
						</Row>
						<Row align="middle" justify="space-between">
							<span className="title">Total Price</span>
							<span className="value-price">{infoItem.totalPrice} BNB</span>
						</Row>
					</div>
				</div>
			</div>
		);
	else return null;
}

export default Item;
