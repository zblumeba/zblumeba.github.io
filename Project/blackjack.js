//Zane Blume-Babcock
//CSCI 4970
//5/1/2021


$(document).ready(function() {
    

	var deck = ["2D", "3D", "4D", "5D", "6D", "7D", "8D", "9D", "0D", "JD", "QD", "KD", "AD",
				"2S", "3S", "4S", "5S", "6S", "7S", "8S", "9S", "0S", "JS", "QS", "KS", "AS",
				"2H", "3H", "4H", "5H", "6H", "7H", "8H", "9H", "0H", "JH", "QH", "KH", "AH",
				"2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "0C", "JC", "QC", "KC", "AC"
				] 
	
	
	
	//Deck shuffling function, swaps the position of cards in the deck semi-randomly
	function shuffleDeck(deck) {
	  for (let i = deck.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[deck[i], deck[j]] = [deck[j], deck[i]];
	  }
	}

	


	shuffleDeck(deck);



	//Creates arrays to hold player and dealer cards, and variable to store points
	var playerHand = new Array();
	var opponentHand = new Array();
	var opponentPoints = 0;
	var playerPoints = 0;
	var gamesWon = 0;
	var gamesLost = 0;
	
	$("#wins").html(gamesWon);
	$("#losses").html(gamesLost);
	$("#playerPoints").html(playerPoints);
	$("#opponentPoints").html( opponentPoints);
	
	
	//The deal function. Draws 4 cards, 2 for player, and 2 for dealer. It calls the animateCard function after each card draw, with the remaining card draws and animations as an unnamed callback function (nested callbacks)
	function deal(){
		
			var card = deck.pop();
			playerHand.push(card);
			
			animateCard(true, false, function (){				
				displayCards(false);
				var card2 = deck.pop();
				opponentHand.push(card2);
								
				animateCard(false, false, function (){
					displayCards(false);
					var card = deck.pop();
					playerHand.push(card);
					
					animateCard(true, false, function (){
						displayCards(false);
						var card2 = deck.pop();
						opponentHand.push(card2);
											
						animateCard(false, false, function(){
							displayCards(false);
							$("#hit_button").show();
							$("#stand_button").show();
						});
					});
				});
			});
		//}		
	}
	
	//Update the total of point values for player and dealer. 
	function updatePoints(dealerRevealed){
		playerPoints = 0;
		opponentPoints = 0;
		var aceCount = 0;
		for (var i = 0; i < playerHand.length; i++){
			
			var rank = playerHand[i].slice(0,1);
			if(rank == '0' || rank == 'J' || rank == 'Q' || rank == 'K' )
				value = 10;
			else if(rank == 'A'){
				value = 11;
				aceCount++; //If player hand has an ace, add to an ace counter value
			}
			else
				value = parseInt(rank);
			
			playerPoints += value;
			
		}
		
		//For every ace in the hand, if the total points are above 21, swap 
		//from an 11 ace value to a 1 ace value
		if(playerPoints >21)
			for (var j = 0; j<4; j++){
				if (playerPoints >21 && aceCount > 0){
					playerPoints -= 10;
					aceCount--;
				}
			}
			
		var aceCount = 0;
		
		
		//Determine how many dealer cards to count in order to show points. 
		//If the dealer has a face down card (dealerRevealed == false) then
		//start counting from the second card in dealer hand (index 1). 
		//Else start at first card.
		var dealerCardCount;
		
		if( dealerRevealed == true)
			dealerCardCount = 0;
		else
			dealerCardCount = 1;
		
		//Repeat the same process of counting points and checking aces,
		//with the additional check to start either at 1st or 2nd card spot
		for (var i = dealerCardCount; i < opponentHand.length; i++){
			
			var rank = opponentHand[i].slice(0,1);
			if(rank == '0' || rank == 'J' || rank == 'Q' || rank == 'K' )
				value = 10;
			else if(rank == 'A'){
				value = 11;
				aceCount++;
			}
			else
				value = parseInt(rank);
			
			opponentPoints += value;
			
		}
		
		//Dealer ace count check
		if(opponentPoints >21)
			for (var j = 0; j<4; j++){
				if (opponentPoints >21 && aceCount > 0){
					opponentPoints -= 10;
					aceCount--;
				}
			}
		
		
		//Update the points to the HTML objects
		$("#playerPoints").html(playerPoints);
		$("#opponentPoints").html( opponentPoints);
	}
	
	
	//A function to display the right cards images to the correct spots on the screen
	function displayCards(dealerRevealed){
		
		
		//For every card in the player hand, splice the string to create the correct image file name
		for (var i = 0; i < playerHand.length; i++){
			var stringID = "spot" + (i+9);
			//Since 10 cards are stored as 0D, 0S, etc. take the first character. If it is a 0, add 1 to the front (for '10D', '10S', etc). 
			//Using card names, make a string to point to the right file path, such as "images/" + QH + ".png" = "images/QH.png"
			//Then, set the src of the spoti to the file path, and show the card (default is hidden)
			$('#'+stringID).attr("src", "images/" + (playerHand[i].slice(0,1) == '0' ? '1' + playerHand[i] : playerHand[i]) + ".png");
			$('#'+stringID).show();
			
		}
		
		
		//Repeat steps as above but for dealer. If dealer has not revealed first card, the just print a blue_back.png in spot 1
		var dealerCardCount = 1;
		if( dealerRevealed == true)
			dealerCardCount = 0;
		else if (opponentHand.length >= 1){
			dealerCardCount = 1;
			$("#spot1").attr("src", "images/blue_back.png");
			$("#spot1").show();
		}
		
		for (var i = dealerCardCount; i < opponentHand.length; i++){
			var stringID = "spot" + (i+1);
			$('#'+stringID).attr("src", "images/" + (opponentHand[i].slice(0,1) == '0' ? '1' + opponentHand[i] : opponentHand[i]) + ".png");
			$('#'+stringID).show();
		}
		
		updatePoints(dealerRevealed)
	}
	
	
	//Function to change messages when player or dealer busts. Also ends the game and counts win/loss
	//whichBust variable =  1 for player bust, anything else for dealer bust
	function bust(whichBust){
		displayCards(true);
		if(whichBust == 1){
			
			$("#message").show();
			$("#message").css("background-color", 'red');
			$("#message").text( "Player Bust! You Lose!");
			gamesLost++;
		}
		else {
			
			$("#message").show();
			$("#message").css("background-color", 'green');
			$("#message").text( "Dealer Bust! You Win!");
			gamesWon++;
		}
		$("#reset_button").show();
		$("#hit_button").hide();
		$("#stand_button").hide();
		$("#wins").html(gamesWon);
		$("#losses").html(gamesLost);
	}
	
	
	//Function to compare the point values at the end of the game
	function compare(){
		displayCards(true);
		
		//If the dealer doesnt have 21, the player does have 21, and the player only has 2 cards,
		//Then the player has won with a Blackjack hand. Counts as a bonus win
		if(playerPoints == 21 && playerHand.length == 2){
			
			if(opponentPoints != 21){
				$("#message").show();
				$("#message").css("background-color", 'green');
				$("#message").text(  "Blackjack! You Win! (counts as two wins!)");
				gamesWon+=2;
			}
				
		}
		
		//Check for busts
		else if(playerPoints > 21)
			bust(1);
		else if(opponentPoints > 21)
			bust();

		//Compare points. If player is higher, they won.
		else if(playerPoints > opponentPoints){
			
			$("#message").show();
			$("#message").css("background-color", 'green');
			$("#message").text(  "You Win!");
			gamesWon++;
			
		}
		else if(playerPoints == opponentPoints){ //Player and dealer have the same points, tie, no win or loss
			
			$("#message").show();
			$("#message").css("background-color", 'blue');
			$("#message").text(  "Tie!");
			
		}
		else {//Player loses
			
			$("#message").show();
			$("#message").css("background-color", 'red');
			$("#message").text(  "You Lose!");
			gamesLost++;
			
		}
		
		//Hide the play button, and show the "play again" button. Also update win/loss values.
		$("#reset_button").show();
		$("#hit_button").hide();
		$("#stand_button").hide();
		$("#wins").html(gamesWon);
		$("#losses").html(gamesLost);
	}
	
	
	//Starts the dealers turn, after player has pressed 'stand'. Dealer draws
	//up to 17 or higher, then stops.
	function dealerTurn(){
		
		//Make sure dealer points are up to date, and that the total is not lower
		//because of the hidden card (call updatePoints with dealerRevealed == true)
		updatePoints(true);
		
		//Reveal the first card spot, dealers hidden card
		displayCards(true);
		
		//Since there is only one player, the dealer doesnt need to draw if they are
		//already beating the player. Only draw if dealer points are less than or 
		//equal to player points
		while(opponentPoints < 18 && opponentPoints <= playerPoints){
			
			//If total is 17, check for "soft 17". If yes, draw a card. 
			//If no, end the loop, since the dealer must have a hard 17
			if(opponentPoints == 17){
				var aceCheck = false;
				
				for (var i = 0; i < opponentHand.length; i++){
					var rank = opponentHand[i].slice(0,1);
					if(rank == 'A'){
						aceCheck = true;
					}		
				}
				
				if(aceCheck) {
					var card2 = deck.pop();
					opponentHand.push(card2);
					animateCard(false, true, displayCards);
					updatePoints(true);
				}else
					break;
			} 
			
			
			//If the total was less than 18, and not exactly 17, draw
			//a card, since the total must be 16 or lower.
			var card2 = deck.pop();
			opponentHand.push(card2);
			animateCard(false, true, displayCards);
			updatePoints(true);
		}
			
		//If the dealer has drawn new cards on their turn, they should be animated
		if(opponentHand.length > 2){			
		animateCard(false, true, function(){
			displayCards(true);
			updatePoints(true);
			compare();
		});
		}
		else{
			updatePoints(true);
			compare();
		}
	}
	
	
	//Starts the game over from scratch (except for win/loss total)
	function resetGame(){
		
		//Hide all the card spots
		for (var i = 1; i < 17; i++){
		
			var stringID = "spot" + (i);
			$('#'+stringID).hide();
		}
		
		//Hide "play again" button and show "deal" button
		$("#reset_button").hide();
		$("#deal_button").show();
		
		//New deck
		deck = ["2D", "3D", "4D", "5D", "6D", "7D", "8D", "9D", "0D", "JD", "QD", "KD", "AD",
				"2S", "3S", "4S", "5S", "6S", "7S", "8S", "9S", "0S", "JS", "QS", "KS", "AS",
				"2H", "3H", "4H", "5H", "6H", "7H", "8H", "9H", "0H", "JH", "QH", "KH", "AH",
				"2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "0C", "JC", "QC", "KC", "AC"
				] 
		
		//Shuffle and reset player/dealer hands and points.
		shuffleDeck(deck);
		playerPoints = 0;
		opponentPoints = 0;
		playerHand =[];
		opponentHand = [];
		
		$("#playerPoints").html(playerPoints);
		$("#opponentPoints").html( opponentPoints);
		$("#message").hide();
		
	}
	
	//Animation function for moving cards.  Variables: 
	// player == true if it is the player drawing, else it is dealer draw
	//revealed: for use with callBack function, is the dealer first card revealed, true or false
	//callBack: place for callback function, such as displayCards().
	function animateCard(player, revealed, callBack){
		
		var elem = $("#dealt_card");  
		elem.show()
		
		//Deck position
		var startY = 350;
		var startX = 1100;

		//The position of the card spot to move to. Must be
		//modified depending on hand size and whether it is
		//player or dealer drawing
		var endY = 216;
		var endX = 0;

		if(player){
		  endY += 250;
		  endX = 158 + (playerHand.length * 100);
		}
		else
		endX = 158 + (opponentHand.length * 100);

		//Start a timer. Every millisecond, move the card close to 
		//the target position by 3 pixels on X and Y
		var timer = setInterval(frame, 1);
		function frame() {
			
			if(player){//The player has card spots below the deck. Y moves down (adding to style ("top"))
				
				//If card has reached the target, end timer and call the callBack function.
				if (startY >= endY && startX <= endX) {
				elem.hide();
				clearInterval(timer);
				callBack(revealed);
				} 
				else if (startX <= endX){//Card is at correct X, but not Y
					startY += 3;
					elem.css("top", startY + "px"); 
				  
				}
				else if(startY >= endY){ //Card is at correct Y, but not X
					startX -= 3; 
					elem.css("left", startX + "px"); 
				}
				else{//Card is not at the right X or Y
					startY += 3;
					elem.css("top", startY + "px");
					startX -= 3; 
					elem.css("left", startX + "px"); 
				}
				
				
			}
			else{ //The dealer has card spots above the deck. Y moves up (subtracting from style ("top"))
				if (startY <= endY && startX <= endX) {
					elem.hide();
					clearInterval(timer);
					callBack(revealed);
					} 
					else if (startX <= endX){
						startY -= 3;
						elem.css("top", startY + "px"); 
					  
					}
					else if(startY <= endY){
						startX -= 3; 
						elem.css("left", startX + "px"); 
					}
					else{
						startY -= 3;
						elem.css("top", startY + "px");
						startX -= 3 ; 
						elem.css("left", startX + "px"); 

					}
			}
		}	
	}
    

	 $("#deal_button").click(function() { 
 
		//hide the deal button
		$("#deal_button").hide();
		

		deal(function(){
		
		
		//Unused code, displays a split button when player starting cards match. Not currently working
		/*
		var rank1 = playerHand[0].slice(0,1);
		var rank2 = playerHand[1].slice(0,1);
		
		
		//An array containing all the card ranks that have the same point value (10) but different names. For checking if the first hand is a split.
		var tenAndFaceCards = ['0', 'J', 'Q', 'K']
		
		//If card 1 has the same rank as card 2, it is a split
		if(rank1 ==  rank2 )
 			$("#split_button").show();

		//If card 1 is a face or ten card, and so is card 2, it is a split.
		if(tenAndFaceCards.indexOf(rank1) > 0 && tenAndFaceCards.indexOf(rank2) > 0)
			$("#split_button").show();
		
		*/

		});

    }); // end click
	
	
	$("#hit_button").click(function() {
		
		//hide the hit and stand buttons while the animation is playing.
		$("#hit_button").hide();
		$("#stand_button").hide();
		if(playerHand.length < 8){
			var card = deck.pop();
			playerHand.push(card);
		}
		
		animateCard(true, false, function (){
	
		//show the cards, show the play buttons, then check for bust.
		displayCards(false);
		$("#hit_button").show();
		$("#stand_button").show();
		if(playerPoints > 21){
			bust(1);
		
		}
		
		});
		
	});
	
	
	$("#stand_button").click(function() {
		//$("#split_button").hide();
		dealerTurn();
	});
	
	$("#reset_button").click(function() { 
		resetGame();
	});


	
}); // end ready
 

	