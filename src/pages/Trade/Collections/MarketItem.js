import { Button, message, Space } from "antd";
import { ethers } from "ethers";
import React from "react";
import { InputWaiting } from "src/component/skeleton/Skeleton";

function MarketItem({
	infoItem,
	title,
	onClick,
	isLoading,
	currentTabKey,
	blocknumber,
}) {
	if (infoItem) {
		return (
			<Space size={16} direction="vertical" className="market-item">
				{infoItem.image ? (
					<div>
						<img src={infoItem.image} alt="crown" className="market-img" />
					</div>
				) : (
					<InputWaiting className="waiting-img" />
				)}
				<Space direction="vertical" size={8}>
					<div className="name-name c2i-no-margin">
						<label className="module-title">{infoItem.name}</label>
					</div>
					<>
						{infoItem?.apr && infoItem?.reduce ? (
							<>
								<Space direction="horizontal" className="text-center">
									<div className="apr">
										<p style={{ whiteSpace: "nowrap" }}> {infoItem.apr}% APR</p>
									</div>
									<div className="reduce">
										<p style={{ whiteSpace: "nowrap" }}>
											{infoItem.reduce}% Reduce
										</p>
									</div>
								</Space>
								{currentTabKey == "#marketItem" ? (
									<p className="c2i-no-margin">
										Total price:&nbsp;
										{`${
											infoItem?.quantity && infoItem?.price
												? ethers.utils.formatEther(infoItem?.price)
												: 0
										}`}
									</p>
								) : (
									<></>
								)}
							</>
						) : (
							<>
								<p
									className="c2i-no-margin"
									style={{ overflow: "hidden", lineHeight: "32px" }}
								>
									Amount:&nbsp;{infoItem?.quantity}
								</p>
								{currentTabKey == "#marketItem" ? (
									<p className="c2i-no-margin">
										Total price:&nbsp;
										{`${
											infoItem?.quantity && infoItem?.price
												? ethers.utils.formatEther(infoItem?.price)
												: 0
										}`}
									</p>
								) : (
									<></>
								)}
							</>
						)}
					</>
				</Space>
				<Button
					className="button c2i-no-margin"
					disabled={
						isLoading ||
						infoItem.staked ||
						parseInt(infoItem?.lockDeadline || 0) - parseInt(blocknumber || 0) >
							0
					}
					onClick={() => {
						if (infoItem.staked) {
							message.error("Item was staked!");
						} else {
							onClick(infoItem);
						}
					}}
				>
					{infoItem.staked
						? "Staked"
						: parseInt(infoItem?.lockDeadline || 0) -
								parseInt(blocknumber || 0) >
						  0
						? `Locked ${
								parseInt(infoItem?.lockDeadline || 0) -
								parseInt(blocknumber || 0)
						  } blocks`
						: title}
				</Button>
			</Space>
		);
	} else return <></>;
}

export default MarketItem;
