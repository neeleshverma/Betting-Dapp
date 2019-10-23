const Betting = artifacts.require("Betting");
const horse_bet = artifacts.require("Horse_Bet");
const cricket_bet = artifacts.require("Cricket");

module.exports = function(deployer) {
  deployer.deploy(Betting);
  deployer.deploy(horse_bet);
  deployer.deploy(cricket_bet);
};
