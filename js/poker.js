
/* Sample input:
Joe 3H, 4H, 5H, 6H, 8H
Bob 3C, 3D, 3S, 8C, 10D
Sally AC, 10C, 5C, 2S, 2C
*/

// Five Card Poker Lingo
// Hand
//      five cards
// Hand Categories
//      type of hand (ie straight flush, four of a kind etc) 
// Hand Ranking
//      based on highest ranked card in hand (A, K, Q, J, 10...)
//      exception: A can be highest or lowest, depending on hand category

// Current ISSUES and/or BUGS
//
// 1. empty strings getting sent to storeSuits and storeRanks
//      - empty space after input in text-field
//      - moving closing textarea tag to immediately follow last char of inputs fixes
//      - need more programmatic fix, why isn't TRIM working?
// 2. Poor input handling
// 3. No provision for duplicate cards in inputs
//      "But the dealer just stares there's something wrong here he thinks. The gambler is seized and thrown to his knees and shot dead."
// 4. Lowercase Suits triggering warning in storeSuits
//      Quasi-fixed (because maybe input handler should deal with normalizing case)
// 5. More test data!!!


var myPoker = myPoker || {
    
    // Expects input of player objects stored in an array
    PokerGame: function  (playerObjArr) {
        var players = playerObjArr,
            winnerName = "",
            contendersArr = [];

        // Constants for various poker hand categories
        // Note: should be available to other functions
        var FLUSH = "flush",
            FOUR  = "four of a kind",
            THREE = "three of a kind",
            PAIR  = "pair",
            HIGHEST = "highest card",
            handCategoriesARR = [FLUSH, FOUR, THREE, PAIR, HIGHEST];

        // Unobtrusively(?) log some data to the console
        this.reviewGame = function(){

            var i = 0;

            console.log("Total players: " + players.length);
        
            for(i = 0; i < players.length; i++){
                console.log(players[i].getPlayerName());
                console.log(players[i].seeHand());            
                console.log(players[i].getHandType());
                console.log("\n");
            }
        },
        
        this.findWinner = function(){
            
            // go through hands in descending rank order (ie flush, four of kind, three of kind, pair, high card)
            // 1. anyone holding the current category of hand?
            //      1) anybody else?
            //      2) if NO, then WINNER and END
            //          1) see END sub-routine
            //      3) if YES, get all Holders of current hand category
            //          1) Loop through Holders and find HIGHEST RANK
            //              1) See Find Highest Rank Sub-Routine
            //                  Note: do it brute force, descending order (as with hand categories)
            //          2) WINNER holds HIGHEST RANKED HAND and END
            // 2. repeat previous for each Hand Category (in descending order)
            // 
            // END sub-routine
            // set winning player, return that player's name
            //
            // FIND HIGHEST RANKED HAND sub-routine
            // Simple, brute force method
            // 1. Loop through CARDS list from HIGHEST to LOWEST (A, K, Q, J, 10...)
            //      1. If Player has Card, player wins
            //          2. EXCEPTION: A used as a "1" in a Flush

            var totalCategories = handCategoriesARR.length,
                i = 0;

            for(i = 0; i < totalCategories; i++){
                
                if(this.evaluateHandCategory(handCategoriesARR[i])){
                    this.reviewGame();
                    this.showResult();
                    break;
                }

            }

        },

        // Analyse a given Hand Category (ie Flush, Four/Three of a Kind, Pair, High Card) by
        // finding number of players holding it
        // IF current category has only one player holding it, THEN Winner found, return TRUE
        // IF current category held by multiple players, THEN Tie, return TRUE
        // ELSE return FALSE
        this.evaluateHandCategory = function(handCategoryStr) {

            var totalPlayers = players.length,
                contendersCount = 0,
                i = 0;

            for(i = 0; i < totalPlayers; i++){

                if(this.hasHand(players[i].getHandType(), handCategoryStr)) {
                    contendersArr[contendersCount] = players[i];
                    contendersCount++;
                }                
            }

            if(contendersCount > 0){ 
                return true;
            }

            // else no player holding current hand category, contendersArr empty
            // heuristic: more efficient to assume no player has hand? ie first IF checks for empty array?
            return false;
        },

        this.hasHand = function(playerHand, handCategoryStr) {

            //alert("hasHand: " + playerHand + ", " + handCategoryStr)

            if(playerHand === handCategoryStr) {
                return true;
            }

            return false;
        },

        this.evaluateTie = function(playerHand, handCategoryStr) {

            //alert("evaluateTie")

            // only tie if Players have same cards with different suits?
        },

        this.showResult = function() {

            //alert("showResult")

            var winnerCount = contendersArr.length,
                winnerStr = "",
                i = 0;

            for(i = 0; i < winnerCount; i++){

                if(i > 0){
                    winnerStr += " and ";
                }
                
                winnerStr += contendersArr[i].getPlayerName();
                
            }

            //alert(winnerStr);
            document.getElementById("winnerBox").innerHTML = "It's: " + winnerStr;

        };
    }, // End PokerGame

    // Player Constructor
    Player: function (nameStr, handObj) {
        var name = nameStr,
            hand = handObj;
            
        this.getPlayerName = function() {
            return name;
        };
        
        this.seeHand = function() {        
            return hand.displayHand();
        }; 
        
        this.getHandType = function() {
            return hand.getType();
        };
    },

    // (Poker) Hand Constructor
    PokerHand: function (cardsArr) {
        var cards = cardsArr,
            ranks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K, A
            suits = [0, 0, 0, 0], // clubs, diamonds, hearts, spades
            handType = "",
            determiningRank = 0, // the ranking card of the hand
            kickerCard = 0; // highest card not part of the hand
        
        this.analyseHand = function() {
            var i = 0;
            
            for(i = 0; i < cards.length; i++){
                this.storeRanks(cards[i].getRank());
                this.storeSuits(cards[i].getSuit());
            }
        };
        
        this.storeRanks = function(rank) {

            rank = rank.toUpperCase(); // input handler job?
            
            switch(rank){
                case "2":
                  ranks[0]++;
                  break;
                case "3":                
                    ranks[1]++;
                    break;
                case "4":
                  ranks[2]++;
                  break;
                case "5":
                  ranks[3]++;
                  break;
                case "6":
                  ranks[4]++;
                  break;
                case "7":
                  ranks[5]++;
                  break;
                case "8":
                  ranks[6]++;
                  break;
                case "9":
                  ranks[7]++;
                  break;
                case "10":
                  ranks[8]++;
                  break;
                case "J":
                  ranks[9]++;
                  break;
                case "Q":
                  ranks[10]++;
                  break;
                case "K":
                  ranks[11]++;
                  break;
                case "A":
                  ranks[12]++;
                  break;
                default:
                    alert("Ruh-oh! Something spooky in storeRanks; input was: " + rank);          
            }
        };
        
        this.storeSuits = function(suit) {
            
            //alert("suit: " + suit + " - data type: " + typeof(suit));

            suit = suit.toUpperCase(); // input handler job?
            
            switch(suit){
                case "C":
                  suits[0]++; // why does ++ work here?
                  break;
                case "D":
                  suits[1]++;
                  break;
                case "H":
                  suits[2]++; // [1] ?????
                  break;
                case "S": // [1]
                  suits[3]++;
                  break;
                default:
                    alert("Ruh-oh! Something spooky in storeSuits; input was: " + suit);
            }
        };
        
        this.findHandRank = function(handCategoryStr) {
            // if it's a flush, it's the highest card (except if it's a 1, 2, 3, 4, 5 flush)
            // if it's two, three or four of a kind it's the highest of the kind
            // if it's highest card, it's highest card
            
            // flush and highest card both take highest non-empty element in ranks array

            switch(handCategoryStr){
                case "flush":
                  // make sure it's not a 1, 2, 3, 4, 5 flush? isAceLow()????)

                  break;
                case "four of a kind":
                  
                  break;
                case "three of a kind":
                  
                  break;
                case "two of a kind":
                  
                  break;
                case "highest card":
                  
                  break;
                default:
                    alert("Ruh-oh! Something spooky in findHandRank; input was: " + handCategoryStr);
            }

        };
        
        // do this as setter method, then make getter method that merely retrieves set value
        this.getType = function() {

            if(handType === ""){
                this.analyseHand();
                
                if(this.isFlush()){
                    handType = "flush";
                }
                else if(this.isMultipleOfKind(4)){
                    handType = "four of a kind";
                }
                else if(this.isMultipleOfKind(3)){
                    handType = "three of a kind";
                }
                else if(this.isMultipleOfKind(2)){
                    handType = "two of a kind";
                }
                else{
                    handType = "highest card";
                }
            }
            
            return handType;
        };
        
        this.displayHand = function() {
            var int = 0,
                handStr = "";
                
            //console.log("PokerHand cards " + cards.length);
            
            for (i = 0; i < cards.length; i++){            
                if(i === cards.length - 1){
                    handStr += cards[i].getRank() + cards[i].getSuit(); // anal
                }
                else{
                    handStr += cards[i].getRank() + cards[i].getSuit() + " ";    
                }            
            }
            
            return handStr;
        };
        
        // larger hand would break this (INIT???)
        // RESOLVE ???
        // ie if a flush, then find the card that determines the hand's rank
        // var for hand-size, suits[i] === handSize
        this.isFlush = function() {
            var i = 0;
            
            for(i = 0; i < suits.length; i++){            
                if(suits[i] === 5){
                    return true;
                }
            }
            
            return false;
        };
        
        // RESOLVE ???
        // ie if 3/4 of kind, determines the hand's rank and kicker card value
        // iterate from end down, get highest ranked multiple
        //  -- but what if it's a pair, or 7 cards?
        this.isMultipleOfKind = function(kindTotal) {
            var i = 0;
            
            for(i = ranks.length - 1; i > -1; i--){
                if(ranks[i] === kindTotal){
                    determiningRank = i; // kind of flaky
                    return true;
                }
            }
            
            return false;
        };
        
        this.isHighCard = function() {
            // no pairs, three or four of kind, or flush
        };
    },


    // Card Constructor
    Card: function (rankStr, suitStr) {
        var rank = rankStr,
            suit = suitStr;
            
        this.getSuit = function(){
            return suit;
        };
        
        this.getRank = function(){
            return rank;
        };
    },


    // Constructor for object that handles input related tasks
    // (i.e. takes inputs from user, does some massaging and prepping them)
    // Basically, a helper object for PokerGame
    InputHandler: function () {
        var rawInputs = [],
            preppedInputs = [];
        
        this.getRawInputs = function() {
            return rawInputs;
        };
        
        // Takes user inputs, stores each as a string in an array
        this.getUserInputs = function() {
            var input = "",
                inputArr,
                i = 0;

            // Input Massage (multiple lines for easier understanding)
            input = pokerForm.playersAndHands.value.replace(/\r\n/g, "\n"); // normalize linebreaks
            input = input.replace(/,/g, "");                                // remove commas
            input = input.replace(/^\s+|\s+$/g, "");                        // zap trailing whitespace

            //input = input.toUpperCase();                                    // normalize case, upperizes Player Name

            inputArr = input.split("\n");                                   // linebreaks delimit players and their hands

            for(i = 0; i < inputArr.length; i++){                            
                rawInputs.push(inputArr[i]);                
            }

        };
        
        // Debugging helper method
        this.reviewRawInputs = function() {
            var i = 0;
            
            console.log("Total inputs: " + rawInputs.length);
            
            for (i = 0; i < rawInputs.length; i++){        
                console.log(rawInputs[i]);
            }        
        };
        
        // Where Prep is defined as breaking each user input up into
        // arrays of substrings and storing them in an array
        this.prepInputs = function() {
            var i = 0;
            
            for(i = 0; i < rawInputs.length; i++){
                preppedInputs.push(this.massageInput(rawInputs[i]));
            }
        };
        
    },

    playGame: function () {
        
        var gameInputs = new myPoker.InputHandler(),
            pokerGame,
            inputs = [],
            i = 0,
            j = 0,
            players = [],
            player,
            hand = [],
            card,
            playerName = "",
            suit = "",
            rank = "";
            
        
        gameInputs.getUserInputs();
        inputs = gameInputs.getRawInputs();
        
        // 1st pass on input, break into arrays of substrings
        for(i = 0; i < inputs.length; i++){   
            inputs[i] = inputs[i].split(" ");
        }
        
        for(i = 0; i < inputs.length; i++){
            for(j = 0; j < inputs[i].length; j++){
                
                if(j === 0){            
                    playerName = inputs[i][j];            
                }
                else{
                    
                    if(inputs[i][j].length === 3){
                        rank = inputs[i][j].substring(0,2);
                        suit = inputs[i][j].substring(2);
                    }
                    else{
                        rank = inputs[i][j].substring(0,1);
                        suit = inputs[i][j].substring(1);    
                    }
                    
                    hand.push(new myPoker.Card(rank, suit));
                }                
            }
            
            players.push(new myPoker.Player(playerName, new myPoker.PokerHand(hand.slice(0))));
            hand.length = 0; // empty array for next iteration
        }
        
        
        pokerGame = new myPoker.PokerGame(players);
        
        pokerGame.reviewGame();
        pokerGame.findWinner();
    }

};