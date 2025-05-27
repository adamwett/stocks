import type { Portfolio } from '../types/db.ts';
import { ensureFriday, ensureMonday } from '../lib/dates/ensure.ts';
import { DateString } from '../lib/dates/string.ts';
import { nextFriday } from '../lib/dates/next.ts';
import { currentValue } from '../lib/math.ts';
import { CONFIG } from '../types/config.ts';
import { roundToNearest } from '../lib/math.ts';
import { fetch_board } from '../queries/boards.ts';
import { printBoard } from '../lib/board.ts';
import { log } from '../lib/log.ts';

const call_board = async (date: DateString, current_price: number) => {
	const min_strike = roundToNearest(current_price * CONFIG.call.lower, 2.5);
	const max_strike = roundToNearest(current_price * CONFIG.call.upper, 2.5);
	const board = await fetch_board('Call', date, min_strike, max_strike);

	if (board.length == 0) throw new Error('No calls found');
	printBoard(board, { min_strike, max_strike });
	return board[0];
};

export const write_friday_calls = async (
	portfolio: Portfolio,
	date: DateString,
): Promise<Portfolio> => {
	const monday = ensureMonday(date);
	const friday = ensureFriday(nextFriday(monday));

	const current_price = portfolio.equity.current.close;

	const qty = portfolio.equity.qty;
	const call = await call_board(friday, current_price);
	const position = { current: call, entry: call, qty };
	const premium = currentValue(position);

	log.profit(`Wrote calls:\t$${premium.toFixed(2)}`);

	return {
		...portfolio,
		cash: portfolio.cash + premium,
		call: {
			entry: call,
			current: call,
			qty,
		},
	};
};
