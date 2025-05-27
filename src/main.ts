import { DateString } from './lib/dates/string.ts';
import { log } from './lib/log.ts';
import { refresh_position } from './subroutines/refresh_position.ts';
import type { Portfolio, Position, Share } from './types/db.ts';
import { write_friday_calls } from './subroutines/write_friday_calls.ts';
import { init_portfolio } from './subroutines/init_portfolio.ts';
import { CONFIG } from './types/config.ts';
import { ensureFriday, ensureMonday, isFriday, isMonday } from './lib/dates/ensure.ts';
import { tomorrow } from './lib/dates/next.ts';

const onMondays = async (portfolio: Portfolio, date: DateString): Promise<Portfolio> => {
	const monday = ensureMonday(date);

	// get latest share price
	const equity: Position<Share> = await refresh_position(portfolio.equity, monday);
	const new_portfolio = { ...portfolio, equity };

	// write covered calls on equity
	return await write_friday_calls(new_portfolio, monday);
};

const onFridays = async (folioOG: Portfolio, date: DateString): Promise<Portfolio> => {
	const friday = ensureFriday(date);
	if (!folioOG.call) throw new Error('No calls to check for');

	const folio: Portfolio = { ...folioOG };

	// close calls
	folio.call.exit = folio.call.current;
	folio.call.qty = 0;

	// update equity
	folio.equity = await refresh_position(folioOG.equity, friday);

	// check if calls were exercised
	const strike = folio.call.entry.strike;
	const market = folio.equity.current.close;
	if (market >= strike) {
		// close equity
		folio.equity.exit = folio.equity.current;
		folio.equity.qty = 0;
		folio.cash += strike * folio.call.qty;
	}

	return folio;
};

// @ts-ignore
if (import.meta.main) {
	log.info('Nothing in main');

	let portfolio = await init_portfolio(CONFIG.startingBalance);
	let date = CONFIG.startDate;
	for (let i = 0; i < 300; i++) {
		log.info(`${date}`);
		if (isMonday(date)) portfolio = await onMondays(portfolio, date);
		if (isFriday(date)) portfolio = await onFridays(portfolio, date);
		date = tomorrow(date);
	}
}
