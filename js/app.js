// List of all available cards
let cardList = [ 'fa-anchor', 'fa-anchor',
                  'fa-bicycle', 'fa-bicycle',
                  'fa-bolt', 'fa-bolt',
                  'fa-bomb', 'fa-bomb',
                  'fa-car', 'fa-car',
                  'fa-diamond', 'fa-diamond',
                  'fa-leaf', 'fa-leaf',
                  'fa-paper-plane-o', 'fa-paper-plane-o'
                ];

let deck = document.querySelector('.deck');
let moves = 0;
let moveCounter = document.querySelector('.moves');
let matchCount = 0;
let seconds = 0;
let minutes = 0;
let timer;
let timerText = document.querySelector('.timer');
let timerStarted = false;
let card;
let cards = document.querySelectorAll('.card');
let openCards = [];
let star = document.getElementsByClassName('fa-star');
let starCount;

const shuffledCards = shuffle(cardList);
const newGame = document.querySelector('.restart');

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

function createCard(card) { // html to build each card dynamically
  return `<li class="card"><i class="fa ${card}"></i></li>`;
}

function startGame() { // start game with new deck and reset counters
  timerText.innerText = "00:00"; // set default text of timer to all zeros

  let cardContent = shuffle(cardList).map(function(card) {
    return createCard(card);
  });

  deck.innerHTML = cardContent.join(''); // join each card to the deck
}

function startTimer() {
  timer = setInterval(function() {
    seconds++

    if (seconds === 60) {
      seconds = 0;
      minutes++;
    }

    min = (minutes < 10 ? '0' + minutes.toString() : minutes);
    sec = (seconds < 10 ? '0' + seconds.toString() : seconds);

    timerText.innerText = min + ':' + sec;
  }, 1000);
}

function stopTimer() {
  seconds = 0;
  minutes = 0;
  clearInterval(timer);
}

window.onload = startGame(); // start game on page load

// restart button
newGame.addEventListener('click', function() {
  playAgain();
});

function playAgain() {
  stopTimer();
  openCards = [];
  moves = 0; // reset moves count to 0 upon start
  moveCounter.innerText = moves;
  matchCount = 0; // reset match count to 0 upon start
  timerStarted = false;
  star[2].classList.remove('hide');
  star[1].classList.remove('hide');
  starCount = "three"; // reset starCount to default of three
  startGame();
}

function clearCards() { // use to reset open cards count
  openCards = [];
}

function moveCount() { // increase move count by 1 and update text for output
  moves += 1;
  moveCounter.innerText = moves;
}

function removeStars() { // remove stars as number of moves increase
  if (moves === 10) {
    star[2].classList.add('hide');
    starCount = "two";
  }
  if (moves === 20) {
    star[1].classList.add('hide');
    starCount = "one";
  }
}

function compareCards() {
  if (openCards.length === 2) {
    document.body.style.pointerEvents = "none"; // disable mouse clicks until check is complete

    if (openCards[0].isEqualNode(openCards[1])) {
      matchCount += 1;
      correctMatch();
    } else {
      incorrectMatch();
    }
  }
}

function correctMatch() { // if cards match, add and remove applicable classes
  openCards[0].classList.add('match', 'animated', 'rubberBand');
  openCards[0].classList.remove('open', 'show');
  openCards[1].classList.add('match', 'animated', 'rubberBand');
  openCards[1].classList.remove('open', 'show');
  
  document.body.style.pointerEvents = "auto"; // reenable mouse clicks to continue play

  if (matchCount === 8) {
    winScreen();
  }

  clearCards();
  moveCount();
  removeStars();
}

function incorrectMatch() { // if cards don't match, show them, pause, and hide them
  openCards.forEach(function(card) {
    card.classList.add('animated', 'jello');
  });

  setTimeout(function() {
    openCards.forEach(function(card) {
      card.classList.remove('open', 'show', 'animated', 'jello');
    });

    document.body.style.pointerEvents = "auto"; // reenable mouse clicks to continue play

    clearCards();
  }, 900);
  moveCount();
  removeStars();
}

function winScreen() { // display modal popup with game stats
  let star = "<i class='fa fa-star'></i>";
  stopTimer();
  setTimeout (function() {
    if (starCount === 'one') {
      starRating.innerHTML = "Star Rating: " + star;
    }
    if (starCount === 'two') {
      starRating.innerHTML = "Star Rating: " + star + star;
    }
    if (starCount === 'three') {
      starRating.innerHTML = "Star Rating: " + star + star + star;
    }
    finalStats.innerHTML = "You played a " + starCount + " star game by finding all the matches in " + moves + " moves with a time of " + min + ":" + sec + ".";
    playAgainButton.innerText = "Play Again?";
    modal.style.display = "block";
  }, 600);
}

function showCard() {
  card.classList.add('open', 'show');
  openCardList();
}

function openCardList() {
  openCards.push(card);

  if (openCards.length === 2) {
    compareCards();
  }
}
  
deck.addEventListener('click', event=> {
  card = event.target;
  if (card.classList.contains('card')) {
    if (timerStarted === false) {
      timerStarted = true;
      startTimer();
    }
    if (!card.classList.contains('open') && !card.classList.contains('show') && !card.classList.contains('match')) { 
      showCard();
    }
  }
});

// Get the modal and elements within
const modal = document.getElementById('winModal');
const finalStats = document.getElementById('finalStats');
const playAgainButton = document.getElementById('playAgainButton');
const span = document.getElementsByClassName("close")[0];

// A user clicking either the X within the modal, 
// or anywhere outside the modal will close it
span.onclick = function() {
    modal.style.display = "none";
}
playAgainButton.onclick = function() {
  modal.style.display = "none";
  playAgain();
}
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}