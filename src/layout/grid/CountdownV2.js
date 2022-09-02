import React, { useEffect } from "react";
import moment from "moment";
/**
 *
 * @param {expiredTime} ex: crown lucky end at 20h00 => expiredDate = moment(`${moment(lastTimeChecking).add(1, 'day').format('YYYY-MM-DD')} 8:00 PM`).toDate().getTime()
 * @param {className} styling...
 */

function CountdownClock({
	expiredTime,
	className,
	style,
	id,
	endText,
	hookFunction,
	hookFunctionValue,
}) {
	useEffect(() => {
		// Update the count down every 1 second
		const timerId = setInterval(function () {
			// Get today's date and time
			const now = moment().utc().toDate().getTime();
			// Find the distance between now and the count down date
			const distance = expiredTime - now;
			// console.log(distance);
			// Time calculations for days, hours, minutes and seconds
			const days = Math.floor(distance / (1000 * 60 * 60 * 24));
			const hours = Math.floor(
				(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
			);
			const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((distance % (1000 * 60)) / 1000);

			// Output the result in an element with id="demo"
			document.getElementById(id).innerHTML =
				hours + ":" + minutes + ":" + seconds;

			// If the count down is over, write some text
			if (distance <= 0) {
				if (hookFunction) {
					hookFunction(hookFunctionValue);
				}
				clearInterval(timerId);

				if (endText) {
					document.getElementById(id).innerHTML = `${endText}`;
				} else {
					document.getElementById(id).innerHTML = `EXPIRED`;
				}
			}
		}, 1000);

		return () => {
			clearInterval(timerId);
		};
	}, [expiredTime]);

	return (
		<div id={id} style={style} className={className}>
			00:00:00
		</div>
	);
}

export default CountdownClock;
