function putBorder(id){
	if(document.getElementById(id).style.border != "")
			document.getElementById(id).style.border = "";
		else
			document.getElementById(id).style.border = "thick solid #0000FF"
}

// function submitForm(){
// 	// console.log("Here");
// 	var captainId = document.getElementById("captain_id").value;
// 	var viceCaptainId = document.getElementById("vice_captain_id").value;
// 	// console.log(captainId);
// 	var totalSelectedPlayers = 0;
// 	var returnString = captainId + "," + viceCaptainId;
// 	if(captainId == "" || viceCaptainId == "")
// 	{
// 		document.getElementById("error_to_show").innerHTML = "Please fill appropriate value for both the fields";
// 		document.getElementById("error").style.display = "block";
// 	}
// 	else
// 	{
// 		for(var i=1; i<=30; i++)
// 		{
// 			if(document.getElementById(i).style.border != "")
// 			{
// 				returnString = returnString + "," + i;
// 				totalSelectedPlayers++;
// 			}
// 		}
// 		if(totalSelectedPlayers == 11)
// 		{
// 			console.log(totalSelectedPlayers);
// 			console.log(returnString);
// 			document.getElementById("error_to_show").innerHTML = "Congratulations! You have successfully placed your bets.";
// 			document.getElementById("error").style.display = "block";
// 			return returnString;
// 		}
// 		else
// 		{
// 			document.getElementById("error_to_show").innerHTML = "You are required to select a total of 11 players.";
// 			document.getElementById("error").style.display = "block";	
// 		}
// 	}
// }
