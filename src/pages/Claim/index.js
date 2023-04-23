import { Space } from "antd";
import React from "react";
import Staking from './Staking'

const Claim = () => {

	return (
		<section className="page-container section" id="claim">
			<div className="claim-container text-center">
				<Space direction="vertical" size={40}>
					<h2 className="module-header custom-no-margin">Claim</h2>
					<Staking />
				</Space>
			</div>
		</section>
	);
};

export default Claim;
