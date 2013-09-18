// Current ISSUES and/or BUGS
//
// 1. empty strings getting sent to storeSuits and storeRanks
//      - empty space after input in text-field
//      - moving closing textarea tag to immediately follow last char of inputs fixes
//      - need more programmatic fix, why isn't TRIM working?
// 2. Poor input handling
// 3. No provision for duplicate cards in inputs
//      "But the dealer just stares there's something wrong here he thinks. The gambler is seized and thrown to his knees and shot dead."
// 4. Private Vars and Methods virtually empty
// 5. Failing to cache Array-Name.length for for loops

/*
Test Data using real cards
player-1 as ah 7c 7d qs
player-2 kh ks 6d 6c 6h
player-3 ac kc 5c 7s qh
*/

/*jslint devel: true */

var pokerTron = (function () {

    // ----- Private Vars -----

    // Constants for various poker hand categories
    var FLUSH = "flush",
        FOUR  = "four of a kind",
        THREE = "three of a kind",
        PAIR  = "pair",
        HIGHEST = "highest card",
        handCategoriesARR = [FLUSH, FOUR, THREE, PAIR, HIGHEST];


    // ----- Private Functions -----
    // Sound of crickets chirping...
    // settings and an init function???



    // ----- Public Interface -----
    return {

        // Public vars
        myPublicVar: "winnerCircle",

        // Public Functions (users of private functions)
        // Expects input of player objects stored in an array
        PokerGame: function  (playerObjArr) {
            var players = playerObjArr,
                contendersArr = [];

            // Unobtrusively(?) log some data to the console
            this.reviewGame = function() {

                var i = 0,
                    iMax = players.length; // ok, sometimes I can't resist a pun

                console.log("Total players: " + iMax);

                for (i = 0; i < iMax; i++) {
                    console.log(players[i].getPlayerName());
                    console.log(players[i].seeHand());
                    console.log(players[i].getHandType());
                    console.log("\n");
                }
            };

            this.findWinner = function() {
                // 
                // Heuristic: sanity check for one player?
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

                for (i = 0; i < totalCategories; i++) {

                    if (this.evaluateHandCategory(handCategoriesARR[i])) {
                        this.showResult();
                        break;
                    }

                }

            };

            // Analyse a given Hand Category (ie Flush, Four/Three of a Kind, Pair, High Card) by
            // finding number of players holding it
            // IF current category has only one player holding it, THEN Winner found, return TRUE
            // IF current category held by multiple players, THEN Tie, return TRUE
            // ELSE return FALSE
            this.evaluateHandCategory = function(handCategoryStr) {

                var totalPlayers = players.length,
                    contendersCount = 0,
                    i = 0;

                for (i = 0; i < totalPlayers; i++) {

                    if (this.hasHand(players[i].getHandType(), handCategoryStr)) {
                        contendersArr[contendersCount] = players[i];
                        contendersCount++;
                    }
                }

                if (contendersCount > 0) {
                    return true;
                }

                // else no player holding current hand category, contendersArr empty
                // heuristic: more efficient to assume no player has hand? ie first IF checks for empty array?
                return false;
            };

            this.hasHand = function(playerHand, handCategoryStr) {

                //alert("hasHand: " + playerHand + ", " + handCategoryStr)

                if (playerHand === handCategoryStr) {
                    return true;
                }

                return false;
            };

            /* STUB
            this.evaluateTie = function(playerHand, handCategoryStr) {

                //alert("evaluateTie")

                // only tie if Players have same cards with different suits?
            }; */

            this.showResult = function() {

                var winnerCount = contendersArr.length,
                    winnerStr = "",
                    i = 0,
                    pageElement = document.getElementById("winnerBox");

                for (i = 0; i < winnerCount; i++) {

                    if (i > 0) {
                        winnerStr += " and ";
                    }

                    winnerStr += contendersArr[i].getPlayerName();
                }

                pageElement.innerHTML = "It's: " + winnerStr;
                pageElement.className = "alert alert-info";
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
                determiningRank = 0; // the ranking card of the hand
                // kickerCard = 0; // highest card not part of the hand

            this.analyseHand = function() {
                var i = 0;

                for (i = 0; i < cards.length; i++) {
                    this.storeRanks(cards[i].getRank());
                    this.storeSuits(cards[i].getSuit());
                }
            };

            this.storeRanks = function(rank) {

                switch (rank) {
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

                switch (suit) {
                case "C":
                    suits[0]++; // INVESTIGATIVE NOTE: why does ++ work here?
                    break;
                case "D":
                    suits[1]++;
                    break;
                case "H":
                    suits[2]++;
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

                switch (handCategoryStr) {
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

                if (handType === "") {
                    this.analyseHand();

                    if (this.isFlush()) {
                        handType = "flush";
                    } else if (this.isMultipleOfKind(4)) {
                        handType = "four of a kind";
                    } else if (this.isMultipleOfKind(3)) {
                        handType = "three of a kind";
                    } else if (this.isMultipleOfKind(2)) {
                        handType = "two of a kind";
                    } else {
                        handType = "highest card";
                    }
                }

                return handType;
            };

            this.displayHand = function() {
                var i = 0,
                    handStr = "";

                //console.log("PokerHand cards " + cards.length);

                for (i = 0; i < cards.length; i++) {
                    if (i === cards.length - 1) {
                        handStr += cards[i].getRank() + cards[i].getSuit(); // anal
                    } else {
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

                for (i = 0; i < suits.length; i++) {
                    if (suits[i] === 5) {
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

                for (i = ranks.length - 1; i > -1; i--) {
                    if (ranks[i] === kindTotal) {
                        determiningRank = i; // kind of flaky, but works cuz ranks received in descending order
                        return true;
                    }
                }

                return false;
            };

            /* STUB: but no real need anyway?
            this.isHighCard = function() {
                // no pairs, three or four of kind, or flush
            }; */
        },


        // Card Constructor
        Card: function (rankStr, suitStr) {
            var rank = rankStr,
                suit = suitStr;

            this.getSuit = function() {
                return suit;
            };

            this.getRank = function() {
                return rank;
            };
        },


        // Constructor for Input Manager
        // 1 - Gets raw input from textarea 
        // 2 - Minimally preps/messages raw input
        //     - converts input to array where each element is a string
        //       - String format: player-name card-1 card-2 ... card-5
        // 3 - Converts prepped input into Players and their Hands
        //     - Each Player is object, as is player's hand, while hand consists of Card objects
        // 4 - returns array of Players
        // Note: should be singleton?
        InputMgr: function () {
            var inputArr = [],
                input = null,
                players = [];


            // Takes user inputs, returns Players with Hands of Cards (all of which are Objects)
            this.getInput = function() {

                // Seems roundabout, but JSLint wants this?!?!?
                var formElement = document.getElementById("pokerForm");

                input = formElement.playersAndHands.value;        // grab input from textarea
                this.prepInput();
                this.createPlayersWithHands();
                return players;
            };

            this.prepInput = function() {
                var i = 0,
                    blankIndex = 0;

                // Prep Input (multiple lines for easier understanding)                
                input = input.replace(/\r\n/g, "\n");           // normalize linebreaks
                input = input.replace(/,/g, "");                // remove commas
                input = input.replace(/^\s+|\s+$/g, "");        // zap trailing whitespace

                inputArr = input.split("\n");                   // linebreaks delimit players and their hands

                // 1 more Input Prep (each player's "Card" inputs in uppercase)
                for (i = 0; i < inputArr.length; i++) {

                    blankIndex = inputArr[i].indexOf(" ", 0);
                    inputArr[i] = inputArr[i].substring(0, blankIndex) + inputArr[i].substring(blankIndex).toUpperCase();
                }
            };

            // Converts prepared input (see prepInput) into an array of Player objects
            // - Each Player holds a Hand object, each of which consists of 5 Card objects
            this.createPlayersWithHands = function() {

                // Move some of these into the Module's Private Area!!!!
                var input = [],
                    i = 0,
                    j = 0,
                    hand = [],
                    playerName = "",
                    suit = "",
                    rank = "";

                input = inputArr; // just directly use inputArr?

                // 1st pass on input, break into arrays of substrings
                for (i = 0; i < input.length; i++) {
                    input[i] = input[i].split(" ");
                }

                // Set up each player and associated hand
                for (i = 0; i < input.length; i++) {
                    for (j = 0; j < input[i].length; j++) {

                        if (j === 0) {
                            playerName = input[i][j];
                        } else { // figure out rank and suit of a card

                            if (input[i][j].length === 3) {
                                rank = input[i][j].substring(0, 2);
                                suit = input[i][j].substring(2);
                            } else {
                                rank = input[i][j].substring(0, 1);
                                suit = input[i][j].substring(1);
                            }

                            hand.push(new pokerTron.Card(rank, suit)); // questionable?
                        }
                    }

                    players.push(new pokerTron.Player(playerName, new pokerTron.PokerHand(hand.slice(0)))); // questionable?
                    hand.length = 0; // empty array for next iteration
                }

            };
        },

        playGame: function () {

            var gameInputs,
                pokerGame;

            gameInputs = new pokerTron.InputMgr();
            pokerGame = new pokerTron.PokerGame(gameInputs.getInput());

            pokerGame.reviewGame();
            pokerGame.findWinner();
        }
    };

}()); // JSLINT note: })() -> }())