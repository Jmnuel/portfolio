"use client";

import { motion } from "motion/react";

// Each word slides up from behind its own mask when the heading scrolls into view.
// wordClassName goes on every word: a background-clip gradient on the parent wouldn't paint
// transformed children, so gradient text is applied per word.
export function WordReveal({
  text,
  className,
  wordClassName = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
}) {
  const words = text.split(" ");
  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ staggerChildren: 0.06, delayChildren: delay }}
    >
      {/* Screen readers get the plain sentence; the animated words are hidden from them. */}
      <span className="sr-only">{text}</span>
      {words.map((word, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className={`inline-block ${wordClassName}`}
            variants={{ hidden: { y: "110%" }, shown: { y: "0%" } }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}
            {i < words.length - 1 && " "}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
