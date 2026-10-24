"use client";

import { useSyncExternalStore } from "react";

// Tiny store so the nav, command menu and hero can open the chat panel (optionally with a question).
type State = { open: boolean; pending: string | null };

let state: State = { open: false, pending: null };
const listeners = new Set<() => void>();

function set(next: State) {
  state = next;
  listeners.forEach((l) => l());
}

export function openChat(question?: string) {
  set({ open: true, pending: question?.trim() || null });
}

export function closeChat() {
  set({ ...state, open: false });
}

export function takePendingQuestion() {
  const q = state.pending;
  if (q) state = { ...state, pending: null };
  return q;
}

export function useChatState() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
    () => state,
  );
}
