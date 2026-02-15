"use client";

import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Timer from "@/components/Timer";
import TodoList from "@/components/TodoList";
import MusicPlayer from "@/components/MusicPlayer";
import Image from "next/image";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-6 bg-slate-900">
      {/* IMAGEM DE FUNDO */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
        style={{
          backgroundImage: "url('/background1.jpg')",
          filter: "brightness(0.7)",
        }}
      />

      {/* BOTÃO DE LOGIN - Usando glass-button */}
      <div className="fixed top-8 right-8 z-50">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="glass-button text-white px-5 py-2 rounded-full text-sm font-medium">
              Entrar
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>

      {/* GRID DE 3 COLUNAS */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-10 w-full max-w-7xl items-start">
        {/* COLUNA 1: TODO LIST */}
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-sm">
            <TodoList />
          </div>
        </div>

        {/* COLUNA 2: CENTRO (TIMER) */}
        <div className="flex flex-col items-center justify-start lg:justify-center min-h-[600px] py-4">
          <div className="relative w-full flex flex-col items-center mb-4">
            <Image
              src="/logo1.png"
              alt="Flowrest Logo"
              width={2000}
              height={100}
              priority
              className="drop-shadow-2xl object-contain"
            />
            <div className="h-[1px] w-16 bg-white/10 mt-2 rounded-full"></div>
          </div>

          <div className="transform scale-110">
            <Timer />
          </div>

          <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase font-light mt-8 text-sharp">
            Foco Profundo
          </p>
        </div>

        {/* COLUNA 3: WIDGETS */}
        <div className="flex flex-col space-y-6">
          {/* Widget Saudação - Agora com glass-card e text-sharp */}
          <div className="glass-card p-6 rounded-[32px] text-white">
            <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1">
              Foco Ativo
            </p>
            <h2 className="text-2xl font-light text-sharp">Bom trabalho!</h2>
            <div className="mt-4 flex items-center gap-2 text-emerald-400 text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-sharp">Cultivando produtividade</span>
            </div>
          </div>

          {/* Widget Notas - Agora com glass-card */}
          <div className="glass-card p-6 rounded-[32px] text-white flex flex-col min-h-[180px]">
            <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-3">
              Notas Rápidas
            </p>
            <textarea
              placeholder="Escreva algo..."
              className="bg-transparent w-full flex-1 outline-none text-sm font-light placeholder:text-white/20 resize-none text-white text-sharp"
            />
          </div>
        </div>
      </div>

      <MusicPlayer />
    </main>
  );
}
