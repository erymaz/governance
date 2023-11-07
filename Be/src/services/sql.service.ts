import { createPool } from "mariadb"
import { MARIADB_HOST, MARIADB_PORT, MARIADB_USER, MARIADB_PASSWORD, MARIADB_DATABASE } from "../constants";
import { BalanceHolder } from "../types";

const MARIADB_CONFIG = {
  host: MARIADB_HOST,
  port: MARIADB_PORT,
  user: MARIADB_USER,
  password: MARIADB_PASSWORD,
  database: MARIADB_DATABASE,
}

const pool = createPool(MARIADB_CONFIG);

export async function get_short_stakers(): Promise<BalanceHolder> {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(`
      SELECT *
      FROM proton_ROWS
      WHERE
        contract='eosio' AND
        tbl='delxpr' AND
        field='quantity'
      ORDER BY pk asc
    `);

    const data: BalanceHolder = {};
    rows.forEach((row: { scope: string, fval: Buffer }) => {
      if (!data[row.scope]) {
        data[row.scope] = {
          account: row.scope,
          amount: +row.fval.toString().split(' ')[0],
        };
      }
    })
    return data;
  } catch (err) {
	  throw err;
  } finally {
	  if (conn) {
      conn.end();
    }
  }
}
