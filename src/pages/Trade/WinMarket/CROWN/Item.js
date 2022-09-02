import { Space } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BaseHelper from "src/utils/BaseHelper";

function Item(props) {
	const { infoItem, blocknumber } = props;
	const [lockDeadline, setLockDeadline] = useState(0);
	const navigate = useNavigate();
	useEffect(() => {
		if (infoItem?.lockDeadline && infoItem?.lockDeadline != 0 && blocknumber) {
			setLockDeadline(parseInt(infoItem?.lockDeadline) - parseInt(blocknumber));
		}
	}, [blocknumber, infoItem]);
	if (infoItem)
		return (
			<Space direction="vertical" size={16} className="market-item">
				<div
					className="c2i-pointer"
					onClick={() =>
						navigate(
							`/detail-market-item?marketId=${infoItem.marketId}&nftId=${
								infoItem.tokenId
							}&isLocked=${
								lockDeadline > 0 ? 1 : 0
							}&lockDeadline=${lockDeadline}`
						)
					}
				>
					<img src={infoItem.image} alt="crown" className="market-img" />
				</div>
				<Space direction="vertical" size={12}>
					<div>
						<label className="module-title">{infoItem.name}</label>
					</div>
					<div className="flex">
						{infoItem?.apr && infoItem?.reduce ? (
							<>
								<label className="apr"> {infoItem.apr}% APR</label>
								<label className="reduce">{infoItem.reduce}% Reduce</label>
							</>
						) : (
							<div className="overflow-hidden">
								Amount:&nbsp;{infoItem?.quantity}
							</div>
						)}
					</div>
					<div className="price">
						{" "}
						<p className="c2i-no-margin c2i-overlay">
							{BaseHelper.numberToCurrencyStyle(infoItem.price)}
						</p>{" "}
						<p className="c2i-no-margin">BNB</p>
					</div>
				</Space>
			</Space>
		);
	else return null;
}

export default Item;
