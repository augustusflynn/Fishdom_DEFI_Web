import { Pagination, Row } from "antd";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { wallet$ } from "src/redux/selectors";
const CrownItem = React.lazy(() => import("./CROWNItem"));

const CROWN = (props) => {
	const {
		crowns,
		paginationHandler,
		currentPage,
		crownsLength,
		pageSize,
		setCrowns,
		setCrownsLength,
	} = props;
	const walletConnect = useSelector(wallet$);
	useEffect(() => {
		console.log(crowns);
	}, [crowns]);
	return (
		<>
			<Row gutter={[24, 24]} id="crown" justify="start">
				{Object.keys(crowns).length > 0 &&
					crowns.map((item, idx) => (
						<CrownItem
							key={idx}
							idx={idx}
							crownId={item?.receiveNFTId}
							miningId={item?.uid}
							item={item}
							crowns={crowns}
							walletConnect={walletConnect}
							setCrownsLength={setCrownsLength}
							crownsLength={crownsLength}
							setCrowns={setCrowns}
						/>
					))}
			</Row>
			{crownsLength ? (
				<div
					className="pagination"
					style={{
						marginTop: "64px",
						display: "flex",
						justifyContent: "center",
						flexWrap: "wrap",
					}}
				>
					<Pagination
						defaultCurrent={1}
						total={crownsLength}
						pageSize={pageSize}
						onChange={(e) => paginationHandler(e)}
					/>
				</div>
			) : (
				<></>
			)}
		</>
	);
};

export default CROWN;
