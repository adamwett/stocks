import { ensureMonday } from '../lib/dates/ensure.ts';
import type { DateString } from '../lib/dates/string.ts';

interface Config {
	startDate: DateString;
	startingBalance: number;
	call: {
		lower: number;
		upper: number;
	};
	put: {
		lower: number;
		upper: number;
		min_days_out: number;
	};
}

export const CONFIG: Config = {
	startDate: ensureMonday('2019-11-09'),
	startingBalance: 100000,
	call: {
		lower: 1.0,
		upper: 1.5,
	},
	put: {
		min_days_out: 40,
		lower: 0.99,
		upper: 1.1,
	},
};
