import React, { useEffect, useState } from "react";
import MainBid from "./MainBid";
import PreviousBid from "./PreviousBid";

function CROWN(props) {
	const [isEnd, setIsEnd] = useState(false);
	const [isHidePrev, setIsHidePrev] = useState(false);

	useEffect(() => {
		// Scroll to top when go to this page
		window.scrollTo(0, 0);
	}, []);

	return (
		<>
			<div className="c2i-container" id="crown-auction">
				<MainBid
					{...{
						isEnd,
						setIsEnd,
					}}
				/>
				<PreviousBid
					{...{
						isHidePrev,
						setIsHidePrev,
					}}
				/>
			</div>
		</>
	);
}
export default CROWN;
