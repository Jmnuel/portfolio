"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { StaticCore } from "./StaticCore";

const NeuralCore = dynamic(() => import("./NeuralCore"), { ssr: false });

function canUseWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function HeroVisual() {
  const [mode, setMode] = useState<"pending" | "3d" | "static">("pending");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMode(!reduced && canUseWebGL() ? "3d" : "static");
  }, []);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: mode === "pending" ? 0 : 1, scale: 1 }}
      transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {mode === "3d" && <NeuralCore />}
      {mode === "static" && <StaticCore />}
    </motion.div>
  );
}
