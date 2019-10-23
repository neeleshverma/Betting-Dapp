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
    const betting = await $.getJSON('Cricket.json')
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
    // $('#account').html(App.account)

    // window.alert("Aad");
    for(var i = 1; i<=30;i++){
      var sd = await App.betting.get_credit(i-1)
      // var sd = $('#cred'+i).val
      // console.log(sd)
      $('#cred'+i).html(sd.toNumber())
      // $('#cred'+i).html(await App.betting.get_credit(i-1))
    }

    if (App.account == await App.betting.owner()){
      App.show_dist(true)
    }
    App.setLoading(false)
  },



  submitForm: async() =>{
    App.setLoading(true)

    console.log("Here");
    var captainId = document.getElementById("captain_id").value;
    var viceCaptainId = document.getElementById("vice_captain_id").value;
    // console.log(captainId);
    var totalSelectedPlayers = 0;
    var returnString = captainId + "," + viceCaptainId;
    if(captainId == "" || viceCaptainId == "")
    {
      document.getElementById("error_to_show").innerHTML = "Please fill appropriate value for both the fields";
      document.getElementById("error").style.display = "block";
    }
    else
    {
      for(var i=1; i<=30; i++)
      {
        if(document.getElementById(i).style.border != "")
        {
          returnString = returnString + "," + i;
          totalSelectedPlayers++;
        }
      }
      if(totalSelectedPlayers == 5)
      {
        console.log(totalSelectedPlayers);
        console.log(returnString);
        document.getElementById("error_to_show").innerHTML = "Congratulations! You have successfully placed your bets.";
        document.getElementById("error").style.display = "block";
        // return returnString;
      }
      else
      {
        document.getElementById("error_to_show").innerHTML = "You are required to select a total of 11 players.";
        document.getElementById("error").style.display = "block"; 
      }
    }
    var amount = await App.betting.get_bet_value()
    
    window.alert("Hey,You are Betting on :- "+amount+ "ether")
    window.alert(returnString.split(","))

    await App.betting.betfunc(returnString.split(",") ,{gas: 300000,from: App.account,value: web3.toWei(amount,'ether')})
    
    window.location.reload()

  },


  init_init: async (a,b,c,d) => {
    App.setLoading(true);
    // console.log("started1");
    // const owner_add = await App.betting.owner()
    if (App.account != await App.betting.owner()){
      window.alert("You are not the Owner");
    }
    else{
      // set_bet_ratio
      window.alert(a);
      window.alert(b.split(","));
      window.alert(c.split(","));
      window.alert(d.split(","));
      await App.betting.init_bet(a,b.split(","),c.split(","),d.split(","),{from: App.account})
    }
    window.location.reload()
  },

  dist_bet: async (a,b,c,d,e) => {
    App.setLoading(true)
    console.log("started1")
      window.alert("wewewe")

    // const owner_add = await App.betting.owner()
    if (App.account != await App.betting.owner()){
      window.alert("You are not the Owner")
    }
    else{
      await App.betting.dist_bet(a.split(","),b.split(","),c.split(","),d.split(","),e.split(","),{from: App.account})
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