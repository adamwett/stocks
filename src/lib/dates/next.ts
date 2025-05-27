import { DateString, dateToString, DAYS_OF_WEEK, stringToDate } from './string.ts';

export const tomorrow = (date: DateString): DateString => {
	const dd = stringToDate(date);
	const newDate = new Date(dd.getTime() + 24 * 60 * 60 * 1000);
	return dateToString(newDate);
};

export const tommorowN = (date: DateString, n: number): DateString => {
	const dd = stringToDate(date);
	const newDate = new Date(dd.getTime() + n * 24 * 60 * 60 * 1000);
	return dateToString(newDate);
};

// internal complex

const nextDOW = (date: DateString, n: number): DateString => {
	const dd = stringToDate(date);
	const day = dd.getDay();
	const daysToNext = (n - day + 7) % 7;
	const newDate = new Date(dd.getTime() + daysToNext * 24 * 60 * 60 * 1000);
	if (newDate.getDay() !== n) {
		throw new Error(`INTERNAL: Date ${date} is not a ${DAYS_OF_WEEK[n]}`);
	}
	return dateToString(newDate);
};

// external

export const isWeekday = (date: DateString): boolean =>
	[1, 2, 3, 4, 5].includes(stringToDate(date).getDay());

export const nextWeekday = (date: DateString): DateString =>
	isWeekday(date) ? date : nextWeekday(tomorrow(date));

export const nextMonday = (date: DateString): DateString => nextDOW(date, 1);
export const nextFriday = (date: DateString): DateString => nextDOW(date, 5);
export const nextSaturday = (date: DateString): DateString => nextDOW(date, 6);
