pragma solidity ^0.5.0;
contract Horse_Bet {
  address payable public owner;
  uint256 public minimumBet;
  uint256 totalMoney = 0;
  bool valid_bet = false;

  address payable[] public players;
  uint256[] public bet_ratios; //per 100

  struct Player {
    uint256 amountBet;
    uint16 horseSelected;
  }
  mapping(address => Player) public playerInfo;
  // mapping(uint=>uint) public bet_ratio; //per 100

  function() external payable {}
  constructor() public {
    owner = msg.sender;
    minimumBet = 100000000000000;
  }
  function kill() public {
      if(msg.sender == owner) selfdestruct(owner);
  }
  function checkPlayerExists(address payable player) public view returns(bool){
    for(uint256 i = 0; i < players.length; i++){
      if(players[i] == player) return true;
    }
    return false;
  }
//main functions
 function betfunc(uint8 _teamSelected) public payable {
    require(valid_bet,"Betting time has ended");
    require(msg.value >= minimumBet,"Betting less than 100000000000000 Wei is not accepted");
    // require(!checkPlayerExists(msg.sender),"the player already exist");
    if(checkPlayerExists(msg.sender)){
      require(playerInfo[msg.sender].horseSelected == _teamSelected,"You can bet on only one Team/Player");
      playerInfo[msg.sender].amountBet += msg.value;
      totalMoney+=msg.value;
    }else{
      playerInfo[msg.sender].amountBet = msg.value;
      playerInfo[msg.sender].horseSelected = _teamSelected;
      players.push(msg.sender);
      totalMoney+=msg.value;
    }
  }

  function distributePrizes(uint16 teamWinner) public {
    require(msg.sender == owner,"Only owner can use this function");//can add time also in require option then anyone can use this but only once #security
    uint256 bet;
    uint256 ratio = bet_ratios[teamWinner];
    address payable playerAddress;
    for(uint256 i = 0; i < players.length; i++){
      playerAddress = players[i];
      if(playerInfo[playerAddress].horseSelected == teamWinner){
        bet = playerInfo[playerAddress].amountBet;
        playerAddress.transfer((bet*ratio)/100);
        totalMoney-=(bet*ratio)/100;
      }
      delete playerInfo[playerAddress]; 
    }
    players.length = 0; 
    bet_ratios.length = 0;
    owner.transfer(totalMoney);
    totalMoney = 0;
    valid_bet = false;
  }
  function Total_bet_by_Address(address _address,uint16 _team) public view returns(uint256){
    if(playerInfo[msg.sender].horseSelected == _team){
      return playerInfo[_address].amountBet;  //default is 0
    }
    else {
      return 0;
    }
  }
  function set_bet_ratio( uint[] memory _bet_ratios) public {
    require(msg.sender == owner,"Only owner can use this function");//can add time also in require option then anyone can use this but only once #security
    for(uint i = 0; i < _bet_ratios.length; i++){
      bet_ratios.push(_bet_ratios[i]);
    }
    valid_bet = true;
  }

  function stop_betting() public {
    require(msg.sender == owner,"Only owner can use this function");//can add time also in require option then anyone can use this but only once #security
    valid_bet = false;
  }

  function get_bet_ratio( uint _id) public view returns(uint){
      if( _id >= bet_ratios.length)return 0;
      return bet_ratios[_id];
  }
}