"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw, Settings2, Check, X } from "lucide-react";
import { useUser } from "@clerk/nextjs";

type TimerMode = "FOCUS" | "SHORT_BREAK" | "LONG_BREAK";

export default function Timer() {
  // TODO: testando o agente de IA
  const { user } = useUser();

  const [focusInput, setFocusInput] = useState(25);
  const [breakInput, setBreakInput] = useState(5);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [mode, setMode] = useState<TimerMode>("FOCUS");
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const playSound = useCallback(() => {
    const audio = new Audio("/notification.mp3");
    audio.volume = 0.5;
    audio.play().catch((err) => console.error("Erro ao tocar áudio:", err));
  }, []);

  const sendNotification = useCallback(() => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Flowrest", {
        body:
          mode === "FOCUS"
            ? "Hora de descansar um pouco! 🌿"
            : "Vamos voltar ao foco? 🌳",
        icon: "/logo.png",
      });
    }
  }, [mode]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const switchMode = useCallback(
    (newMode: TimerMode) => {
      setMode(newMode);
      const mins = newMode === "FOCUS" ? focusInput : breakInput;
      setSeconds(mins * 60);
      setIsActive(false);
    },
    [focusInput, breakInput],
  );

  const saveSettings = () => {
    const mins = mode === "FOCUS" ? focusInput : breakInput;
    setSeconds(mins * 60);
    setIsActive(false);
    setIsSettingsOpen(false);
  };

  const handleTimerComplete = useCallback(() => {
    setIsActive(false);
    playSound();
    sendNotification();
    if (mode === "FOCUS") switchMode("SHORT_BREAK");
    else switchMode("FOCUS");
  }, [mode, switchMode, playSound, sendNotification]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => setSeconds((prev) => prev - 1), 1000);
    } else if (seconds === 0) {
      handleTimerComplete();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds, handleTimerComplete]);

  return (
    <div className="glass-card flex flex-col items-center justify-center p-8 rounded-[32px] w-80 relative overflow-hidden">
      {/* OVERLAY DE CONFIGURAÇÕES - AGORA OPACO */}
      {isSettingsOpen && user && (
        <div className="absolute inset-0 bg-emerald-950/98 backdrop-blur-2xl z-20 flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-200">
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <h4 className="text-[10px] uppercase tracking-[0.2em] mb-8 font-bold text-emerald-400 drop-shadow-sm">
            Ajustar Tempos
          </h4>

          <div className="flex items-center gap-6 mb-10">
            <div className="flex flex-col items-center gap-2">
              <label
                htmlFor="focus-time"
                className="text-[10px] text-white/40 uppercase tracking-widest font-bold"
              >
                Foco
              </label>
              <input
                id="focus-time"
                type="number"
                value={focusInput}
                onChange={(e) => setFocusInput(Number(e.target.value))}
                className="w-20 bg-white/5 border border-white/10 rounded-2xl py-3 text-center text-2xl text-white outline-none focus:border-emerald-500 transition-all tabular-nums"
              />
            </div>

            <div className="text-white/20 text-2xl mt-6">:</div>

            <div className="flex flex-col items-center gap-2">
              <label
                htmlFor="break-time"
                className="text-[10px] text-white/40 uppercase tracking-widest font-bold"
              >
                Pausa
              </label>
              <input
                id="break-time"
                type="number"
                value={breakInput}
                onChange={(e) => setBreakInput(Number(e.target.value))}
                className="w-20 bg-white/5 border border-white/10 rounded-2xl py-3 text-center text-2xl text-white outline-none focus:border-emerald-500 transition-all tabular-nums"
              />
            </div>
          </div>

          <button
            onClick={saveSettings}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 px-8 py-3 rounded-full font-bold text-xs uppercase transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            <Check size={14} /> Salvar Alterações
          </button>
        </div>
      )}

      {/* Seleção de Modos */}
      <div className="flex gap-2 mb-6">
        {(["FOCUS", "SHORT_BREAK"] as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${
              mode === m
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/40"
                : "bg-white/5 hover:bg-white/10 text-white/60"
            }`}
          >
            {m === "FOCUS" ? "Foco" : "Pausa"}
          </button>
        ))}
      </div>

      {/* Display do Tempo - Espaçamento corrigido com tracking-widest */}
      <h2 className="text-7xl font-extralight mb-8 tabular-nums text-sharp tracking-widest">
        {formatTime(seconds)}
      </h2>

      {/* Controles */}
      <div className="flex items-center gap-6">
        <button
          onClick={() =>
            setSeconds((mode === "FOCUS" ? focusInput : breakInput) * 60)
          }
          className="p-3 glass-button rounded-full text-white/40 hover:text-white"
          title="Resetar"
        >
          <RotateCcw size={20} />
        </button>

        <button
          aria-label="Play"
          onClick={() => setIsActive(!isActive)}
          className="w-16 h-16 flex items-center justify-center bg-white text-emerald-900 rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl"
        >
          {isActive ? (
            <Pause fill="currentColor" size={28} />
          ) : (
            <Play fill="currentColor" size={28} className="ml-1" />
          )}
        </button>

        <div className="group relative">
          <button
            aria-label="Settings"
            onClick={() => user && setIsSettingsOpen(true)}
            className={`p-3 rounded-full transition-all ${
              user
                ? "glass-button text-white/40 hover:text-white"
                : "text-white/10 cursor-default"
            }`}
          >
            <Settings2 size={20} />
          </button>

          {!user && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-44 p-3 bg-white/10 backdrop-blur-xl rounded-xl text-[10px] text-center leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none border border-white/10 shadow-2xl text-white font-medium scale-95 group-hover:scale-100">
              <span className="text-sharp">
                Cultive seu próprio tempo. Faça login para personalizar os
                ciclos de foco 🌿
              </span>
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-white/10"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
