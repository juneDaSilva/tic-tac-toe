// ------ ------- MAIN GAME CONTROL ------- -------

const gameBoard = (() => {
  var gameTied = false;
  var bot_play = true;
  var tie = 0;
  var p1_turn = true;
  var turns = 0;
  var noWinner = true;
  var board = ['', '', '', '', '', '', '', '', ''];
  var getBoard = () => board;
  
  var move = (marker, square) => {
    board[square] = marker;
  }

  var botMove = function () {
    var trying = true;
    while (trying) {
      var random = Math.floor(Math.random() * 8);
      if (board[random] === '') {
        board[random] = 'O';
        setTimeout(() => {
          document.querySelector(`[data-value="${random}"`).innerHTML = 'O';
        }, 400);
        console.log(board)
        trying = false;
      }
    }
  }

  // Populates the gameboard with array values
  var populate = function () {
    for (let i = 0; i < getBoard().length; i++) {
      var square = document.querySelector(`.num${i}`);
      square.innerHTML = getBoard()[i];
    }
  }

  // Starts listener on each square for clicks
  var listen = function () {
    const game = document.querySelectorAll('.square');

    game.forEach((square) => {
      square.addEventListener('click', takeTurn)
    })
  };

  // function fired off on click
  var takeTurn = function (e) {
    // if there is nothing in space being click
    if (e.target.innerHTML === '') {
    // If no current winner declared (if winner declared, stop allowing moves)
      if (noWinner) {
        
        // ------ PLAYER 1'S TURN ------
        if (p1_turn) {
          
          // populate square clicked with players marker
          e.target.innerHTML = p1.getMarker();
          // reflect change in board array
          move(p1.getMarker(), e.target.dataset.value)
           
          // if checkWinner returns true
          if (checkWinner(p1)) { 
            // stop trigger from first click from finishing fire
            e.stopImmediatePropagation();

            // fire these things on click
            var boardDone = document.querySelector('.board');
            boardDone.addEventListener('click', () => {
              restart();
            }, {once : true}); // make event listener only listen once
          
          };
          
          // ----- TIE GAME -----
          // if no more turns available
          if (!nextTurn() && (noWinner)){
            tie++;
            document.querySelector('.tie.points').innerHTML = tie.toString();
            e.stopImmediatePropagation();
            var boardDone = document.querySelector('.board');
            boardDone.addEventListener('click', () => {
              restart();
            }, {once : true});
            gameTied = true;
          };
           
          if (bot_play === true && (noWinner) && (!gameTied)) {

            botMove();
            
            if (checkWinner(p2)) { 
              // stop trigger from first click from finishing fire
              e.stopImmediatePropagation();
  
              // fire these things on click
              var boardDone = document.querySelector('.board');
              boardDone.addEventListener('click', () => {
                restart();
              }, {once : true}); // make event listener only listen once
            
            };    
          }
        nextTurn();
        gameTied = false;
        // ----- PLAYER 2'S TURN -----
        } else if (p1_turn === false && bot_play === false) {
          e.target.innerHTML = p2.getMarker();
          move(p2.getMarker(), e.target.dataset.value)

          if (checkWinner(p2)) {
            e.stopImmediatePropagation();
            
            var boardDone = document.querySelector('.board');
            boardDone.addEventListener('click', () => {
              restart();
            }, {once : true});
          };
          nextTurn();
        } 

      } 
    } 
  };

  var announceWinner = (currPlayer) => {
    console.log(`${currPlayer.getName()}: +1!`)
  }

  var restart = () => {
    for (let i = 0; i < board.length; i++) {
      move('', i)
    }
    populate();
    noWinner = true;
    p1_turn = true;
    turns = 0;
  }
  

  var checkWinner = (player) => {
    var marker = player.getMarker();

    if (  board[0] === marker &&
          board[1] === marker &&
          board[2] === marker 
          ||
          board[3] === marker &&
          board[4] === marker &&
          board[5] === marker
          ||
          board[6] === marker &&
          board[7] === marker &&
          board[8] === marker
          ||
          board[0] === marker &&
          board[3] === marker &&
          board[6] === marker 
          ||
          board[1] === marker &&
          board[4] === marker &&
          board[7] === marker
          ||
          board[2] === marker &&
          board[5] === marker &&
          board[8] === marker
          ||
          board[0] === marker &&
          board[4] === marker &&
          board[8] === marker
          ||
          board[2] === marker &&
          board[4] === marker &&
          board[6] === marker) {
            
            noWinner = false;
            announceWinner(player);
            player.gainPoint();
            document.querySelector(`.${player.getName()}.points`).innerHTML = player.getPoints();
            return true;
          }
  }

  var nextTurn = () => {
    turns++;
    if (turns < 9) {
      p1_turn = !p1_turn; 
    } else {
      return false
    }
    return true;
  }

  return { populate, listen }
})();

const Player = (name, marker) => {
  let points = 0;
  const getName = () => name;
  const getMarker = () => marker; // update to only allow specific character
  const getPoints = () => points;
  const lose = () => {
    console.log('Wasted');
  }

  const gainPoint = () => {
    points ++;
    if (points >= 5) {
      console.log(`${name} wins!`)
    }
  }

  return { getPoints, gainPoint, getName, getMarker }
}














// ------- ------- RUN INITIAL FUNCTIONS AND METHODS ------- -------

gameBoard.populate();
gameBoard.listen();

const p1 = Player('p1', 'X');

const p2 = Player('p2', 'O');



