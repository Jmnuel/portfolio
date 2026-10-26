"use client";

import { useSyncExternalStore } from "react";

// Lets the command menu open the typing-test easter egg.
let open = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function openTyping() {
  open = true;
  emit();
}

export function closeTyping() {
  open = false;
  emit();
}

export function useTypingOpen() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => open,
    () => false,
  );
}
