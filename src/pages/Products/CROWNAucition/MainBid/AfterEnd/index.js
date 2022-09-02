import React from "react";

const AfterEnd = () => {
	return (
		<>
			<h2 className="crown-header">{"Auction has ended!"}</h2>
			<div style={{ textAlign: "center", marginTop: "32px" }}>
				<p className="module-blur">
					Let’s check out the winners from all{" "}
					<span className="break-line">the previous Bid Auction below.</span>
				</p>
			</div>
		</>
	);
};

export default AfterEnd;
