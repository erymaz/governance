import { Pool } from "pg";
import { POSTGRES_CONN_STRING } from "../constants";
import { BalanceHolder } from "../types";

const POSTGRES_CONFIG = {
  connectionString: POSTGRES_CONN_STRING,
}

const pool = new Pool(POSTGRES_CONFIG);

export async function get_sloan(currency: string, precision: number): Promise<BalanceHolder> {
  try {
    const { rows } = await pool.query(`
      SELECT *
      FROM current_rewards
      WHERE
        currency='${currency}' AND
        precision=${precision}
    `);

    const data: BalanceHolder = {};
    rows.forEach((row: { account: string, reward_snapshot: { balance: string }}) => {
      data[row.account] = {
        account: row.account,
        amount: (+row.reward_snapshot.balance) / Math.pow(10, precision),
      };
    });
    return data;
  } catch (err) {
	  throw err;
  }
}
