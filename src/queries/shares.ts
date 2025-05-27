import { supabase } from '../lib/supabase.ts';
import { type DateString } from '../lib/dates/string.ts';
import { Share } from '../types/db.ts';
import { log } from '../lib/log.ts';

export const fetch_share = async (date: DateString) => {
	const res = await supabase.from('gme_stock').select('*').eq('date', date).limit(1);
	log.obj(res);
	if (!res.data || res.data.length == 0) throw new Error('No shares found');
	return res.data[0] as Share;
};
