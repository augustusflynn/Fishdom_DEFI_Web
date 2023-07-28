import { Button, Space } from "antd";
import React from "react";

function MarketItem({
	infoItem,
	title,
	onClick,
	isLoading,
	currentTabKey,
	disabled
}) {

	if (infoItem) {
		return (
			<Space size={16} direction="vertical" className="market-item">
				<div>
					<img
						src={`${process.env.REACT_APP_API_URL}/NFT/idle/${infoItem?.nftId || 0}`}
						alt="crown" className="market-img" />
				</div>
				<Space direction="vertical" size={8}>
					<div>
						<label className="module-title">{infoItem.name}</label>
					</div>
					<div>
						ID:{" "}{infoItem?.nftId || 0}
					</div>
					{(currentTabKey === "#marketItem" || !currentTabKey) ? (
						<>
							<div style={{ overflow: 'hidden' }}>
								<a href={`${process.env.REACT_APP_EXPLORE_SCAN_URL}/tx/${infoItem.txHash}`} target="_blank">
									Tx Hash:{" "}{infoItem.txHash}
								</a>
							</div>
							<div className="price">
								Price: {" "}
								{infoItem?.price}{" "}FdT
							</div>
						</>
					) : (
						<></>
					)}
				</Space>
				<Button
					className="button custom-no-margin"
					disabled={isLoading || disabled}
					onClick={() => {
						onClick(infoItem);
					}}
				>
					{title}
				</Button>
			</Space>
		);
	} else return <></>;
}

export default MarketItem;
