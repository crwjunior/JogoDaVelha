"use client";

import { useState } from "react";

interface Props {
  jogadores?: { x: string; o: string };
  onReset?: () => void;
}

export default function GameBoard({ jogadores = { x: "Jogador X", o: "Jogador O" }, onReset = () => {} }: Props) {
  const [board, setBoard] = useState(Array(9).fill(""));
  const [turn, setTurn] = useState<"X" | "O">("X");

  function handleClick(index: number) {
    if (board[index]) return;
    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);
    setTurn(turn === "X" ? "O" : "X");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-purple-900 p-8">
      <div className="mb-8 text-center">
        <h3 className="text-black text-lg mb-3">Turno do Jogador</h3>
        <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl border-2 font-semibold text-lg ${
          turn === "X" 
            ? "bg-red-900/30 border-red-500/50 text-red-600" 
            : "bg-green-900/30 border-green-500/50 text-green-400"
        }`}>
          <span className="text-2xl font-bold">{turn}</span>
          <span>{turn === "X" ? jogadores.x : jogadores.o}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8 p-6 bg-slate-800/50 rounded-3xl border border-slate-700/50 shadow-2xl">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className="w-24 h-24 md:w-28 md:h-28 flex items-center justify-center text-4xl font-bold rounded-2xl bg-slate-700/60 border border-slate-600/50 hover:bg-slate-600/70 transition-all duration-200 hover:scale-105 hover:border-purple-500/30"
          >
            <span className={cell === "X" ? "text-red-500" : cell === "O" ? "text-green-500" : ""}>
              {cell}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}