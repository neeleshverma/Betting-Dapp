App = {
  loading: false,
  contracts: {},

  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.render()
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        //this is working
      // window.alert('1212Non-Ethereum browser detected. You should consider trying MetaMask!')

        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {

      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  loadAccount: async () => {
    // Set the current blockchain account
    App.account = web3.eth.accounts[0]
  },

  loadContract: async () => {
    // Create a JavaScript version of the smart contract
    const betting = await $.getJSON('Horse_Bet.json')
    App.contracts.Betting = TruffleContract(betting)
    App.contracts.Betting.setProvider(App.web3Provider)

    // Hydrate the smart contract with values from the blockchain
    App.betting = await App.contracts.Betting.deployed()
  },

  render: async () => {
    // Prevent double render
    if (App.loading) {
      return
    }

    // Update app loading state
    App.setLoading(true)

    // Render Account
    $('#account').html(App.account)

    for(var i= 0 ;i<number;i++){
      totalBet =  await App.betting.Total_bet_by_Address(App.account,i)
      $('#TotalBet'+i).html(totalBet.toNumber()/1000000000000000000)
      totalBet =  await App.betting.get_bet_ratio(i)
      $('#gain_from_100_'+i).html(totalBet.toNumber())


    }

    // window.alert(totalBet)

    if (App.account == await App.betting.owner()){
      App.show_dist(true)
    }
    App.setLoading(false)
  },


  Bet: async (team,amount) => {
    App.setLoading(true)
    window.alert("You are Betting on :- "+team+" with "+amount+ "ether")
    await App.betting.betfunc(team ,{gas: 300000,from: App.account,value: web3.toWei(amount,'ether')})
    window.location.reload()
  },


  set_bet_ratios: async (bet_ratios) => {
    App.setLoading(true);
    // console.log("started1");
    // const owner_add = await App.betting.owner()
    if (App.account != await App.betting.owner()){
      window.alert("You are not the Owner");
    }
    else{
      // set_bet_ratio
      window.alert(bet_ratios.split(","));
      await App.betting.set_bet_ratio(bet_ratios.split(","),{from: App.account})
    }
    window.location.reload()
  },

  Distribute_bet: async (winner_team) => {
    App.setLoading(true)
    console.log("started1")
    // const owner_add = await App.betting.owner()
    if (App.account != await App.betting.owner()){
      window.alert("You are not the Owner")
    }
    else{
      await App.betting.distributePrizes(winner_team,{from: App.account})
    }
    window.location.reload()
  },

  show_dist: (boolean) => {
    if (boolean) {
      document.getElementById("winner_id").style.visibility = "visible"; 
      document.getElementById("set_bet_id").style.visibility = "visible"; 
    } else {
      document.getElementById("winner_id").style.visibility = "visible"; 
      document.getElementById("set_bet_id").style.visibility = "visible"; 
    }
  },

  setLoading: (boolean) => {
    App.loading = boolean
  }
}

$(() => {
  $(window).load(() => {
    App.load()
  })
})