import { DateString, dateToString, stringToDate, DAYS_OF_WEEK } from './string.ts';
import { log } from '../log.ts';
import { isWeekday, nextWeekday } from './next.ts';

const isHoliday = (date: DateString): boolean => {
	return ['2024-12-25'].some((h) => h === date);
};

const isNday = (date: DateString, n: number): boolean => {
	const day = stringToDate(date).getDay();
	return day === n;
};

const closestNday = (date: DateString, n: number): DateString => {
	const dd = stringToDate(date);
	const day = dd.getDay();
	const daysToNext = (n - day + 7) % 7;
	const daysToPrev = day === n ? 0 : day + 1;
	const daysToMove = daysToNext <= daysToPrev ? daysToNext : -daysToPrev;
	const newDate = new Date(dd.getTime() + daysToMove * 24 * 60 * 60 * 1000);
	return dateToString(newDate);
};

const ensureNday = (date: DateString, n: number): DateString => {
	if (!isNday(date, n)) {
		const new_date = closestNday(date, n);
		const direction = new_date > date ? 'forwards' : 'backwards';
		log.error(`Date ${date} is not a ${DAYS_OF_WEEK[n]}, moved ${direction} to: ${new_date}`);
	}
	return date;
};

export const ensureClosure = (date: DateString): DateString => {
	if (isWeekday(date) && isHoliday(date)) {
		const new_date = ensureClosure(nextWeekday(date));
		log.error(`Date ${date} is a weekday and a holiday, trying to move to ${new_date}`);
	}
	return date;
};

export const ensureMonday = (date: DateString): DateString => ensureNday(date, 1);
export const ensureFriday = (date: DateString): DateString => ensureNday(date, 5);
export const ensureSaturday = (date: DateString): DateString => ensureNday(date, 6);
export const isMonday = (date: DateString): boolean => isNday(date, 1);
export const isFriday = (date: DateString): boolean => isNday(date, 5);
