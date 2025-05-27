import { supabase } from '../lib/supabase.ts';
import { Contract } from '../types/db.ts';
import { ensureFriday, ensureSaturday } from '../lib/dates/ensure.ts';
import { DateString } from '../lib/dates/string.ts';

export const fetch_contract = async (
	query_date: DateString,
	call_put: 'Call' | 'Put',
	strike: number,
	expiration: DateString,
) => {
	const exp = ensureFriday(expiration);
	const saturday = ensureSaturday(query_date);

	const res = await supabase
		.from('gme')
		.select('*')
		.eq('date', saturday)
		.eq('call_put', call_put)
		.eq('strike', strike)
		.eq('expiration', exp)
		.limit(1);

	if (res.error) {
		throw res.error;
	}

	return res.data[0] as Contract;
};
