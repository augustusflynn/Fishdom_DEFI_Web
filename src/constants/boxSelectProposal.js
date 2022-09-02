import abiStaking from "./../constants/abiStaking.json";
import abiMining from "./../constants/abiMining.json";
import {
  daoTreasuryAbi,
  daoTreasuryAddress,
  luckyWDAAbi,
  luckyWDAAddress,
} from "./constants";

//increase or decrease % apr stake WDA
export const _StakingAbi = abiStaking.stakingAbi;
export const _StakingAddress = abiStaking.stakingAddress;
//increase or decrease the amount of coins needed to mine CROWN
export const _MiningAbi = abiMining.miningAbi;
export const _MiningAddress = abiMining.miningAddress;
//increase or decrease the number of WDA bonus tokens of 1 Lucky Ticket win
export const _luckyTicketAbi = luckyWDAAbi;
export const _luckyTicketAddress = luckyWDAAddress;
//transfer WDA tokens to Staking or Ecosystem Rewards
//use BNB fund to buy depending on the amount of WDA on pancake
export const _devAddress = "0x80474c4703e16E2deC76d46B47f41DBB409c3bC2";
//sell depending on the amount of WDA on pancakes for BNB or USDT
export const _daoTresuryAbi = daoTreasuryAbi;
export const _daoTresuryAddress = daoTreasuryAddress;
//Reward holders of crown WDA or BNB depending on the amount
