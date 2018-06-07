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
  var deck = document.querySelector('.deck');
  var cardContent = shuffle(cardList).map(function(card) {
    return createCard(card);
  });

  deck.innerHTML = cardContent.join(''); // join each card to the deck

  moves = 0; // reset moves count to 0 upon start
  moveCounter.innerText = moves;
  matchCount = 0; // reset match count to 0 upon start
  resetStars();
}

// set move and match variables
let moves = 0;
let moveCounter = document.querySelector('.moves');
let matchCount = 0;

startGame(); // start game on page load

// restart button
const newGame = document.querySelector('.restart');
newGame.addEventListener('click', function() {
  startGame();
});

// set card variables
var cards = document.querySelectorAll('.card');
var openCards = [];

function clearCards() { // use to reset open cards count
  openCards = [];
}

function moveCount() { // increase move count by 1 and update text for output
  moves += 1;
  moveCounter.innerText = moves;
}

function resetStars() {
  var star = document.getElementsByClassName('fa-star');
  star[2].classList.remove('hide');
  star[1].classList.remove('hide');
  starCount = "three"; // reset starCount to default of three
}

function removeStars() { // remove stars as moves progress
  // TODO: determine and update number of moves before docking stars
  if (moves === 1) {
    var star = document.getElementsByClassName('fa-star');
    star[2].classList.add('hide');
    starCount = "two";
    console.log(starCount);
  }
  if (moves === 3) {
    var star = document.getElementsByClassName('fa-star');
    star[1].classList.add('hide');
    starCount = "one";
    console.log(starCount);
    console.log('remove another star');
  }
}

function correctMatch() { // if cards match, add and remove applicable classes
  openCards[0].classList.add('match');
  openCards[0].classList.remove('open');
  openCards[0].classList.remove('show');
  openCards[1].classList.add('match');
  openCards[1].classList.remove('open');
  openCards[1].classList.remove('show');
}

function incorrectMatch() { // if cards don't match, show them, pause, and hide them
  setTimeout(function() {
    openCards.forEach(function(card) {
      card.classList.remove('open', 'show');
    });

    clearCards();
  }, 800);
}

function winScreen() { // display modal popup with game stats
  setTimeout (function() {
    modalText.innerText = "You played a " + starCount + " star game by winning in " + moves + " moves.";
    modal.style.display = "block";
  }, 600);
}

cards.forEach(function(card) {
  card.addEventListener('click', function(c) {
    // if a card is not already showing or matched, 
    // add to openCards and add classes to show it
    if (!card.classList.contains('open') && !card.classList.contains('show') && !card.classList.contains('match')) { 
      openCards.push(card);
      card.classList.add('open', 'show');

      if (openCards.length == 2) {

        if (openCards[0].isEqualNode(openCards[1])) {
          correctMatch();
          matchCount += 1;
          clearCards();
        } else {
          incorrectMatch();
        }

        moveCount();
        // TODO: determine and update number of moves before docking stars
        if (moves === 1 || 3) {
          removeStars();
        }
      }
      if (matchCount === 8) {
        winScreen();
      }
    }
  });
});

// Get the modal and elements within
const modal = document.getElementById('winModal');
const modalText = document.getElementById('modalText');
const span = document.getElementsByClassName("close")[0];

// A user clicking either the X within the modal, 
// or anywhere outside the modal will close it
span.onclick = function() {
    modal.style.display = "none";
}
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}