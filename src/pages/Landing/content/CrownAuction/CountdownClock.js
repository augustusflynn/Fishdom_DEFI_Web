import React, { useEffect } from "react";
import moment from "moment";
/**
 *
 * @param {expiredTime} ex: crown lucky end at 20h00 => expiredDate = moment(`${moment(lastTimeChecking).add(1, 'day').format('YYYY-MM-DD')} 8:00 PM`).toDate().getTime()
 * @param {className} styling...
 */

function CountdownClock({ expiredTime, className }) {
  useEffect(() => {
    // Update the count down every 1 second
    const timerId1 = setInterval(function () {
      // Get today's date and time
      const now = moment().utc().toDate().getTime();
      // Find the distance between now and the count down date
      const distance = expiredTime - now;
      // Time calculations for days, hours, minutes and seconds
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));

      const hours =
        Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) +
        days * 24;
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Output the result in an element with id="demo"
      document.getElementById("timer1").innerHTML =
        hours + " : " + minutes + " : " + seconds;

      // If the count down is over, write some text
      if (distance <= 0) {
        clearInterval(timerId1);
        document.getElementById("timer1").innerHTML = "EXPIRED";
      }
    }, 1000);

    return () => {
      clearInterval(timerId1);
    };
  }, [expiredTime]);

  return (
    <div id="timer1" className={className}>
      00:00:00
    </div>
  );
}

export default CountdownClock;
