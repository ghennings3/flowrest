"use client";

import React, { useState } from "react";
import { Settings2, Youtube, X } from "lucide-react";

export default function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [videoId, setVideoId] = useState("jfKfPfyJRdk");

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.includes("v=")) {
      const id = val.split("v=")[1].split("&")[0];
      setVideoId(id);
    } else if (val.includes("be/")) {
      const id = val.split("be/")[1].split("?")[0];
      setVideoId(id);
    }
  };

  return (
    <div
      className={`fixed bottom-6 right-6 transition-all duration-500 z-50 ${isOpen ? "w-80" : "w-14"}`}
    >
      {/* TOOLTIP: Ajustado para não vazar da tela */}
      {!isOpen && showTooltip && (
        <div className="absolute bottom-full right-0 mb-4 w-48 p-4 glass-card rounded-2xl animate-bounce translate-x-[-8px]">
          {/* Botão de Fechar no Canto Interno */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="absolute top-2 right-2 p-1 text-white/30 hover:text-white transition-colors z-10"
            title="Fechar aviso"
          >
            <X size={12} />
          </button>

          {/* Texto com margem à direita para não bater no X */}
          <p className="text-[11px] leading-tight pr-4 text-sharp">
            Aperte o play e entre no Flow 🎵
          </p>

          {/* Triângulo do balão - Ajustado para alinhar com o centro do botão redondo */}
          <div className="absolute top-full right-[18px] border-[6px] border-transparent border-t-white/10"></div>
        </div>
      )}

      {/* Container Principal do Player */}
      <div className="glass-card rounded-[28px] overflow-hidden">
        {/* Cabeçalho */}
        <div
          className={`flex items-center cursor-pointer hover:bg-white/5 transition-colors ${isOpen ? "p-4 justify-between" : "h-14 justify-center"}`}
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) setShowTooltip(false);
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center justify-center bg-red-500/20 text-red-400 ${isOpen ? "p-2 rounded-xl" : "w-10 h-10 rounded-full"}`}
            >
              <Youtube size={20} />
            </div>
            {isOpen && (
              <span className="text-white font-medium text-sm text-sharp">
                Flowrest Radio
              </span>
            )}
          </div>
          {isOpen && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSettings(!showSettings);
              }}
              className="p-1 glass-button rounded-lg"
            >
              <Settings2
                size={18}
                className={`${showSettings ? "text-red-400" : "text-white/40"} hover:text-white transition-colors`}
              />
            </button>
          )}
        </div>

        {/* Player & Configurações */}
        {isOpen && (
          <div className="p-4 pt-0 space-y-4 animate-in zoom-in-95 duration-300">
            {showSettings ? (
              <div className="space-y-2 py-2">
                <label className="text-[10px] text-white/50 uppercase tracking-wider font-bold">
                  Link do YouTube
                </label>
                <input
                  type="text"
                  placeholder="Cole o link do vídeo/live..."
                  onChange={handleLinkChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setShowSettings(false);
                    }
                  }}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-red-500/50 transition-colors"
                />
                <p className="text-[9px] text-white/30 italic">
                  Cole qualquer link de live ou música do YouTube e aperte
                  Enter.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl overflow-hidden aspect-video bg-black/40 border border-white/5">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1`}
                  title="YouTube Music Player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
            {!showSettings && (
              <p className="text-[10px] text-white/30 text-center uppercase tracking-[0.2em] font-light">
                Som de Foco & Estudo
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
