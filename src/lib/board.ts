import { DateString } from './dates/string.ts';
import { log } from './log.ts';
import { midspread } from './math.ts';

export type BoardSettings = {
	min_dte: number;
	max_dte: number;
	min_strike: number;
	max_strike: number;
};

export const printBoard = (board: any[], settings?: Partial<BoardSettings>) => {
	// Get all possible field names and sort them
	const allFields = Object.keys(board[0] || {}).sort();

	// Add mid if bid and ask are present
	if (allFields.includes('bid') && allFields.includes('ask')) {
		board.forEach((row) => {
			row.mid = midspread(row.bid, row.ask);
		});
	}

	if (settings) {
		log.n();
		for (const field of Object.keys(settings)) {
			log.info(field + '\t' + settings[field as keyof BoardSettings]);
		}
		log.n();
	}

	// Print header
	log.c(allFields.join('\t'));

	// Print each row
	for (const row of board) {
		const line = allFields
			.map((field) => {
				const value = row[field as keyof typeof row];
				return value !== null ? value : '-';
			})
			.join('\t');
		console.log(line);
	}
	log.n();
};
