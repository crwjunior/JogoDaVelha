"use client";
import React, { useEffect, useState } from "react";

interface Match {
  gameId: string;
  playerX: string;
  playerO: string;
  result: string;
  playedAt: string;
}

export default function UltimosVencedores() {
  const [winnerNames, setWinnerNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<{
    matches?: Match[];
    finishedMatches?: Match[];
    winners?: string[];
  } | null>(null);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("https://localhost:7134/api/Game/matches");
        if (!res.ok) {
          throw new Error(`Erro ao buscar partidas: ${res.status}`);
        }

        const matches: Match[] = await res.json();
        setDebugInfo({
          matches,
          finishedMatches: undefined,
          winners: undefined
        });

        const finishedMatches = matches.filter(
          match => match.result === "X" || match.result === "O"
        );

        setDebugInfo(prev => ({
          ...prev,
          finishedMatches,
          winners: undefined
        }));

        const winners: string[] = finishedMatches.map(match => {
          if (match.result === "X") {
            return match.playerX;
          } else if (match.result === "O") {
            return match.playerO;
          } else {
            return "Empate";
          }
        });

        setWinnerNames(winners);
        setDebugInfo(prev => ({
          ...prev,
          winners
        }));

      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "1rem" }}>
        <div style={{ textAlign: "center" }}>
          <p>Carregando vencedores...</p>
          <div style={{
            width: "40px",
            height: "40px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #3498db",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto"
          }}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "1rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem", color: "#e74c3c" }}>
          Erro ao Carregar
        </h2>
        <p style={{ color: "#e74c3c" }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div style={{
      padding: "1rem",
      maxWidth: "400px",
      margin: "0 auto",
      backgroundColor: "#1e1e2f",
      color: "#ecf0f1",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
    }}>
      <h2 style={{
        fontSize: "1.5rem",
        fontWeight: "bold",
        marginBottom: "1rem",
        textAlign: "center",
        color: "#f39c12"
      }}>
        🏆 Últimos Vencedores
      </h2>

      {winnerNames.length === 0 ? (
        <p style={{
          fontSize: "1rem",
          color: "#bdc3c7",
          fontStyle: "italic",
          textAlign: "center",
          marginTop: "2rem"
        }}>
          Nenhuma partida finalizada ainda
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {winnerNames.map((name, index) => (
            <li
              key={index}
              style={{
                padding: "0.8rem 1rem",
                marginBottom: "0.5rem",
                backgroundColor: index % 2 === 0 ? "#f39c12" : "#000000",
                borderRadius: "8px",
                fontWeight: index < 3 ? "bold" : "normal",
                fontSize: "1.2rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                textAlign: "center",
                color: "#ecf0f1"
              }}
            >
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}