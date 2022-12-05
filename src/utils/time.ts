import * as moment from "moment-timezone";

const tz = "America/New_York";

// Get current year
export const getYear = () => moment().tz(tz).year();

// Get current day of the month
export const getDay = () => moment().tz(tz).date();

export const isDecember = () => moment().tz(tz).month() === 12 - 1;
