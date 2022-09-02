import { Button, Input, message, Space } from "antd";
import { ethers } from "ethers";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { wallet$ } from "src/redux/selectors";
import { luckyWDAAbi, luckyWDAAddress } from "../../../constants/constants";

const Lucky = (props) => {
	const {
		headText,
		setTotalTicket,
		rewardAvailable,
		setRewardAvailable,
		luckyAvailable,
		totalTicketLose,
		setLuckyAvailable,
		setTotalTicketLose,
		jacketAvailable,
		lucky,
		jacket,
		setJacketAvailable,
	} = props;
	const walletConnect = useSelector(wallet$);
	const [rewardLoading, setRewardLoading] = useState(false);
	const [luckyLoading, setLuckyLoading] = useState(false);
	const [jacketLoading, setJacketLoading] = useState(false);
	const buttonHandler = async (type) => {
		// 0 la claim reward, 1 la claim lucky, 2 la claim jacket
		if (rewardAvailable == 0 && type == 0) {
			message.error("You have no reward available tickets!");
			return;
		}
		if (luckyAvailable == 0 && type == 1) {
			message.error("You have no lucky available tickets!");
			return;
		}
		if (jacketAvailable == 0 && type == 2) {
			message.error("You have no jacket available tickets!");
			return;
		}
		const luckyContract = new ethers.Contract(
			luckyWDAAddress,
			luckyWDAAbi,
			walletConnect
		);
		try {
			if (type == 0) {
				setRewardLoading(true);
				const tx = await luckyContract.claimReward();
				await tx.wait();
				setRewardLoading(false);
				message.success("Claim available reward tickets successfully!");
				setTotalTicket((state) => state - rewardAvailable);
				setTotalTicketLose((state) => state - rewardAvailable);
				setRewardAvailable(0);
			} else if (type == 1) {
				setLuckyLoading(true);
				const tx = await luckyContract.claimCoin(0);
				await tx.wait();
				setLuckyLoading(false);
				message.success("Claim available lucky tickets successfully!");
				setLuckyAvailable(0);
				setTotalTicket((state) => state - luckyAvailable);
			} else {
				setJacketLoading(true);
				const tx = await luckyContract.claimCoin(1);
				await tx.wait();
				setJacketLoading(false);
				message.success("Claim available jacket tickets successfully!");
				setJacketAvailable(0);
				setTotalTicket((state) => state - jacketAvailable);
			}
		} catch (err) {
			console.log(err);
			message.error(err?.data?.message || "Claim Error! Please try again...");
			setRewardLoading(false);
			setLuckyLoading(false);
			setJacketLoading(false);
		}
	};
	return (
		<Space direction="vertical" size={16}>
			<h2 className="module-title c2i-no-margin">{headText}</h2>
			<div className="line"></div>
			<Space direction="vertical" size={8}>
				<p className="module-blur c2i-no-margin">Total Reward Tickets</p>
				<div className="c2i-form-group">
					<div className="c2i-form-control">
						<Input
							type="number"
							min={1}
							placeholder={totalTicketLose}
							disabled
						/>
					</div>
				</div>
				<p className="module-blur c2i-no-margin">Available Reward Tickets</p>
				<div className="c2i-form-group">
					<div className="c2i-form-control">
						<Input
							type="number"
							min={1}
							placeholder={rewardAvailable}
							disabled
						/>
					</div>
				</div>
				<p className="module-blur c2i-no-margin">Lucky Ticket</p>
				<div className="c2i-form-group">
					<div className="c2i-form-control">
						<Input type="number" min={1} placeholder={lucky} disabled />
					</div>
				</div>
				<p className="module-blur c2i-no-margin">Available Lucky Ticket</p>
				<div className="c2i-form-group">
					<div className="c2i-form-control">
						<Input
							type="number"
							min={1}
							placeholder={luckyAvailable}
							disabled
						/>
					</div>
				</div>
				<p className="module-blur c2i-no-margin">Jackpot Ticket</p>
				<div className="c2i-form-group">
					<div className="c2i-form-control">
						<Input type="number" min={1} placeholder={jacket} disabled />
					</div>
				</div>
				<p className="module-blur c2i-no-margin">Available Jackpot Ticket</p>
				<div className="c2i-form-group">
					<div className="c2i-form-control">
						<Input
							type="number"
							min={1}
							placeholder={jacketAvailable}
							disabled
						/>
					</div>
				</div>
				<Button
					className="confirm-btn"
					loading={rewardLoading}
					onClick={() => buttonHandler(0)}
				>
					Claim Rewards
				</Button>
				<Button
					className="confirm-btn"
					loading={luckyLoading}
					onClick={() => buttonHandler(1)}
				>
					Claim Lucky
				</Button>
				<Button
					className="confirm-btn"
					loading={jacketLoading}
					onClick={() => buttonHandler(2)}
				>
					Claim Jacket
				</Button>
			</Space>
		</Space>
	);
};

export default Lucky;
