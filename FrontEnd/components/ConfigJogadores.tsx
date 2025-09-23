"use client";
import { useState } from "react";

interface Player { id: string; name: string; }
interface Game { id: string; boardState: string; movesCount: number; }

export default function JogoDaVelha() {
  const [jogadorX, setJogadorX] = useState("");
  const [jogadorO, setJogadorO] = useState("");
  const [playerX, setPlayerX] = useState<Player | null>(null);
  const [playerO, setPlayerO] = useState<Player | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<"x" | "o">("x");
  const [winner, setWinner] = useState<string | null>(null);

  const createUser = async (name: string) => {
    const res = await fetch("https://localhost:7134/api/Users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error("Erro ao criar jogador");
    return res.json();
  };

  const startGame = async () => {
    if (!jogadorX || !jogadorO) return;

    try {
      const px = await createUser(jogadorX);
      const po = await createUser(jogadorO);

      const res = await fetch("https://localhost:7134/api/Game/start-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerXId: px.id, playerOId: po.id }),
      });

      if (!res.ok) throw new Error("Erro ao iniciar partida");
      const g = await res.json();
      const initialBoard = g.boardState.split("").map((c: string) => (c === "-" ? null : c));

      setPlayerX({ id: px.id, name: jogadorX });
      setPlayerO({ id: po.id, name: jogadorO });
      setGame({ id: g.id, boardState: g.boardState, movesCount: g.movesCount });
      setBoard(initialBoard);
      setCurrentPlayer("x");
      setWinner(null);

    } catch (error) {
      console.error("Erro ao iniciar partida:", error);
    }
  };

  const makeMove = async (pos: number) => {
    if (!game || !playerX || !playerO || winner) return;
    if (board[pos]) return;

    const playerId = currentPlayer === "x" ? playerX.id : playerO.id;

    try {
      const res = await fetch("https://localhost:7134/api/Game/make-move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: game.id, playerId, position: pos }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Erro na jogada:", text);
        return;
      }

      const result = await res.json();

      const newBoard = result.boardState.split("").map((c: string) => (c === "-" ? null : c));
      setBoard(newBoard);

      if (result.winner === "X") {
        setWinner(playerX.name);
      } else if (result.winner === "O") {
        setWinner(playerO.name);
      } else if (result.winner === "DRAW") {
        setWinner("DRAW");
      } else {
        setCurrentPlayer(currentPlayer === "x" ? "o" : "x");
      }

    } catch (error) {
      console.error("Erro ao fazer jogada:", error);
    }
  };

  const resetGame = () => {
    setGame(null);
    setBoard(Array(9).fill(null));
    setWinner(null);
    setCurrentPlayer("x");
    setPlayerX(null);
    setPlayerO(null);
    setJogadorX("");
    setJogadorO("");
  };

  if (!game) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br">
        <div className="p-8 w-96 rounded-3xl shadow-2xl border border-black">
          <h2 className="text-black text-3xl mb-8 text-center font-bold">Nome dos jogadores:</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-black mb-2 font-semibold">Jogador X</label>
              <input
                value={jogadorX}
                onChange={e => setJogadorX(e.target.value)}
                placeholder="Digite o nome do Jogador X"
                className="w-full p-4 rounded-xl border border-white bg-slate-700/50 text-white placeholder-white focus:border-red-500/50 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-black mb-2 font-semibold">Jogador O</label>
              <input
                value={jogadorO}
                onChange={e => setJogadorO(e.target.value)}
                placeholder="Digite o nome do Jogador O"
                className="w-full p-4 rounded-xl border border-white bg-slate-700/50 text-white placeholder-white focus:border-green-500/50 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
              />
            </div>

            <button
              onClick={startGame}
              disabled={!jogadorX || !jogadorO}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-700 to-black disabled:cursor-not-allowed text-white font-semibold text-lg transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-purple-500/25"
            >
              Iniciar Jogo
            </button>

            <button
              onClick={() => window.location.href = "/ultimos-vencedores"}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-700 to-black text-white font-semibold text-lg transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-yellow-500/25"
            >
              Últimos Vencedores
            </button>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br p-8">

      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-8 mb-6">
          <div className="flex items-center gap-3 px-4 py-2 bg-red-900/20 border border-red-500/50 rounded-xl">
            <span className="text-2xl font-bold text-red-800">X</span>
            <span className="text-red-800 font-semibold">{playerX?.name}</span>
          </div>
          <div className="text-black text-xl font-bold">VS</div>
          <div className="flex items-center gap-3 px-4 py-2 bg-green-900/30 border border-green-700 rounded-xl">
            <span className="text-2xl font-bold text-green-300">O</span>
            <span className="text-green-300 font-semibold">{playerO?.name}</span>
          </div>
        </div>

        {winner ? (
          <div className="text-center">
            <h2 className={`text-3xl font-bold mb-2 ${winner === playerX?.name ? "text-red-800" : winner === playerO?.name ? "text-green-800" : "text-red-800"}`}>
              {winner === "DRAW" ? "Empate!" : `Vencedor: ${winner}`}
            </h2>
          </div>
        ) : (
          <div className="text-center">
            <h3 className="text-black font-bold text-lg mb-3">Turno do Jogador:</h3>
            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl border-2 font-semibold text-lg ${currentPlayer === "x"
              ? "bg-red-900/20 border-red-500/50 text-red-800"
              : "bg-green-900/30 border-green-500/50 text-green-400"
              }`}>
              <span className="text-2xl font-bold">{currentPlayer.toUpperCase()}</span>
              <span>{currentPlayer === "x" ? playerX?.name : playerO?.name}</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8 p-6  rounded-3xl border shadow-2xl">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => makeMove(i)}
            disabled={!!winner || !!cell}
            className="w-24 h-24 md:w-28 md:h-28 flex items-center justify-center text-4xl font-bold rounded-2xl bg-slate-700/60 border border-slate-600/50 hover:bg-slate-600/70 disabled:hover:bg-slate-700/60 transition-all duration-200 hover:scale-105 hover:border-purple-500/30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:border-slate-600/50"
          >
            <span className={
              cell === "x" ? "text-red-400" :
                cell === "o" ? "text-green-400" : ""
            }>
              {cell?.toUpperCase()}
            </span>
          </button>
        ))}
      </div>

      <button
        onClick={resetGame}
        className="px-8 py-4 text-white font-semibold text-lg rounded-xl bg-gradient-to-r from-yellow-600 to-black hover:from-black hover:to-yellow-600 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-purple-500/25"
      >
        Nova Partida
      </button>
    </div>
  );
}