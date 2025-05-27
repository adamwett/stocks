import { Contract, is_contract, is_share, Position, Security, Share } from '../types/db.ts';

const N_CONTRACTS = 100;

export const roundToNearest = (price: number, step: number) => {
	const roundUp = Math.ceil(price / step) * step;
	const roundDown = Math.floor(price / step) * step;
	const whichWay = Math.abs(price - roundUp) < Math.abs(price - roundDown) ? 'up' : 'down';
	return whichWay === 'up' ? roundUp : roundDown;
};

export const midspread = (bid: number | null, ask: number | null) => {
	if (bid == null) throw new Error('No bid');
	if (ask == null) throw new Error('No ask');
	const mid = (bid + ask) / 2;
	return Number(roundToNearest(mid, 0.01));
};

export const contractValue = (contract: Contract, qty: number) => {
	return midspread(contract.bid, contract.ask) * N_CONTRACTS * qty;
};

export const shareValue = (share: Share, qty: number) => {
	return share.close * N_CONTRACTS * qty;
};

export const currentValue = (position: Position<Security>) => {
	if (is_contract(position.current)) return contractValue(position.current, position.qty);
	if (is_share(position.current)) return shareValue(position.current, position.qty);
	throw new Error('Invalid position type');
};

export const securityValue = (security: Security, qty: number) => {
	return currentValue({ current: security, entry: security, qty });
};
