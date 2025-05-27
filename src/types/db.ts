import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import type { Tables } from './schema.ts';
import { DateString } from '../lib/dates/string.ts';

interface ShareRequired {
	close: number;
}

interface ContractRequired {
	call_put: 'Call' | 'Put';
	bid: number;
	ask: number;
	strike: number;
	expiration: DateString;
}

export type Contract = Tables<'gme'> & ContractRequired;
export type Share = Tables<'gme_stock'> & ShareRequired;
export type Security = Contract | Share;

// for supabase queries
export type Query<T> = PostgrestSingleResponse<T[]>;

// type validation
export const is_contract = (contract: any): contract is Contract => {
	return contract.call_put != undefined;
};

export const is_share = (share: any): share is Share => {
	return share.close != undefined;
};

// custom types

export type Position<T extends Security> = {
	entry: T;
	current: T;
	exit?: T;
	qty: number;
};

export type Portfolio = {
	cash: number;
	call: Position<Contract>;
	put: Position<Contract>;
	equity: Position<Share>;
};
