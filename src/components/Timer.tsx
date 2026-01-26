"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw, Coffee } from "lucide-react";

type TimerMode = "FOCUS" | "SHORT_BREAK" | "LONG_BREAK";

const TIMER_CONFIG = {
  FOCUS: 25 * 60,
  SHORT_BREAK: 5 * 60,
  LONG_BREAK: 15 * 60,
};

export default function Timer() {
  const [mode, setMode] = useState<TimerMode>("FOCUS");
  const [seconds, setSeconds] = useState(TIMER_CONFIG.FOCUS);
  const [isActive, setIsActive] = useState(false);

  // 1. Pedir permissão para notificações ao carregar o componente
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // 2. Função para tocar o aviso sonoro
  const playSound = useCallback(() => {
    const audio = new Audio("/notification.mp3");
    audio.volume = 0.5;
    audio.play().catch((err) => console.error("Erro ao tocar áudio:", err));
  }, []);

  // 3. Função para disparar notificação visual do navegador
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

  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    setSeconds(TIMER_CONFIG[newMode]);
    setIsActive(false);
  }, []);

  const handleTimerComplete = useCallback(() => {
    setIsActive(false);
    playSound();
    sendNotification();

    // Substituí o alert por um switch automático para não travar a execução do código
    if (mode === "FOCUS") {
      switchMode("SHORT_BREAK");
    } else {
      switchMode("FOCUS");
    }
  }, [mode, switchMode, playSound, sendNotification]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      handleTimerComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds, handleTimerComplete]);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] shadow-2xl text-white w-80">
      {/* Seleção de Modos */}
      <div className="flex gap-2 mb-6">
        {(["FOCUS", "SHORT_BREAK"] as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${
              mode === m
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                : "bg-white/5 hover:bg-white/10 text-white/60"
            }`}
          >
            {m === "FOCUS" ? "Foco" : "Pausa"}
          </button>
        ))}
      </div>

      {/* Display do Tempo */}
      <h2 className="text-7xl font-extralight tracking-tighter mb-8 tabular-nums drop-shadow-sm">
        {formatTime(seconds)}
      </h2>

      {/* Controles */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => setSeconds(TIMER_CONFIG[mode])}
          className="p-3 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white"
          title="Resetar"
        >
          <RotateCcw size={20} />
        </button>

        <button
          onClick={() => setIsActive(!isActive)}
          className="w-16 h-16 flex items-center justify-center bg-white text-emerald-900 rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl"
        >
          {isActive ? (
            <Pause fill="currentColor" size={28} />
          ) : (
            <Play fill="currentColor" size={28} className="ml-1" />
          )}
        </button>

        <div className="p-3 opacity-20">
          <Coffee size={20} />
        </div>
      </div>
    </div>
  );
}
