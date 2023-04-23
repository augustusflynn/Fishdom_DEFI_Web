import { Row, Space, Pagination, Empty, Spin } from "antd";
import React, { useEffect } from "react";
import Item from "./Item";

const LIMIT_DISPLAY_ITEM = 6;

function HistoryStaking({
	handleFetchData,
	setSkip,
	data,
	count,
	currentPage,
	setCurrentPage,
	loading,
	setLoading,
}) {
	let renderHistoryStaking;
	renderHistoryStaking =
		count > 0 &&
		data.map((item, index) => (
			<Item item={item} key={index} />
		));
	useEffect(() => {
		if (data) {
			setLoading(false);
		}
	}, [data]);
	return loading ? (
		<Spin />
	) : (
		<>
			<div className="module-content">
				<Row gutter={[30, 30]}>{renderHistoryStaking}</Row>
			</div>
			{data && data.length > 0 ? (
				<Space direction="vertical" className="pagination" align="center">
					<Pagination
						defaultCurrent={currentPage}
						pageSize={LIMIT_DISPLAY_ITEM}
						total={count}
						onChange={(pageNum) => {
							const nextSkip = (pageNum - 1) * LIMIT_DISPLAY_ITEM;
							handleFetchData("Staked", nextSkip);
							setCurrentPage(pageNum);
							setSkip(nextSkip);
						}}
					/>
				</Space>
			) : (
				<Empty />
			)}
		</>
	);
}

export default HistoryStaking;
