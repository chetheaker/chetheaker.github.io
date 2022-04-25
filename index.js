let suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
let values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
let deck = [];
let playerCards = [];
let dealerCards = [];
// inspiration from https://www.programiz.com/javascript/examples/shuffle-card for deck creation

const newGame = () => {
    // new empty deck
    deck = [];
    // reset player and dealer's hands
    playerCards = [];
    dealerCards = [];

    // make button say reset instad of play
    $("#play").html("RESET");

    // reset from previous game
    reset();


    // iterate through each suit adding each value to the deck array previously created
    for (let i = 0; i < suits.length; i++) {
        for (let j = 0; j < values.length; j++) {
            // push new card to the deck
            deck.push({ Suit: suits[i], Value: values[j] });
        }
    }

    // switch 2 random cards in the deck 1000 times
    for (let i = 0; i < 1000; i++) {

        // choose 2 random cards
        let index1 = Math.floor(Math.random() * 52);
        let index2 = Math.floor(Math.random() * 52);

        // switch the cards' positions
        let card2 = deck[index2];
        deck[index2] = deck[index1];
        deck[index1] = card2;
    }

    // deal cards to player and dealer one at a time
    for (let i = 0; i < 2; i++) {
        playerCards.push(deck.shift());
        dealerCards.push(deck.shift());
    }

    // show player's 2 cards and 1 of dealer's cards
    dealCards();

    // render hit and stand buttons
    createButtons();

    //count player and dealer points
    playerPts();
    dealerPts();


    // event listener to hit
    $("#hit").on("click", hit);

    // event listener to stand
    $("#stand").on("click", stand);

}

const dealCards = () => {
    let dealerCard1Suit = dealerCards[0].Suit;
    let dealerCard1Value = dealerCards[0].Value;

    // render cards for dealer
    $("<div>").addClass("card").appendTo("#dealer-cards .card1");
    $("<div>").addClass("card").addClass("hidden").appendTo("#dealer-cards .card2");

    // render suit and value of card1 (card2 is hidden)
    $("<div>").addClass("suit").html(dealerCard1Suit).appendTo("#dealer-cards .card1 .card");
    $("<div>").addClass("value").html(dealerCard1Value).appendTo("#dealer-cards .card1 .card");


    let playerCard1Suit = playerCards[0].Suit;
    let playerCard1Value = playerCards[0].Value;

    let playerCard2Suit = playerCards[1].Suit;
    let playerCard2Value = playerCards[1].Value;


    // render cards for player
    $("<div>").addClass("card").appendTo("#player-cards .card1");
    $("<div>").addClass("card").appendTo("#player-cards .card2");

    // render suit and value of card1 + card2
    $("<div>").addClass("suit").html(playerCard1Suit).appendTo("#player-cards .card1 .card");
    $("<div>").addClass("value").html(playerCard1Value).appendTo("#player-cards .card1 .card");
    $("<div>").addClass("suit").html(playerCard2Suit).appendTo("#player-cards .card2 .card");
    $("<div>").addClass("value").html(playerCard2Value).appendTo("#player-cards .card2 .card");
}

const reset = () => {

    // remove original 4 dealt cards
    $("#dealer-cards .card1 .card").remove();
    $("#dealer-cards .card2 .card").remove();
    $("#player-cards .card1 .card").remove();
    $("#player-cards .card2 .card").remove();

    // remove extra cards for player
    $("#player-cards .extra-cards").empty();

    // remove extra cards for dealer
    $("#dealer-cards .extra-cards").empty();

    // empty .buttons
    $(".buttons").empty();

    // remove totals
    $("#totals").empty();
}

const createButtons = () => {

    // create a stand button
    $("<button>").attr("id", "stand").html("- STAND").appendTo(".buttons");

    // create a hit button
    $("<button>").attr("id", "hit").html("+ HIT").appendTo(".buttons");
}

const playerPts = () => {

    // start pts at 0
    let points = 0;
    let soft = false;
    let aces = 0;

    // iterate through arr and add up all cards
    for (let i = 0; i < playerCards.length; i++) {
        let card = playerCards[i].Value;
        if (card === "J" || card === "Q" || card === "K") {
            points += 10;
        } else if (card === "A") {
            aces++;
            if (points <= 10) {
                points += 11;
                soft = true;
            } else {
                points++;
                if (aces === 1) {
                    soft = false;
                }
            }
        } else {
            points += parseInt(card);
        }
    }

    // if points are over 21 but there is an ace, ace becomes a low card (value of 1) and 10 is substracted from the points
    if (points > 21 && soft) {
        points -= 10;
        soft = false;
    }

    // if there is no ace and points are over 21, player loses
    if (points > 21 && !soft) {
        showResult("you bust");

        // show player's final total
        $("<div>").addClass("player-total").html(points).appendTo("#totals");
    }


    return points;
}

const dealerPts = () => {
    // start pts at 0
    let points = 0;
    let soft = false;
    let aces = 0;

    // iterate through arr and add up all cards
    for (let i = 0; i < dealerCards.length; i++) {
        let card = dealerCards[i].Value;
        if (card === "J" || card === "Q" || card === "K") {
            points += 10;
        } else if (card === "A") {
            aces++;
            if (points <= 10) {
                points += 11;
                soft = true;
            } else {
                points++;
                if (aces === 1) {
                    soft = false;
                }
            }
        } else {
            points += parseInt(card);
        }
    }

    // if points are over 21 but there is an ace, ace becomes a low card (value of 1) and 10 is substracted from the points
    if (points > 21 && soft) {
        points -= 10;
        soft = false;
    }

    // if there is no ace and points are over 21, dealer is bust
    if (points > 21 && !soft) {
        showResult("you win");
    }

    return points;
}

const hit = () => {

    // take one card from deck array
    let card = deck.shift();

    // add the card to playerCards array
    playerCards.push(card);

    // render new card on screen
    renderHit(card);

    // count and check player points 
    playerPts();
}

const renderHit = (card) => {
    // render card for player
    $("<div>").addClass("card").addClass("card" + playerCards.length).appendTo("#player-cards .extra-cards");

    // find suit and value for new card
    let cardValue = card.Value;
    let cardSuit = card.Suit;

    // render suit and value onto card
    $("<div>").addClass("suit").html(cardSuit).appendTo("#player-cards .extra-cards .card" + playerCards.length);
    $("<div>").addClass("value").html(cardValue).appendTo("#player-cards .extra-cards .card" + playerCards.length);
}

const stand = () => {
    // save final player score in variable
    let playerScore = playerPts();

    // get dealer's score
    let dealerScore = dealerPts();


    // show player's final total
    $("<div>").addClass("player-total").html(playerScore).appendTo("#totals");

    // reveal dealer's 2nd card
    $("#dealer-cards .card2 .card").removeClass("hidden");

    // get dealer's 2nd card suit and value
    let dealerCard2Suit = dealerCards[1].Suit;
    let dealerCard2Value = dealerCards[1].Value;

    // render dealer's 2nd card suit and value
    $("<div>").addClass("suit").html(dealerCard2Suit).appendTo("#dealer-cards .card2 .card");
    $("<div>").addClass("value").html(dealerCard2Value).appendTo("#dealer-cards .card2 .card");

    // if dealer's score is less than 17, dealer will hit
    while (dealerScore < 17) {
        dealerHit();
        dealerScore = dealerPts();
    }

    // show dealer's total
    $("<div>").addClass("dealer-total").html(dealerScore).prependTo("#totals");

    if (dealerScore <= 21) {
        // if dealer doesn't bust compare player and dealer scores
        if (playerScore > dealerScore) {
            showResult("you win")
        } else if (dealerScore > playerScore) {
            showResult("dealer wins");
        } else {
            showResult("push");
        }
    }
}

const dealerHit = () => {

    // take one card from the deck
    let card = deck.shift();

    // add card to dealer's array
    dealerCards.push(card);

    // render new card on screen
    renderDealerHit(card);
}

const renderDealerHit = (card) => {
    // render card for dealer
    $("<div>").addClass("card").addClass("card" + dealerCards.length).appendTo("#dealer-cards .extra-cards");

    // find suit and value for new card
    let cardValue = card.Value;
    let cardSuit = card.Suit;

    // render suit and value onto card
    $("<div>").addClass("suit").html(cardSuit).appendTo("#dealer-cards .extra-cards .card" + dealerCards.length);
    $("<div>").addClass("value").html(cardValue).appendTo("#dealer-cards .extra-cards .card" + dealerCards.length);
}

const showResult = (result) => {
    // remove hit/stand buttons
    $(".buttons").empty();

    // add text to the .buttons to show result
    $("<div>").addClass("result").html(result).appendTo(".buttons");

    // if result is blackjack or player bust, reveal dealer's 2nd card
    if (result === "you bust") {

        dealerScore = dealerPts();
        // show dealer's total
        $("<div>").addClass("dealer-total").html(dealerScore).prependTo("#totals");

        // reveal dealer's 2nd card
        $("#dealer-cards .card2 .card").removeClass("hidden");

        // get dealer's 2nd card suit and value
        let dealerCard2Suit = dealerCards[1].Suit;
        let dealerCard2Value = dealerCards[1].Value;

        // render dealer's 2nd card suit and value
        $("<div>").addClass("suit").html(dealerCard2Suit).appendTo("#dealer-cards .card2 .card");
        $("<div>").addClass("value").html(dealerCard2Value).appendTo("#dealer-cards .card2 .card");
    }
}



// event listener to start new game
$("#play").on("click", newGame);