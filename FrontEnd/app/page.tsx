"use client";

import { useState } from "react";
import Header from "@/components/Header";
import ConfigJogadores from "@/components/ConfigJogadores";
import GameBoard from "@/components/GameBoard";
import HistoricoPartidas from "@/components/HistoricoPartidas";

export default function Page() {
  const [jogadores, setJogadores] = useState<{ x: string; o: string } | null>(
    null
  );

  return (
    // <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-purple-900">
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-yellow-600 to-black">
      <main className="w-full max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-6">
        <div>
          <Header />
          {!jogadores ? (
            <ConfigJogadores/>
          ) : (
            <GameBoard jogadores={jogadores} onReset={() => setJogadores(null)} />
          )}
        </div>
        <HistoricoPartidas />
      </main>
    </div>
  );
}