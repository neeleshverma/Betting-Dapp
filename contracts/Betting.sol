pragma solidity ^0.5.0;
contract Betting {
  address payable public owner;
  uint256 public minimumBet;
  uint256 public totalBetsOne;
  uint256 public totalBetsTwo;
  address payable[] public players;
  bool valid_bet = true;

  struct Player {
    uint256 amountBet;
    uint16 teamSelected;
  }
  mapping(address => Player) public playerInfo;
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
    
    if(checkPlayerExists(msg.sender)){
    	require(playerInfo[msg.sender].teamSelected == _teamSelected,"You can bet on only one Team/Player");
    	playerInfo[msg.sender].amountBet += msg.value;

    }else{
	    playerInfo[msg.sender].amountBet = msg.value;
    	playerInfo[msg.sender].teamSelected = _teamSelected;
    	players.push(msg.sender);
    }
    if ( _teamSelected == 1){
      totalBetsOne += msg.value;
    }
    else{
      totalBetsTwo += msg.value;
    }
  }

  function distributePrizes(uint16 teamWinner) public {
    require(msg.sender == owner,"Only owner can use this function");//can add time also in require option then anyone can use this but only once #security
    address payable[1000] memory winners;//can be less
    //We have to create a temporary in memory array with fixed size
    //Let's choose 1000
    uint256 count = 0; // This is the count for the array of winners
    uint256 LoserBet = 0; //This will take the value of all losers bet
    uint256 WinnerBet = 0; //This will take the value of all winners bet
    address add;
    uint256 bet;
    address payable playerAddress;
    for(uint256 i = 0; i < players.length; i++){
      playerAddress = players[i];
      if(playerInfo[playerAddress].teamSelected == teamWinner){
        winners[count] = playerAddress;
        count++;
      }
    }
    if(teamWinner == 1){
      LoserBet = totalBetsTwo;
      WinnerBet = totalBetsOne;
    }
    else{
      LoserBet = totalBetsOne;
      WinnerBet = totalBetsTwo;
    }
    for(uint256 j = 0; j < count; j++){
      // Check that the address in this fixed array is not empty
      if(winners[j] != address(0))
        add = winners[j];
        bet = playerInfo[add].amountBet;
        //Transfer the money to the user
        winners[j].transfer((bet*(10000+(LoserBet*10000/WinnerBet)))/10000);
      }
    for(uint256 i = 0; i < players.length; i++){
    	playerAddress = players[i];
		delete playerInfo[playerAddress]; // Delete all the players
    }
	// delete playerInfo[playerAddress]; // Delete all the players
	players.length = 0; // Delete all the players array
	LoserBet = 0; //reinitialize the bets
	WinnerBet = 0;
	totalBetsOne = 0;
	totalBetsTwo = 0;
  }
  function AmountOne() public view returns(uint256){
    return totalBetsOne;//show this in HTML
  }
  function AmountTwo() public view returns(uint256){
    return totalBetsTwo;////show this in HTML
  }
  function Total_bet_by_Address(address _address,uint16 _team) public view returns(uint256){
    if(playerInfo[msg.sender].teamSelected == _team){
    	return playerInfo[_address].amountBet;	
    }
  	else {
  		return 0;
  	}
  }
  function stop_betting() public {
    require(msg.sender == owner,"Only owner can use this function");//can add time also in require option then anyone can use this but only once #security
    valid_bet = false;
  }
}


