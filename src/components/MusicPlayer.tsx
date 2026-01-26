"use client";

import React, { useState } from "react";
import {
  Music,
  ChevronUp,
  ChevronDown,
  Settings2,
  Youtube,
} from "lucide-react";

export default function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  // Playlist padrão: Lofi Girl (YouTube)
  const [videoId, setVideoId] = useState("jfKfPfyJRdk");

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Extrai o ID do vídeo de um link comum do YouTube ou YouTube Music
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
      <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[28px] overflow-hidden shadow-2xl">
        {/* Cabeçalho */}
        <div
          className={`flex items-center cursor-pointer hover:bg-white/5 transition-colors ${isOpen ? "p-4 justify-between" : "h-14 justify-center"}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center justify-center bg-red-500/20 text-red-400 ${isOpen ? "p-2 rounded-xl" : "w-10 h-10 rounded-full"}`}
            >
              <Youtube size={20} />
            </div>
            {isOpen && (
              <span className="text-white font-medium text-sm">
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
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-red-500/50 transition-colors"
                />
                <p className="text-[9px] text-white/30 italic">
                  Cole qualquer link de live ou música do YouTube.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl overflow-hidden aspect-video bg-black/20">
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
