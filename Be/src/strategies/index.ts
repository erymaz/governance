import { readFileSync } from 'fs';
import { Strategies } from '../types';

import * as xmtBalances from './xmt-balances';
import * as xprUnstakedAndStakedBalances from './xpr-unstaked-and-staked-balances';
import * as loadBalances from './loan-and-sloan-balances';

const strategies: Strategies = {
  'xmt-balances': xmtBalances,
  'xpr-unstaked-and-staked-balances': xprUnstakedAndStakedBalances,
  'loan-and-sloan-balances': loadBalances,
};

Object.keys(strategies).forEach(function (strategyName) {
  let about = '';

  try {
    about = readFileSync(`src/strategies/${strategyName}/README.md` ,'utf8');
  } catch (error) {
    about = '';
  }

  strategies[strategyName].about = about;
});

export default strategies;
