import { Row, Space } from "antd";
import Modal from "antd/lib/modal/Modal";
import { ethers } from "ethers";
import React from "react";
import CrownBurger from "src/assets/images/dao/crown-burger.svg";
import BaseHelper from "src/utils/BaseHelper";

const DaoModal = (props) => {
	const { isShowModal, setShowModal, bidData, metaData } = props;
	const hideModal = () => {
		setShowModal(false);
	};
	return (
		<Modal
			visible={isShowModal}
			title={null}
			footer={null}
			closable={null}
			onCancel={hideModal}
			className="c2i-modal"
			id="crown-auction-modal"
		>
			<Space direction="vertical" size={0}>
				<div className="c2i-header-modal">
					<Space direction="vertical" size={16}>
						<div className="back" onClick={hideModal}>
							<div className="icon-back"></div>
							<span className="module-blur" onClick={hideModal}>
								Go Back
							</span>
						</div>
						<Space direction="vertical" size={4}>
							<div className="module-title c2i-no-margin">Bid History</div>
							<p className="module-blur c2i-no-margin">{`${
								metaData ? metaData?.name : "CROWN"
							}`}</p>
						</Space>
					</Space>
				</div>
				<div className="module-line"></div>

				<div id="c2i-body-modal-crown">
					<Space direction="vertical" size={24}>
						{bidData.map((item, idx) => (
							<Row justify="space-between" align="top" key={idx}>
								<div>
									<Space direction="horizontal" size={12} align="start">
										<div className="crown-logo-container-sm"></div>
										<div className="crown-flex crown-flex-direction crown-justify-content-between">
											<p className="module-blur c2i-no-margin">
												{BaseHelper.shortTextAdress(`${item?.bidder}`)}
											</p>
											<Space direction="horizontal" size={12} align="center">
												<div className="c2i-small-square"></div>
												<p className="module-blur c2i-no-margin">
													<span className="text-sub">Won on</span>{" "}
													{`${BaseHelper.optionsDateJs(
														new Date(item?.createdAt || new Date()),
														{ month: "long", day: "numeric", year: "numeric" },
														"UTC"
													)}
													`}
												</p>
											</Space>
										</div>
									</Space>
								</div>
								<Space direction="horizontal" size={4} align="center">
									<img src={CrownBurger} alt="crown-burger" />
									<p className="module-blur c2i-no-margin">{`${BaseHelper.numberWithDots(
										parseInt(
											ethers.utils.formatEther(item?.bidPrice?.toString())
										)
									)}`}</p>
								</Space>
							</Row>
						))}
					</Space>
				</div>
			</Space>
		</Modal>
	);
};
export default DaoModal;
