// ------ ------- MAIN GAME CONTROL ------- -------

const gameBoard = (() => {
  var botMoving = false;
  var bot_play = false;
  var p1_turn = true;
  var noWinner = true;
  var tie = 0;
  var board = ['', '', '', '', '', '', '', '', ''];
  var getBoard = () => board;
  
  function updateBoardArray(marker, square) {
    board[square] = marker;
  }

  function updateBoardDisplay(space, player) {
    space.target.innerHTML = player.getMarker();
  }

  function botMove() {
    var trying = true;
    while (trying) {
      var random = Math.floor(Math.random() * 8);
      if (board[random] === '') {

        board[random] = 'O';
        setTimeout(() => {
          document.querySelector(`[data-value="${random}"`).innerHTML = 'O';
          botMoving = false; // add this in here so player cant move before bot
        }, 400);
        trying = false;
      }
    }
  }

  // Populates the gameboard with array values
  function populate() {
    for (let i = 0; i < getBoard().length; i++) {
      var square = document.querySelector(`.num${i}`);
      square.innerHTML = getBoard()[i];
    }
  }

  // Starts listener on each square for clicks
  function listen() {
    const game = document.querySelectorAll('.square');

    game.forEach((square) => {
      square.addEventListener('click', takeTurn);
    });
  }

  function stopAndListen(){
    var boardDone = document.querySelector('.board');
    boardDone.addEventListener('click', () => {
      restart();
    }, {once : true});
  }

  function restart() {
    for (let i = 0; i < board.length; i++) {
      updateBoardArray('', i);
    }
    populate();
    noWinner = true;
    p1_turn = true;
    turns = 0;
  } 

  function rowOf3(a, b, c) {
    if (a === b && b === c && a != '') {
      return true;
    }
  }

  function declareTie() {
    tie++;
    document.querySelector('.tie.points').innerHTML = tie.toString();
    
    // turn this on to skip bot move
    noWinner = false;
  };

  function declareWin(player) {
    noWinner = false;
    player.gainPoint();
    document.querySelector(`.${player.getName()}.points`).innerHTML = player.getPoints();
  };

  function nextTurn() {
    p1_turn = !p1_turn;
  }

  function checkWinner(player) {

    var winner = null;


    // horizontal
    for (let i = 0; i < 7; i += 3) {
      if (rowOf3(board[(i + 0)], board[(i + 1)], board[(i + 2)])) {
        winner = player;
      }
    }

    // vertical
    for (let i = 0; i < 3; i++) {
      if (rowOf3(board[(i + 0)], board[(i + 3)], board[(i + 6)])) {
        winner = player;
      }
    }

    // diagonal
    if (rowOf3(board[0], board[4], board[8])) {
      winner = player;
    }

    if (rowOf3(board[2], board[4], board[6])) {
      winner = player;
    }

    // no more spaces left to be played
    let freeSpace = 0;
    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        freeSpace++;
      }
    }

    // if someone has won, run win functions
    if (winner !== null) {
      return 'winner';
    }

    if (winner === null && freeSpace === 0) {
      return 'tie';
    }
  }
  
  // function fired off on click
  function takeTurn(e) {
    // if there is nothing in space being click
    if (e.target.innerHTML === '') {
      // If no current winner declared (if winner declared, stop allowing moves)
      if ((!botMoving) && noWinner) {

        // ------ PLAYER 1'S TURN ------
        if (p1_turn) {

          updateBoardDisplay(e, p1);
          updateBoardArray(p1.getMarker(), e.target.dataset.value);

          // if checkWinner returns true
          if (checkWinner(p1) === 'winner') {
            declareWin(p1);
            // stop trigger from first click from finishing fire
            e.stopImmediatePropagation();
            stopAndListen();
          };

          if (checkWinner(p1) === 'tie') {
            declareTie();
            e.stopImmediatePropagation();
            stopAndListen();
          }

          nextTurn();

          // ------ BOT MOVE ---------
          if (bot_play === true && (noWinner)) {
            botMoving = true;
            botMove();

            if (checkWinner(p2) === 'winner') {
              declareWin(p2);
              e.stopImmediatePropagation();
              stopAndListen();
            };

            if (checkWinner(p2) === 'tie') {
              declareTie();
              e.stopImmediatePropagation();
              stopAndListen();
            }

            nextTurn();
          }


          // ----- PLAYER 2'S TURN -----
        } else if (p1_turn === false && bot_play === false) {
          updateBoardDisplay(e, p2);
          updateBoardArray(p2.getMarker(), e.target.dataset.value);

          if (checkWinner(p2) === 'winner') {
            declareWin(p2);
            e.stopImmediatePropagation();
            stopAndListen();
          };

          if (checkWinner(p2) === 'tie') {
            declareTie();
            e.stopImmediatePropagation();
            stopAndListen();
          }
          nextTurn();
        }

      }
    }
  }

  return { populate, listen }
})();

const Player = (name, marker) => {
  let points = 0;
  const getName = () => name;
  const getMarker = () => marker; // update to only allow specific character
  const getPoints = () => points;
  const gainPoint = () => {
    points ++;
  }

  return { getPoints, gainPoint, getName, getMarker }
}














// ------- ------- RUN INITIAL FUNCTIONS AND METHODS ------- -------

gameBoard.populate();
gameBoard.listen();

const p1 = Player('p1', 'X');

const p2 = Player('p2', 'O');



