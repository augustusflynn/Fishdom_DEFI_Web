import { ethers } from "ethers";
import moment from "moment";
class BaseHelper {
  numberToCurrencyStyle(x, style = ".") {
    if (!x) return `0,0`;
    let nString = x.toString();
    let first = nString.split(".")[0];
    let se = nString.split(".")[1];
    if (!se) se = 0;
    return `${first.toString().replace(/\B(?=(\d{3})+(?!\d))/g, style)}${
      se === "0" ? "" : "," + se
    }`;
  }

  dateFormatVesting(date) {
    return moment(date).format("DD MMM YYYY");
  }
  formatPriceWithQuantity(price, quantity) {
    if (!price || !quantity) {
      return 0;
    }
    return price * quantity >= 1
      ? price * quantity
      : (price > 10 ** -18 && price < 1) || parseFloat(price) == 0
      ? ethers.utils.formatEther(
          parseInt(price * quantity * 10 ** 18).toString()
        )
      : price < 10 ** 18 - 1
      ? parseFloat(price * quantity).toString()
      : "0";
  }
  shortTextAdress(address) {
    if (!address) return "no connect";
    const first = address.slice(0, 6);
    const last = address.slice(-5);

    return `${first}...${last}`;
  }

  numberWithDots(x, style = ".") {
    if (!x) return `0,0`;
    let nString = x.toString();
    let first = nString.split(".")[0];
    let se = nString.split(".")[1];
    if (!se) se = 0;
    return `${first.toString().replace(/\B(?=(\d{3})+(?!\d))/g, style)}${
      se === "0" ? "" : "," + se
    }`;
  }

  numberWithRealDots(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  addDays(date, days) {
    date.setDate(date.getDate() + days);
    return date;
  }
  getState(numberId) {
    if (numberId == 0) {
      return "Active";
    } else if (numberId == 1) {
      return "Defeated";
    } else if (numberId == 2) {
      return "Succeeded";
    } else if (numberId == 3) {
      return "Queued";
    } else if (numberId == 4) {
      return "Expired";
    } else if (numberId == 5) {
      return "Executed";
    }
  }
  removeCommaString(string) {
    return string.replace(/,/g, "");
  }

  formatDataMoralis(data) {
    return Object.keys(data)?.length > 0
      ? data.map((item) => item?.attributes)
      : data;
  }

  formatArrayBigNumberToString(data) {
    return data.length > 0 ? data.map((item) => item?.toString()) : data;
  }

  optionsDateJs(day, options, timeZone) {
    options.timeZone = timeZone;
    return new Date(day).toLocaleString("en-US", options);
  }

  dashboardFormatDay(day) {
    return moment(day).format("MMM DD, YYYY");
  }

  checkHasItemInArrayMoralis(arr, item) {
    for (let i = 0; i < arr?.length; i++) {
      if (arr[i].id == item.id) {
        return true;
      }
    }
    return false;
  }
  getTypeByDuration(duration) {
    return duration == 360 ? 0 : duration == 180 ? 1 : 2;
  }
  decimalPlaces(num) {
    return num;
  }
  getTypeByDurationId(duration) {
    if (duration == 1) {
      return "90 days";
    } else if (duration == 2) {
      return "180 days";
    } else {
      return "360 days";
    }
  }
}

export default new BaseHelper();
