// types
type Year = '2019' | '2020' | '2021' | '2022' | '2023' | '2024';
type Month = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12';
type Day =
	| '01'
	| '02'
	| '03'
	| '04'
	| '05'
	| '06'
	| '07'
	| '08'
	| '09'
	| '10'
	| '11'
	| '12'
	| '13'
	| '14'
	| '15'
	| '16'
	| '17'
	| '18'
	| '19'
	| '20'
	| '21'
	| '22'
	| '23'
	| '24'
	| '25'
	| '26'
	| '27'
	| '28'
	| '29'
	| '30'
	| '31';

export type DateString = `${Year}-${Month}-${Day}`;

export const DAYS_OF_WEEK = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
];

// string stuff

export const dateToString = (date: Date): DateString => {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
		2,
		'0',
	)}-${String(date.getDate()).padStart(2, '0')}` as DateString;
};

export const stringToDate = (str: DateString): Date => {
	const year = str.slice(0, 4);
	const month = str.slice(5, 7);
	const day = str.slice(8, 10);
	return new Date(`${year}-${month}-${day}`);
};
