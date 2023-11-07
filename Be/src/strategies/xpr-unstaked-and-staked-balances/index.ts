import { get_token_holders } from "../../services/lightApi.service";
import { get_short_stakers } from "../../services/sql.service";
import { getStats } from "../../services/proton.service";
import { BalanceHolder } from "../../types";

// require
export const author = 'jay';

// require
export const version = '0.0.1';

// require
export const tokens = [
  {
    currency: 'XPR',
    decimals: 4,
    contract: 'eosio.token'
  },
];

/*
  {
    protondev: {
      account: protondev,
      balance: 3000,
    },
    ....
  }
*/
export async function strategy(
  network: string,
): Promise<BalanceHolder> {
  const unstakedBalances = await get_token_holders(tokens[0].contract, tokens[0].currency);
  const stakedBalances = await get_short_stakers();

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
