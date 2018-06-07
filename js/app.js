// List of all available cards
var cardList = [ 'fa-anchor', 'fa-anchor',
                  'fa-bicycle', 'fa-bicycle',
                  'fa-bolt', 'fa-bolt',
                  'fa-bomb', 'fa-bomb',
                  'fa-car', 'fa-car',
                  'fa-diamond', 'fa-diamond',
                  'fa-leaf', 'fa-leaf',
                  'fa-paper-plane-o', 'fa-paper-plane-o'
                ];

var deck = document.querySelector('.deck');
var moves = 0;
var moveCounter = document.querySelector('.moves');
var matchCount = 0;
var timerText = document.querySelector('.timer');
var time = 0;
var seconds = 0;
var minutes = 0;
var timer;
var timerStarted = false;
var cards = document.querySelectorAll('.card');
var openCards = [];
var star = document.getElementsByClassName('fa-star');
var starCount;
var firstClick = true;
var card;

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
  timerText.innerText = "00:00";

  var cardContent = shuffle(cardList).map(function(card) {
    return createCard(card);
    console.log('createCard done');
  });

  deck.innerHTML = cardContent.join(''); // join each card to the deck
  console.log('deck build done');
}

function startTimer() {
  timer = setInterval(function() {
    seconds++

    if (seconds === 60) {
      seconds = 0;
      minutes++;
    }
    timerText.innerText = 
        (minutes < 10 ? '0' + minutes.toString() : minutes) +
        ':' +
        (seconds < 10 ? '0' + seconds.toString() : seconds);
  }, 1000);
  console.log('startTimer done');
}

function stopTimer() {
  clearInterval(timer);
  console.log('stopTimer done');
}

window.onload = startGame(); // start game on page load
console.log('startGame initiated');

// restart button
newGame.addEventListener('click', function() {
  playAgain();
  console.log('restart initited');
});

function playAgain() {
  stopTimer();
  openCards = [];
  moves = 0; // reset moves count to 0 upon start
  moveCounter.innerText = moves;
  matchCount = 0; // reset match count to 0 upon start
  time = 0;
  timerStarted = false;
  timerText.innerText = time;
  star[2].classList.remove('hide');
  star[1].classList.remove('hide');
  starCount = "three"; // reset starCount to default of three
  startGame();
  console.log('playAgain requested');
}

function clearCards() { // use to reset open cards count
  openCards = [];
  console.log('clearCards done');
}

function moveCount() { // increase move count by 1 and update text for output
  moves += 1;
  moveCounter.innerText = moves;
  console.log('moveCount done');
}

function removeStars() { // remove stars as number of moves increase
  if (moves === 10) {
    star[2].classList.add('hide');
    starCount = "two";
    console.log('star remove done');
  }
  if (moves === 20) {
    star[1].classList.add('hide');
    starCount = "one";
    console.log('2nd star remove done');
  }
}

function compareCards() {
  console.log('compareCards initiated');
  if (openCards.length === 2) {
    //TODO: Disable click???
    if (openCards[0].isEqualNode(openCards[1])) {
      matchCount += 1;
      console.log('correctMatch initiated');
      correctMatch();
    } else {
      console.log('incorrectMatch initiated');
      incorrectMatch();
    }
  }
}

function correctMatch() { // if cards match, add and remove applicable classes
  openCards[0].classList.add('match');
  openCards[0].classList.remove('open');
  openCards[0].classList.remove('show');
  openCards[1].classList.add('match');
  openCards[1].classList.remove('open');
  openCards[1].classList.remove('show');

  if (matchCount === 8) {
    winScreen();
  }

  clearCards();
  moveCount();
  removeStars();
  console.log('correctMatch done');
}

function incorrectMatch() { // if cards don't match, show them, pause, and hide them
  setTimeout(function() {
    openCards.forEach(function(card) {
      card.classList.remove('open', 'show');
    });

    clearCards();
  }, 800);
  moveCount();
  removeStars();
  console.log('incorrectMatch done');
}

function winScreen() { // display modal popup with game stats
  stopTimer();
  setTimeout (function() {
    finalStats.innerText = "You played a " + starCount + " star game by finding all the matches in " + moves + " moves with a time of " + minutes + ":" + seconds + ".";
    playAgainButton.innerText = "Play Again?";
    modal.style.display = "block";
  }, 600);
}

function showCard() {
  card.classList.add('open', 'show');
  openCardList();
  console.log('showCard done');
}

function openCardList() {
  openCards.push(card);

  if (openCards.length === 2) {
    compareCards();
  }
  console.log('openCardList done');
}
  
deck.addEventListener('click', event=> {
  card = event.target;
  if (card.classList.contains('card')) {
    console.log("i'm a card");
    if (timerStarted === false) {
      timerStarted = true;
      console.log('startTimer initiated');
      startTimer();
    }
    if (!card.classList.contains('open') && !card.classList.contains('show') && !card.classList.contains('match')) { 
      showCard();
    }
  }
});

/*cards.forEach(function(card) {
  console.log('foreach initiated');
  card.addEventListener('click', function() {
    console.log('addlisteners initiated');
    // if a card is not already showing or matched, 
    // add to openCards and add classes to show it
    if (!card.classList.contains('open') && !card.classList.contains('show') && !card.classList.contains('match')) { 
      function showCard() {
        card.classList.add('open', 'show');
        openCardList();
        console.log('showCard done');
      }
      function openCardList() {
        if (openCards < 2) {
          openCards.push(card);
        }
        if (openCards.length == 2) {
          compareCards();
        }
        console.log('openCardList done');
      }
    }
  });
});*/

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