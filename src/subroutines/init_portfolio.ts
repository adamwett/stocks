// file to make entry positions

import { fetch_share } from '../queries/shares.ts';
import type { Contract, Portfolio, Position, Share } from '../types/db.ts';
import { CONFIG } from '../types/config.ts';
import { midspread, currentValue, roundToNearest } from '../lib/math.ts';
import { printBoard } from '../lib/board.ts';
import { log } from '../lib/log.ts';
import { fetch_board } from '../queries/boards.ts';
import { write_friday_calls } from './write_friday_calls.ts';
import { ensureMonday } from '../lib/dates/ensure.ts';

const entryShares = async (starting_balance: number): Promise<Position<Share>> => {
	const monday = CONFIG.startDate;
	const shares = await fetch_share(monday);
	const price = shares.close;
	const qty = Math.floor(starting_balance / (price * 100));

	return {
		entry: shares,
		current: shares,
		qty,
	};
};

const entryPuts = async (strike: number, qty: number): Promise<Position<Contract>> => {
	const min_strike = roundToNearest(strike * CONFIG.put.lower, 2.5);
	const max_strike = roundToNearest(strike * CONFIG.put.upper, 2.5);

	const board = await fetch_board('Put', CONFIG.startDate, min_strike, max_strike);

	printBoard(board, { min_strike, max_strike });
	const put = board[0];
	log.loss(`Bought puts:\t$${midspread(put.bid, put.ask).toFixed(2)}`);

	return {
		entry: put,
		current: put,
		qty,
	};
};

// export

export const init_portfolio = async (starting_balance: number): Promise<Portfolio> => {
	log.info('Initializing portfolio');
	const equity = await entryShares(starting_balance);

	const i_price = equity.entry.close;
	const i_qty = equity.qty;
	log.info(`Initial shares: ${i_qty} @ $${i_price.toFixed(2)}`);

	const put = await entryPuts(i_price, i_qty);

	// calculate cash remaining
	const put_cost = currentValue(put);
	const share_cost = currentValue(equity);
	const cash = starting_balance - (put_cost + share_cost);

	// construct portfolio
	return {
		cash,
		put,
		equity,
	};
};
