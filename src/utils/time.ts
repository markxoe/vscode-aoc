import * as moment from "moment";

// Get current year
export const getYear = () => moment().year();

// Get current day of the month
export const getDay = () => moment().date();

export const isDecember = () => moment().month() === 12 - 1;
