# Ether-Bet
Betting DAPP

## Team Members  

Neelesh Verma - 160050062  
Ankit - 160050044  

## Project Description  

### What this DAPP is all about  
This is a betting Dapp. Here users can bet their money (ethers) on different events. For now, we have supported three events for betting in our Dapp :-
- Election
- Cricket
- Horse Racing

The homepage has links to all these three events. There are some rules associated with placing the bets:-  

***Election :-***  
There will be two candidates who will be contesting in elections. Users can place their bet on one of the candidates. Furthermore, when the winner is declared, the total money will be distributed to the users who bet their money on the winner.

***Cricket***  
Users will choose five players out of 30 players with the constraint to the credit given to each player and entry fee. Now, as the Cricket match ends, each user will have some score based on the player's performance in the match, The highest scorer will get half of the total money pool, and the rest half will be sent to the owner's address

***Horse Racing***  
Users will choose a horse and bet some ether on it.
When the race ends, and if the user has betted on the winner horse, He/She will get the money based on the bet and the bet-ratio of the horse


*The winner and constraints of the games will be set by the owner of the contracts

You have to add a file "package.json" containing all the dependencies.  
  
{  
  "name": "betting-dapp",  
  "version": "1.0.0",  
  "description": "Blockchain Betting Dapp powered by Ethereum",
  "main": "truffle-config.js",  
  "directories": {  
    "test": "test"  
  },  
  "scripts": {  
    "dev": "lite-server",  
    "test": "echo \"Error: no test specified\" && sexit 1"  
  },  
  "license": "ISC",  
  "devDependencies": {  
    "bootstrap": "4.1.3",  
    "chai": "^4.1.2",  
    "chai-as-promised": "^7.1.1",  
    "chai-bignumber": "^2.0.2",  
    "lite-server": "^2.3.0",  
    "nodemon": "^1.17.3",  
    "truffle": "5.0.2",  
    "truffle-contract": "3.0.6"  
  }  
}  
