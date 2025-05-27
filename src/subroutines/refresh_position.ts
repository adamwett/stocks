import { is_contract, is_share, type Position, type Security } from '../types/db.ts';
import { fetch_share } from '../queries/shares.ts';
import { fetch_contract } from '../queries/contract.ts';
import { DateString } from '../lib/dates/string.ts';

export const refresh_position = async <T extends Security>(
	position: Position<T>,
	date: DateString,
) => {
	const new_position = { ...position };

	if (is_contract(position.current)) {
		new_position.current = (await fetch_contract(
			date,
			position.current.call_put,
			position.current.strike as number,
			position.current.expiration as DateString,
		)) as unknown as T;
	}

	if (is_share(position.current)) {
		new_position.current = (await fetch_share(date)) as unknown as T;
	}

	return new_position;
};
