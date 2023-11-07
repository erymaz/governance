import { get_token_holders } from "../../services/lightApi.service";
import { get_sloan } from "../../services/postgres.service";
import { getStats } from "../../services/proton.service";
import { BalanceHolder } from "../../types";

export const author = 'jay';
export const version = '0.0.1';

export const tokens = [
  {
    currency: 'LOAN',
    decimals: 4,
    contract: 'loan.token',
  },
  {
    currency: 'SLOAN',
    decimals: 4,
    contract: 'locked.token',
  },
];

export async function strategy(
  network: string,
): Promise<BalanceHolder> {
  const unstakedBalances = await get_token_holders('loan.token', 'LOAN');
  const stakedBalances = await get_sloan('SLOAN', 4);
  
  const balances: BalanceHolder = {};
  for (const account of Object.keys(unstakedBalances)) {
    const unstakedAmount = unstakedBalances[account].amount || 0;
    const stakedAmount = stakedBalances[account]?.amount || 0;
    const amount = stakedAmount + unstakedAmount;

    balances[account] = {
      account,
      amount,
    };
  }
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
  return total;
}
