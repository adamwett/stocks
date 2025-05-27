import { supabase } from '../lib/supabase.ts';
import type { Contract } from '../types/db.ts';
import { nextFriday } from '../lib/dates/next.ts';
import { DateString } from '../lib/dates/string.ts';
import { ensureSaturday } from '../lib/dates/ensure.ts';
import { ensureFriday } from '../lib/dates/ensure.ts';

export const fetch_board = async (
	call_put: 'Call' | 'Put',
	query_date: DateString,
	min_strike: number,
	max_strike: number,
) => {
	const saturday = ensureSaturday(query_date);
	const friday = ensureFriday(nextFriday(saturday));

	const tlc = call_put.toLowerCase();

	const res = await supabase
		.from('gme')
		.select('strike,bid,ask,delta,gamma,theta')
		.eq('call_put', call_put)
		.eq('date', saturday)
		.eq('expiration', friday)
		.gte('strike', min_strike)
		.lte('strike', max_strike)
		.order('bid', { ascending: false });

	if (res.error || res.data == null) throw new Error('No calls found');
	return res.data as unknown as Contract[];
};
