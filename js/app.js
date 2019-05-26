/*
 * Create a list that holds all of your cards
 */

let cards = [...document.getElementsByClassName('card')];
let deck = document.querySelector('.deck');

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
insertCards();

function insertCards() {
    shuffle(cards);

    let newDeck = document.createDocumentFragment();

    for (card of cards) {
        newCard = document.createElement('li');
        newCard.className = 'card';
        newCard.innerHTML = card.innerHTML;
        newDeck.appendChild(newCard);
    }

    while (deck.firstChild) {
        deck.removeChild(deck.firstChild);
    }

    deck.appendChild(newDeck);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

let openedCards = [];
let matchedCards = 0;
let moveCounter = 0;
let timeCounter = 0;
let timer;
let modal = document.querySelector('.modal');
let scorePanel = document.querySelector('.score-panel');

deck.addEventListener('click', handleClick);

function handleClick(clickedCard) {
    if (clickedCard.target.className !== 'card open' && clickedCard.target.className !== 'card match' && clickedCard.target.className !== 'deck') {
        incrementMoveCounter();
        storeCard(clickedCard);
        turnCard(clickedCard);
        if (openedCards.length == 2) {
            compareCards(openedCards);
        }
    }
}

function incrementMoveCounter() {
    moveCounter += 1;
    document.querySelector('.moves').innerHTML = moveCounter;
    starRating(moveCounter);
}

function starRating(moveCounter) {
    if (moveCounter == 26 || moveCounter == 30 || moveCounter == 34 || moveCounter == 38) {
        let star = document.querySelector('.fa-star');
        star.remove();
    }
}

function storeCard(thisCard) {
    openedCards.push(thisCard.target);
}

function turnCard(thisCard) {
    thisCard.target.classList.add('open');
}

function compareCards(twoCards) {
    let [firstCard, secondCard] = twoCards;
    if (firstCard.innerHTML == secondCard.innerHTML) {
        firstCard.classList.remove('open');
        firstCard.classList.add('match');
        secondCard.classList.remove('open');
        secondCard.classList.add('match');
        openedCards = [];
        checkVictory();
    } else {
        firstCard.classList.add('wrong');
        secondCard.classList.add('wrong');
        setTimeout(function () {
            firstCard.classList.remove('open', 'wrong');
            secondCard.classList.remove('open', 'wrong');
        }, 300);
        openedCards = [];
    }
}

function checkVictory() {
    matchedCards += 2;
    if (matchedCards == 16) {
        setTimeout(function () {
            modal.innerHTML = '<section class="score-panel"> <h1 class="you-won">YOU WON!</h1>' + scorePanel.innerHTML + '</section>';
            modal.classList.add('show');
        }, 300);
        clearInterval(timer);
        document.querySelector('.restart').addEventListener('click', restartGame);
    }
}

deck.addEventListener('click', setTimer);

function setTimer(clickedCard) {
    if (clickedCard.target.className !== 'deck') {
        deck.removeEventListener('click', setTimer);
        timer = setInterval(clock, 1000);
    }
}

function clock() {
    timeCounter += 1;
    document.querySelector('.timer').innerHTML = timeCounter + ' seconds';
}

let restartButton = document.querySelector('.restart');
restartButton.addEventListener('click', restartGame);

function restartGame() {
    insertCards();
    matchedCards = 0;
    openedCards = [];
    moveCounter = 0;
    document.querySelector('.moves').innerHTML = moveCounter;
    timeCounter = 0;
    clearInterval(timer);
    document.querySelector('.timer').innerHTML = timeCounter;
    document.querySelector('.stars').innerHTML = '<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>';
    modal.className = 'modal';
}