/*
 * Create a list that holds all of the cards
 */

let cards = [...document.getElementsByClassName('card')];
let deck = document.querySelector('.deck');

/*
 * Display the cards on the page using shuffle
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

let openedCards = [];
let matchedCards = 0;
let moveCounter = 0;
let timeCounter = 0;
let timer;
let modal = document.querySelector('.modal');
let scorePanel = document.querySelector('.score-panel');
let restartButton = document.querySelector('.restart');
let moves = document.querySelector('.moves');
let seconds = document.querySelector('.timer');
let stars = document.querySelector('.stars');

deck.addEventListener('click', handleClick);

/*
 * Open card when it's clicked
 */
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

function turnCard(thisCard) {
    thisCard.target.classList.add('open');
}

function storeCard(thisCard) {
    openedCards.push(thisCard.target);
}

/*
 * Count moves and change star rate according to the number of moves
 */
function incrementMoveCounter() {
    moveCounter += 1;
    moves.innerHTML = moveCounter;
    starRating(moveCounter);
}

function starRating(moveCounter) {
    if (moveCounter == 26 || moveCounter == 30 || moveCounter == 34 || moveCounter == 38) {
        let star = document.querySelector('.fa-star');
        star.remove();
    }
}

/*
 * Compare the two opened cards to see if they match
 */
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

/*
 * Open modal if user matched all the cards
 */
function checkVictory() {
    matchedCards += 2;
    if (matchedCards == 16) {
        setTimeout(function () {
            modal.innerHTML = '<section class="score-panel"> <h1 class="you-won">YOU WON!</h1>' + scorePanel.innerHTML + '</section>';
            modal.classList.add('show');
            document.querySelector('.restart').addEventListener('click', restartGame);
        }, 300);
        clearInterval(timer);
    }
}

/*
 * Start timer when the first card is clicked
 */
deck.addEventListener('click', setTimer);

function setTimer(clickedCard) {
    if (clickedCard.target.className !== 'deck') {
        deck.removeEventListener('click', setTimer);
        timer = setInterval(clock, 1000);
    }
}

function clock() {
    timeCounter += 1;
    seconds.innerHTML = timeCounter + ' seconds';
}

/*
 * Set button to restart the game and all the scores
 */
restartButton.addEventListener('click', restartGame);


function restartGame() {
    insertCards();
    matchedCards = 0;
    openedCards = [];
    moveCounter = 0;
    moves.innerHTML = moveCounter;
    timeCounter = 0;
    clearInterval(timer);
    seconds.innerHTML = timeCounter+' seconds';
    stars.innerHTML = '<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>';
    deck.addEventListener('click', setTimer);
    modal.className = 'modal';
    restartButton.addEventListener('click', restartGame);
}