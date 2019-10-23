function templateSingleImage(horseName, horseFileName,ith_index){
	var header = '<figure class="col-lg-3 col-md-4 col-sm-6 col-12 tm-gallery-item">'
	header = header.concat('<div class="tm-gallery-item-overlay">')
	var imageTag = '<img style="height:250px;" src=' + horseFileName + ' alt="Image" class="img-fluid tm-img-center">'
	var horseNameTag = '<p class="tm-figcaption">' + horseName + '</p>'
	var total_bet_from_me = '<p class="tm-betcaption" class="title">Bet Amount  :- &emsp;<a href="" id="TotalBet'+ith_index+'"></a> Ether </p>'
	var gain_per_100 = '<p class="tm-betcaption" class="title">Per 100:- &emsp;<a href="" id="gain_from_100_'+ith_index+'"></a> Ether </p>'
	var amount_form_Tag	='<p><form onSubmit="App.Bet('+ith_index+',amount_to_bet.value); return false;"><input id="amount_to_bet" type="text" class="form-control" placeholder="Enter Amount" required><input type="submit" hidden="" ></form></p>'
	return header.concat(imageTag, '</div>', horseNameTag,total_bet_from_me,gain_per_100,amount_form_Tag, '</figure>')
}

function displayHorses(noOfImages){
	var horseGallery = document.getElementById('horse_gallery')
	var someHeader = '<div class="row">'
	var completeResult = '<div class="row">'
	for (var i=0; i < noOfImages; i++){
		var image = templateSingleImage("Horse "+i,"https://i.pinimg.com/originals/dd/32/7f/dd327f3e2ffff35de85e879856082653.jpg",i)
		completeResult = completeResult.concat(image)
	}
	horseGallery.innerHTML = completeResult.concat('</div>')
}

