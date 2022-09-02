import React, { useState } from "react";
import {
	ArrowLeftOutlined,
	ArrowRightOutlined,
	CalendarOutlined,
} from "@ant-design/icons";
import { DatePicker } from "antd";
import moment from "moment";

const UP = "UP";
const DOWN = "DOWN";

function CustomDatePicker({ onChange, format = "ll" }) {
	const [value, setValue] = useState(moment());

	const onChangeValue = (action) => {
		setValue((prev) => {
			if (action === DOWN) {
				return moment(prev).subtract(1, "day");
			} else {
				return moment(prev).add(1, "day");
			}
		});
	};

	return (
		<div className="date_picker_container">
			<ArrowLeftOutlined
				onClick={() => onChangeValue(DOWN)}
				className="custom-arrow"
			/>
			<div className="date_picker_wrapper">
				<div className="date_picker">
					<CalendarOutlined />
					<DatePicker
						onChange={(date) => {
							setValue(date);
							onChange && onChange(date);
						}}
						value={value}
						format={format}
					/>
				</div>
			</div>
			<ArrowRightOutlined
				className="custom-arrow"
				onClick={() => onChangeValue(UP)}
			/>
		</div>
	);
}

export default CustomDatePicker;
