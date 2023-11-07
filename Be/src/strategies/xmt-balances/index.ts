import { get_token_holders } from "../../services/lightApi.service";
import { BalanceHolder } from "../../types";
import { getStats, getTokenBalance } from "../../services/proton.service";

export const author = 'jay';
export const version = '0.0.1';

export const tokens = [
  {
    currency: 'XMT',
    decimals: 6,
    contract: 'xtokens'
  },
];

export async function strategy(
  network: string,
): Promise<BalanceHolder> {
  const balances = await get_token_holders('xtokens', 'XMT');
  return balances || {};
}

export async function supply(): Promise<number> {
  const stats = await Promise.all(
    tokens.map(token => getStats(token.contract, token.currency))
  );

  let total = 0;
  for (const stat of stats) {
    total += Number(stat.rows[0].supply?.split(" ")[0] || 0);
  }

  // Substract amount in proton.wrap
  const balanceFromWrap = await getTokenBalance('xtokens', 'XMT', 'proton.wrap');
  return total - balanceFromWrap;
}
