import React, { useState } from "react";

function Square({value, onSquareClick}) {
  return <button className="square" onClick={onSquareClick}>{value}</button>;
}

function Board({xIsNext, squares, onPlay}) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const rows = 3;
  const cols = 3;
  const board = Array(rows);
  for (let r = 0; r < rows; r++) {
    let row = Array(cols);
    for (let c = 0; c < cols; c++) {
      const n = r*rows+c;
      row[c] = <Square key={n} value={squares[n]} onSquareClick={() => handleClick(n)} />;
    }
    board[r] = <div key={r} className="board-row">{row}</div>;
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = winner + " Wins!";
  } else if (calculateDraw(squares)) {
    status = "Draw.";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [ascendingOrder, setAscendingOrder] = useState(true);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length-1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move === currentMove) {
      if (move === 0) {
        description = "You are at game start";
      } else {
        description = "You are at move #" + move;
      }
    } else if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  });

  const list = ascendingOrder ? <ol>{moves}</ol> : <ol reversed>{moves.reverse()}</ol>;

  function reverseOrder() {
    setAscendingOrder(!ascendingOrder);
  }

  const order = ascendingOrder ? "Switch to descending order" : "Switch to ascending order";

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <button onClick={reverseOrder}>{order}</button>
        {list}
      </div>
    </div>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function calculateDraw(squares) {
  for (let i = 0; i < squares.length; i++) {
    if (!squares[i]) return false;
  }
  return true;
}