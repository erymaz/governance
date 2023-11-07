import { JsonRpc } from "@proton/js";
import constants from "../constants";
import { Community, Proposal, Vote } from "../types";

const { GOVERNANCE_CONTRACT, ENDPOINTS } = constants;

export const rpc = new JsonRpc(ENDPOINTS);

export const getStats = async (contract: string, currency: string) => {
  const result = await rpc.get_table_rows({
    code: contract,
    scope: currency,
    table: 'stat',
    limit: -1,
  });
  return result;
}

export const getTokenBalance = async (contract: string, currency: string, account: string) => {
  const balances = await rpc.get_currency_balance(contract, account, currency);
  let balance = 0
  if (balances.length) {
    balance = +balances[0].split(" ")[0];
  }
  return balance;
}

export const getCommunities = async (
  lower_bound?: any
): Promise<Community[]> => {
  try {
    let { rows, more, next_key } = await rpc.get_table_rows({
      code: GOVERNANCE_CONTRACT,
      scope: GOVERNANCE_CONTRACT,
      table: 'communities',
      key_type: 'i64',
      lower_bound,
      limit: -1,
    });

    if (more) {
      rows = rows.concat(await getCommunities(next_key));
    }

    return rows;
  } catch (e) {
    console.log(e);
    return [];
  }
}

export const getCommunity = async (id: number): Promise<Community | null> => {
  let community: null | Community = null;

  const { rows } = await rpc.get_table_rows({
    code: GOVERNANCE_CONTRACT,
    scope: GOVERNANCE_CONTRACT,
    table: 'communities',
    key_type: 'i64',
    lower_bound: id,
    limit: 1,
  });

  if (rows.length) {
    community = rows[0];
  }

  return community;
}

export const getProposals = async (communityId: number, key?: any): Promise<Proposal[]> => {
  const bounds = {
    lower_bound: key ? key : `0x${communityId.toString(16)}0000000000000000`,
    upper_bound: `0x${(communityId + 1).toString(16)}0000000000000000`,
  }
  let { rows, more, next_key } = await rpc.get_table_rows({
    code: GOVERNANCE_CONTRACT,
    scope: GOVERNANCE_CONTRACT,
    table: 'proposals',
    key_type: 'i128',
    index_position: 2,
    limit: -1,
    ...bounds
  });

  if (more) {
    rows = rows.concat(await getProposals(communityId, next_key));
  }

  return rows;
}

export const getProposal = async (id: number): Promise<Proposal | null> => {
  let proposal: null | Proposal = null;
  const { rows } = await rpc.get_table_rows({
    code: GOVERNANCE_CONTRACT,
    scope: GOVERNANCE_CONTRACT,
    table: 'proposals',
    key_type: 'i64',
    lower_bound: id,
    limit: 1,
  });

  if (rows.length) {
    proposal = rows[0];
  }

  return proposal;
}

export const getVotes = async (proposalId: number, key?: any): Promise<Vote[]> => {
  const bounds = {
    lower_bound: key ? key : `0x${proposalId.toString(16)}0000000000000000`,
    upper_bound: `0x${(proposalId + 1).toString(16)}0000000000000000`,
  }
  let { rows, more, next_key } = await rpc.get_table_rows({
    code: GOVERNANCE_CONTRACT,
    scope: GOVERNANCE_CONTRACT,
    table: 'votes',
    key_type: 'i128',
    index_position: 2,
    limit: -1,
    ...bounds
  });

  if (more) {
    rows = rows.concat(await getVotes(proposalId, next_key));
  }

  return rows;
}
