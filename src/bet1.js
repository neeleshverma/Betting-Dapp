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
    const betting = await $.getJSON('Betting.json')
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
    totalBet =  await App.betting.AmountOne()
    $('#TotalBet1').html(totalBet.toNumber()/1000000000000000000)
    totalBet =  await App.betting.AmountTwo()
    $('#TotalBet2').html(totalBet.toNumber()/1000000000000000000)


    totalBet =  await App.betting.Total_bet_by_Address(App.account,1)
    // window.alert(totalBet)
    $('#TotalBet11').html(totalBet.toNumber()/1000000000000000000)
    totalBet =  await App.betting.Total_bet_by_Address(App.account,2)
    $('#TotalBet22').html(totalBet.toNumber()/1000000000000000000)

    // window.alert(totalBet)

    if (App.account == await App.betting.owner()){
      App.show_dist(true)
    }
    // Render Tasks
    // await App.renderTasks()

    // Update loading state
    App.setLoading(false)
  },

  Bet: async (team) => {
    // console.log("started")
    App.setLoading(true)
    console.log("started1")

    if (team == 1){
      amount = $('#amount_to_bet1').val();
    }
    else{
      amount = $('#amount_to_bet2').val();
    }

    // console.log("content is team:- ",team," &amount :- ",amount)

    await App.betting.betfunc(team ,{gas: 300000,from: App.account,value: web3.toWei(amount,'ether')})
    
    window.location.reload()
    // console.log("ended")
  },

    Distribute_bet: async (winner_team) => {
    App.setLoading(true)
    window.alert("winner Team : "+ winner_team)
    
    if (App.account != await App.betting.owner()){
      window.alert("You are not the Owner")
    }
    else{
      await App.betting.distributePrizes(winner_team,{from: App.account})
    }

    window.location.reload()
  },

  show_dist: (boolean) => {
    const winner_decl = $('#winner_id')
    if (boolean) {
      document.getElementById("winner_id").style.visibility = "visible"; 
    } else {
      winner_decl.style.visibility = "hidden";
    }
  },

  setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  }
}

$(() => {
  $(window).load(() => {
    App.load()
  })
})