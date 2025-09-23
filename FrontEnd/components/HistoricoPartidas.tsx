"use client";
import { useEffect, useState } from "react";

interface Match {
  gameId: string;
  playerX: string;
  playerO: string;
  result: string;
  playedAt: string;
}

export default function HistoricoPartidas() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch("https://localhost:7134/api/Game/matches");
        if (!response.ok) throw new Error("Erro ao buscar partidas");
        const data = await response.json();
        setMatches(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return <p className="text-gray-400">Carregando partidas...</p>;
  }

  return (
    <div className="p-6 rounded-2xl w-full">
      <h2 className="text-2xl font-semibold text-black mb-4">
        🏆 Histórico de Partidas
      </h2>

      {matches.length === 0 ? (
        <p className="text-gray-400">Nenhuma partida encontrada.</p>
      ) : (
<ul
  className="space-y-4 overflow-y-auto pr-2"
  style={{ maxHeight: "700px" }}
>
  {matches.map((match) => (
    <li
      key={match.gameId}
      className="p-4 rounded bg-black/50 border border-gray-600"
    >
      <div className="flex justify-between text-sm text-white">
        <span>{new Date(match.playedAt).toLocaleString()}</span>
        <span>
          {match.result === "Em andamento" ? "Status" : "Vencedor"}:{" "}
          {match.result}
        </span>
      </div>
      <div className="text-lg mt-2">
        <span className="text-red-400">{match.playerX}</span> vs{" "}
        <span className="text-green-400">{match.playerO}</span>
      </div>
    </li>
  ))}
</ul>

      )}
    </div>
  );
}
