import * as React from "react";
import "./App.css";

enum Player {
  None = null,
  One = 1,
  Two = 2
}

enum GameState {
  Ongoing = -1,
  Draw = 0,
  PlayerOneWin = Player.One,
  PlayerTwoWin = Player.Two
}
type Board = Player[];

interface State {
  board: Board;
  playerTurn: Player;
  gameState: GameState | Player
}

const intitializeBoard = () => {
  const board = [];
  for (let i = 0; i < 42; i++) {
    board.push(Player.None);
  }
  return board;
};

const getPrettyPlayer = (player: Player) => {
  if (player === Player.None) return "noPlayer";
  if (player === Player.One) return "playerOne";
  if (player === Player.Two) return "playerTwo";
};

const findLowestEmptyIndex = (board: Board, column: number) => {
  for (let i = 35 + column; i >= 0; i -= 7) {
    if (board[i] === Player.None) return i;
  }

  return -1;
};

const togglePlayerTurn = (player: Player) => {
  return player === Player.One ? Player.Two : Player.One;
};

const getGameState = (board: Board) => {
  // Checks wins horizontally
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c <= 4; c++) {
      const index = r * 7 + c;
      const boardSlice = board.slice(index, index + 4);

      const winningResult = checkWinningSlice(boardSlice);
      if (winningResult !== false) return winningResult;
    }
  }

  // check wins vertically
  for (let r = 0; r <= 2; r++) {
    for (let c = 0; c < 7; c++) {
      const index = r * 7 + c;
      const boardSlice = [
        board[index],
        board[index + 7],
        board[index + 7 * 2],
        board[index + 7 * 3]
      ];

      const winningResult = checkWinningSlice(boardSlice);
      if (winningResult !== false) return winningResult;
    }
  }

  // check wins diagonally
  for (let r = 0; r <= 2; r++) {
    for (let c = 0; c < 7; c++) {
      const index = r * 7 + c;

      // Checks diagonal down-left
      if (c >= 3) {
        const boardSlice = [
          board[index],
          board[index + 7 - 1],
          board[index + 7 * 2 - 2],
          board[index + 7 * 3 - 3]
        ];
  
        const winningResult = checkWinningSlice(boardSlice);
        if (winningResult !== false) return winningResult;
      } 

      // Checks diagonal down-right
      if (c <= 3) {
        const boardSlice = [
          board[index],
          board[index + 7 + 1],
          board[index + 7 * 2 + 2],
          board[index + 7 * 3 + 3]
        ];
  
        const winningResult = checkWinningSlice(boardSlice);
        if (winningResult !== false) return winningResult;
      }
    }
  }

  if (board.some(cell => cell === Player.None)) {
    return GameState.Ongoing
  } else {
    return GameState.Draw
  }
};

const checkWinningSlice = (miniBoard: Player[]) => {
  if (miniBoard.some(cell => cell === Player.None)) return false;

  if (
    miniBoard[0] === miniBoard[1] &&
    miniBoard[1] === miniBoard[2] &&
    miniBoard[2] === miniBoard[3]
  ) {
    return miniBoard[1];
  }

  return false;
};

class App extends React.Component<{}, State> {
  state: State = {
    board: intitializeBoard(),
    playerTurn: Player.One,
    gameState: GameState.Ongoing
  };

  public renderCells = () => {
    const { board } = this.state;
    return board.map((player, index) => this.renderCell(player, index));
  };

  public handleOnClick = (index: number) => () => {
    const {gameState} = this.state

    if (gameState !== GameState.Ongoing) return 
    
    const column = index % 7;

    this.makeMove(column);
  };

  public makeMove(column: number) {
    const { board, playerTurn } = this.state;

    const index = findLowestEmptyIndex(board, column);

    const newBoard = board.slice();
    newBoard[index] = playerTurn;

    const gameState = getGameState(newBoard);

    this.setState({
      board: newBoard,
      playerTurn: togglePlayerTurn(playerTurn),
      gameState
    });
  }

  public renderCell = (player: Player, index: number) => {
    return (
      <div
        className="cell"
        key={index}
        onClick={this.handleOnClick(index)}
        data-player={getPrettyPlayer(player)}
      />
    );
  };

  public renderGameStatus = () => {
    const { gameState } = this.state 

    let text
    if (gameState === GameState.Ongoing) {
      text = 'Game is ongoing'
    } else if (gameState === GameState.Draw) {
      text = 'Game is a draw'
    } else if (gameState === GameState.PlayerOneWin) {
      text = 'Player one won'
    } else if (gameState === GameState.PlayerTwoWin) {
      text = 'Player two won'
    }

    return <div>
      {text}
    </div>
  }

  public render() {

    return (
      <div className="App">
        {this.renderGameStatus() }
        <div className="board">{this.renderCells()}</div>
      </div>
    );
  }
}

export default App;
