"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Loader2,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";

interface Task {
  id: number;
  title: string;
  is_completed: boolean;
  user_id: string;
}

export default function TodoList() {
  const { user } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    async function fetchTasks() {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) console.error("Erro ao carregar:", error);
      else setTasks(data || []);
      setLoading(false);
    }

    fetchTasks();
  }, [user]);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !user) return;

    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          title: newTaskTitle,
          is_completed: false,
          user_id: user.id,
        },
      ])
      .select();

    if (error) {
      console.error("Erro ao adicionar:", error);
    } else if (data) {
      setTasks([data[0], ...tasks]);
      setNewTaskTitle("");
    }
  };

  const toggleTask = async (id: number, currentStatus: boolean) => {
    const { error } = await supabase
      .from("tasks")
      .update({ is_completed: !currentStatus })
      .eq("id", id);

    if (error) console.error("Erro ao atualizar:", error);
    else {
      setTasks(
        tasks.map((t) =>
          t.id === id ? { ...t, is_completed: !currentStatus } : t,
        ),
      );
    }
  };

  const saveEdit = async (id: number) => {
    if (!editValue.trim()) return;

    const { error } = await supabase
      .from("tasks")
      .update({ title: editValue })
      .eq("id", id);

    if (error) {
      console.error("Erro ao editar:", error);
    } else {
      setTasks(
        tasks.map((t) => (t.id === id ? { ...t, title: editValue } : t)),
      );
      setEditingId(null);
    }
  };

  const deleteTask = async (id: number) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) console.error("Erro ao eliminar:", error);
    else setTasks(tasks.filter((t) => t.id !== id));
  };

  if (!user) {
    return (
      <div className="glass-card w-full max-w-sm rounded-3xl p-6 text-center">
        <p className="text-xs text-white/40 italic">
          Faça login para gerenciar suas tarefas. 🌿
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card w-full max-w-sm flex flex-col rounded-[32px] p-6 text-white overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-light tracking-tight text-sharp">
          Tarefas
        </h3>
        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full uppercase tracking-widest font-bold">
          {tasks.length}
        </span>
      </div>

      <form onSubmit={addTask} className="relative mb-6">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="No que vamos focar?"
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 pr-12 outline-none text-sm focus:border-emerald-500/50 transition-all placeholder:text-white/20 text-white"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400 rounded-xl transition-colors"
        >
          <Plus size={20} />
        </button>
      </form>

      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-emerald-500 opacity-50" />
          </div>
        ) : tasks.length === 0 ? (
          <p className="text-xs text-white/30 text-center py-8 italic">
            Sua floresta está calma.
          </p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between group bg-white/[0.04] p-3 rounded-2xl border border-white/5 hover:border-white/20 transition-all"
            >
              {editingId === task.id ? (
                <div className="flex items-center gap-2 w-full animate-in fade-in duration-300">
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="bg-black/40 border border-emerald-500/50 rounded-lg px-2 py-1 text-sm text-white outline-none w-full font-medium"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && saveEdit(task.id)}
                  />
                  <div className="flex">
                    <button
                      onClick={() => saveEdit(task.id)}
                      className="text-emerald-400 p-1 hover:scale-110 transition-transform"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-red-400 p-1 hover:scale-110 transition-transform"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className="flex items-center gap-3 cursor-pointer overflow-hidden flex-1"
                    onClick={() => toggleTask(task.id, task.is_completed)}
                  >
                    {task.is_completed ? (
                      <CheckCircle2
                        size={18}
                        className="text-emerald-400 shrink-0"
                      />
                    ) : (
                      <Circle
                        size={18}
                        className="text-white/20 shrink-0 hover:text-white/40 transition-colors"
                      />
                    )}
                    <span
                      className={`text-sm truncate ${
                        task.is_completed
                          ? "line-through text-white/30"
                          : "text-sharp"
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                    <button
                      onClick={() => {
                        setEditingId(task.id);
                        setEditValue(task.title);
                      }}
                      className="p-1.5 hover:bg-white/10 rounded-lg text-white/40 hover:text-emerald-400 transition-all"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 hover:bg-white/10 rounded-lg text-white/40 hover:text-red-400 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
