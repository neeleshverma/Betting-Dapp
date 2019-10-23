pragma solidity ^0.5.0;
contract Cricket {
  address payable public owner;
  uint256 public Bet_value;
  uint no_of_bet_so_far = 0;
  address payable[] public players;
  bool valid_bet = false;


  struct Player {
    uint[5]  Player_selected;
    uint captain;
    uint vice_captain;//should not be same as captain
  }

  struct SelectedPlayer {
    uint credit; //max 100
    uint wicketkeeper_batsman_allrounder_bowler;//1-4,3-6,1-4,3-6
    uint team_AB; //1-2

    uint16 run;
    uint16 four;
    uint16 six;
    uint16 wicket;
    uint16 maiden;
  }

  mapping(address => Player) public playerInfo;
  mapping(uint=>SelectedPlayer) public SelectedPlayerInfos;


  function() external payable {}
  constructor() public {
    owner = msg.sender;
  }

  function kill() public {
      if(msg.sender == owner) selfdestruct(owner);
  }

  function init_bet(uint256 _Bet_value,uint8[] memory _credit,uint8[] memory _w_b_a_b,uint8[] memory _ab)public{
    require(msg.sender == owner,"Only owner can use this function");//can add time also in require option then anyone can use this but only once #security
    Bet_value = _Bet_value;
    for(uint i = 0; i < _credit.length; i++){
      SelectedPlayerInfos[i] = SelectedPlayer(_credit[i],_w_b_a_b[i],_ab[i],0,0,0,0,0);
    }
    valid_bet = true;
  }

  function dist_bet(uint16[] memory _run,uint16[] memory _four,uint16[] memory _six, uint16[] memory _wicket, uint16[] memory _maiden)public{
    require(msg.sender == owner,"Only owner can use this function");//can add time also in require option then anyone can use this but only once #security
    for(uint i = 0; i < _run.length; i++){
      SelectedPlayerInfos[i].run = _run[i];
      SelectedPlayerInfos[i].four = _four[i];
      SelectedPlayerInfos[i].six = _six[i];
      SelectedPlayerInfos[i].wicket = _wicket[i];
      SelectedPlayerInfos[i].maiden = _maiden[i];
    }
    address payable playerAddress;
    address payable max_playerAddress;
    uint16 count = 0;
    uint16 max_count = 0;
    uint ith_player_info;
    for(uint16 i = 0; i < players.length; i++){
      count = 0;
      playerAddress = players[i];
      for(uint8 ij=0;ij<5;ij++){
        ith_player_info =  playerInfo[playerAddress].Player_selected[ij];
        count += SelectedPlayerInfos[ith_player_info].run + SelectedPlayerInfos[ith_player_info].four * 4 + SelectedPlayerInfos[ith_player_info].six * 6+ SelectedPlayerInfos[ith_player_info].wicket * 10 + SelectedPlayerInfos[ith_player_info].maiden * 5;
      }
      ith_player_info = playerInfo[playerAddress].captain;
      count += 3 * ( SelectedPlayerInfos[ith_player_info].run + SelectedPlayerInfos[ith_player_info].four * 4 + SelectedPlayerInfos[ith_player_info].six * 6+ SelectedPlayerInfos[ith_player_info].wicket * 10 + SelectedPlayerInfos[ith_player_info].maiden * 5 );
      ith_player_info = playerInfo[playerAddress].vice_captain;
      count += 1 * ( SelectedPlayerInfos[ith_player_info].run + SelectedPlayerInfos[ith_player_info].four * 4 + SelectedPlayerInfos[ith_player_info].six * 6+ SelectedPlayerInfos[ith_player_info].wicket * 10 + SelectedPlayerInfos[ith_player_info].maiden * 5 );
      if (count > max_count){
        max_count = count;
        max_playerAddress = playerAddress;
      }
    }
    max_playerAddress.transfer((Bet_value * no_of_bet_so_far)/2 );
    owner.transfer((Bet_value * no_of_bet_so_far)/2 );
    no_of_bet_so_far = 0;
    players.length = 0; 
    valid_bet = false;

  }

  function checkPlayerExists(address payable player) public view returns(bool){
    for(uint256 i = 0; i < players.length; i++){
      if(players[i] == player) return true;
    }
    return false;
  }
//main functions
 function betfunc(uint[] memory player_id) public payable {
    // require(valid_bet,"Betting time has ended");
    require(!checkPlayerExists(msg.sender),"the player already exist");
    require (player_id.length == 7,"Exact 11 players are needed to form a Team");

    uint temp_credit = 0;
    uint temp_w = 0;
    uint temp_bow = 0;
    uint temp_bat = 0;
    uint temp_all = 0;
    uint temp_team_a = 0;
    uint player_id_i;
    bool check_captain = false;
    bool check_vice_captain = false;
    uint _captain = player_id[0];
    uint _vc = player_id[1];
    require (_captain != _vc,"captain and vice_captain should not be same");

    for(uint i=2;i<7;i++){
      player_id_i = player_id[i]-1;
      temp_credit+=SelectedPlayerInfos[player_id_i].credit;
      if(SelectedPlayerInfos[player_id_i].team_AB==1)temp_team_a++;

      if(SelectedPlayerInfos[player_id_i].wicketkeeper_batsman_allrounder_bowler==0)temp_w++;
      else if(SelectedPlayerInfos[player_id_i].wicketkeeper_batsman_allrounder_bowler==1)temp_bat++;
      else if(SelectedPlayerInfos[player_id_i].wicketkeeper_batsman_allrounder_bowler==2)temp_all++;
      else if(SelectedPlayerInfos[player_id_i].wicketkeeper_batsman_allrounder_bowler==3)temp_bow++;

      if (player_id_i == _captain)check_captain= true;
      if (player_id_i == _vc)check_vice_captain= true;
    }
    // require (check_captain ,"Captain needed for a Team");
    // require (check_vice_captain ,"Vice Captain needed for a Team");

    // require (temp_team_a >=1 && temp_team_a <=4 ,"Need Player from both Teams");
    // require (temp_w >=1 && temp_w <=4 ,    "Required no of players for wicketkeeper not matched");
    // require (temp_bow >=1 && temp_bow <=4 ,"Required no of players for bowler not matched");
    // require (temp_bat >=1 && temp_bat <=4 ,"Required no of players for batsman not matched");
    // require (temp_all >=1 && temp_all <=4 ,"Required no of players for all-rounder not matched");


    for(uint i=0;i<5;i++){
      playerInfo[msg.sender].Player_selected[i] = player_id[i+2]-1;
    }
    
    playerInfo[msg.sender].captain = _captain;
    playerInfo[msg.sender].vice_captain = _vc;
    players.push(msg.sender);
    no_of_bet_so_far++;
  }
  function stop_betting() public {
    require(msg.sender == owner,"Only owner can use this function");//can add time also in require option then anyone can use this but only once #security
    valid_bet = false;
  }

  function get_bet_value() public view returns(uint256){
    return Bet_value;////show this in HTML
  }

  function w_b_a_b(uint _a) public view returns(uint256){
    return SelectedPlayerInfos[_a].wicketkeeper_batsman_allrounder_bowler;////show this in HTML
  }

  function get_credit(uint _a) public view returns(uint256){
    return SelectedPlayerInfos[_a].credit;////show this in HTML
  }

  function get_team(uint _a) public view returns(uint256){
    return SelectedPlayerInfos[_a].team_AB;////show this in HTML
  }
}