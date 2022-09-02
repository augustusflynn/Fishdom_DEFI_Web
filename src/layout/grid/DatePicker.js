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

function CustomDatePicker({ onChange, format = "ll", initDate }) {
	const [value, setValue] = useState(initDate);

	const onChangeValue = (action) => {
		setValue((prev) => {
			if (action === DOWN) {
				const newDateVal = moment(prev).subtract(1, "day");
				onChange && onChange(newDateVal);
				return newDateVal;
			} else {
				if (prev.format("DD/MM/YYYY") !== initDate.format("DD/MM/YYYY")) {
					let newDateVal = moment(prev).add(1, "day");
					onChange && onChange(newDateVal);
					return newDateVal;
				} else {
					return prev;
				}
			}
		});
	};

	// disable all days after
	function handleDisableDate(currentDate) {
		return currentDate && currentDate > initDate;
	}

	return (
		<div className="date_picker_container">
			<ArrowLeftOutlined
				onClick={() => onChangeValue(DOWN)}
				className={`custom-arrow`}
			/>
			<div className="date_picker_wrapper">
				<div className="date_picker">
					<CalendarOutlined />
					<DatePicker
						disabledDate={handleDisableDate}
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
				className={`custom-arrow`}
				onClick={() => onChangeValue(UP)}
			/>
		</div>
	);
}

export default CustomDatePicker;
