"use client";

import { useState } from "react";

interface Props {
  gameId: string;
  playerXId: string;
  playerOId: string;
  playerNames: { x: string; o: string };
}

export default function Tabuleiro({ gameId, playerXId, playerOId, playerNames }: Props) {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<"x" | "o">("x");

  const makeMove = async (position: number) => {
    if (board[position]) return;

    const playerId = currentPlayer === "x" ? playerXId : playerOId;

    try {
      const response = await fetch("https://localhost:7134/api/Game/make-move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, playerId, position }),
      });

      if (!response.ok) throw new Error("Erro ao fazer jogada");

      const newBoard = [...board];
      newBoard[position] = currentPlayer;
      setBoard(newBoard);

      setCurrentPlayer(currentPlayer === "x" ? "o" : "x");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-2 w-64 mx-auto mt-4">
      {board.map((cell, idx) => (
        <button
          key={idx}
          onClick={() => makeMove(idx)}
          className="w-16 h-16 text-2xl font-bold bg-black/50 text-white rounded border border-gray-600"
        >
          {cell?.toUpperCase()}
        </button>
      ))}
      <p className="mt-4 text-center text-gray-300">
        Turno: {currentPlayer === "x" ? playerNames.x : playerNames.o}
      </p>
    </div>
  );
}