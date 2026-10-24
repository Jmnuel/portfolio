// Generative ambient soundtrack built with the Web Audio API: no audio file is downloaded.
// Off by default; it only starts from a user gesture (the sound toggle or command menu).

const BPM = 76;
const BEAT = 60 / BPM;
const BEATS_PER_CHORD = 8;
const VOLUME = 0.32;
const STORAGE_KEY = "sound";

// A minor progression: Am9 → Fmaj9 → Cmaj7 → G6 (MIDI notes).
const CHORDS = [
  { bass: 45, notes: [57, 60, 64, 67, 71] },
  { bass: 41, notes: [57, 60, 64, 67] },
  { bass: 48, notes: [52, 55, 59, 64] },
  { bass: 43, notes: [55, 59, 62, 64] },
];

const mtof = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

type Graph = {
  ctx: AudioContext;
  master: GainNode;
  analyser: AnalyserNode;
  reverb: ConvolverNode;
  delay: DelayNode;
  padFilter: BiquadFilterNode;
  noise: AudioBuffer;
  wave: Float32Array<ArrayBuffer>;
};

// Per-play buses, so stopping disconnects every voice already scheduled ahead.
type Session = { dry: GainNode; pad: GainNode; fx: GainNode };

let graph: Graph | null = null;
let session: Session | null = null;
let playing = false;
let timer: ReturnType<typeof setInterval> | undefined;
let nextBeat = 0;
let beat = 0;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function impulse(ctx: AudioContext, seconds: number, decay: number) {
  const length = ctx.sampleRate * seconds;
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const data = buffer.getChannelData(c);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
  }
  return buffer;
}

function buildGraph(): Graph {
  const ctx = new AudioContext();

  const analyser = ctx.createAnalyser();
  analyser.fftSize = 1024;
  analyser.smoothingTimeConstant = 0.6;

  const master = ctx.createGain();
  master.gain.value = 0;
  const compressor = ctx.createDynamicsCompressor();
  master.connect(compressor).connect(analyser).connect(ctx.destination);

  const reverb = ctx.createConvolver();
  reverb.buffer = impulse(ctx, 3.5, 2.5);
  const reverbReturn = ctx.createGain();
  reverbReturn.gain.value = 0.55;
  reverb.connect(reverbReturn).connect(master);

  // Dotted-eighth echo for the shimmer notes.
  const delay = ctx.createDelay(2);
  delay.delayTime.value = BEAT * 0.75;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.38;
  delay.connect(feedback).connect(delay);
  delay.connect(reverb);
  delay.connect(master);

  // Slowly breathing low-pass over the pads.
  const padFilter = ctx.createBiquadFilter();
  padFilter.type = "lowpass";
  padFilter.frequency.value = 900;
  padFilter.Q.value = 0.8;
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.05;
  const lfoDepth = ctx.createGain();
  lfoDepth.gain.value = 450;
  lfo.connect(lfoDepth).connect(padFilter.frequency);
  lfo.start();
  padFilter.connect(master);
  padFilter.connect(reverb);

  const noise = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
  const nd = noise.getChannelData(0);
  for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;

  return { ctx, master, analyser, reverb, delay, padFilter, noise, wave: new Float32Array(analyser.fftSize) };
}

function envelope(param: AudioParam, t: number, peak: number, attack: number, hold: number, release: number) {
  param.setValueAtTime(0.0001, t);
  param.linearRampToValueAtTime(peak, t + attack);
  param.setValueAtTime(peak, t + attack + hold);
  param.linearRampToValueAtTime(0.0001, t + attack + hold + release);
}

function playChord(g: Graph, s: Session, chord: (typeof CHORDS)[number], t: number) {
  const { ctx } = g;
  const length = BEAT * BEATS_PER_CHORD;

  for (const note of chord.notes) {
    const voice = ctx.createGain();
    envelope(voice.gain, t, 0.035, 2.5, length - 2, 3);
    voice.connect(s.pad);
    for (const detune of [-7, 7]) {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.value = mtof(note);
      osc.detune.value = detune;
      osc.connect(voice);
      osc.start(t);
      osc.stop(t + length + 3.5);
    }
  }

  const bass = ctx.createOscillator();
  bass.type = "sine";
  bass.frequency.value = mtof(chord.bass);
  const bassGain = ctx.createGain();
  envelope(bassGain.gain, t, 0.16, 1.2, length - 1.5, 2);
  bass.connect(bassGain).connect(s.dry);
  bass.start(t);
  bass.stop(t + length + 2.5);
}

function playKick(g: Graph, bus: GainNode, t: number) {
  const osc = g.ctx.createOscillator();
  osc.frequency.setValueAtTime(120, t);
  osc.frequency.exponentialRampToValueAtTime(42, t + 0.14);
  const gain = g.ctx.createGain();
  gain.gain.setValueAtTime(0.55, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
  osc.connect(gain).connect(bus);
  osc.start(t);
  osc.stop(t + 0.5);
}

function playHat(g: Graph, bus: GainNode, t: number) {
  const src = g.ctx.createBufferSource();
  src.buffer = g.noise;
  const hp = g.ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 7500;
  const gain = g.ctx.createGain();
  gain.gain.setValueAtTime(0.025, t);
  gain.gain.exponentialRampToValueAtTime(0.0005, t + 0.06);
  src.connect(hp).connect(gain).connect(bus);
  src.start(t);
  src.stop(t + 0.1);
}

function playShimmer(g: Graph, s: Session, note: number, t: number) {
  const osc = g.ctx.createOscillator();
  osc.type = "triangle";
  osc.frequency.value = mtof(note);
  const gain = g.ctx.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.linearRampToValueAtTime(0.045, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
  osc.connect(gain);
  gain.connect(s.dry);
  gain.connect(s.fx);
  osc.start(t);
  osc.stop(t + 1.7);
}

function scheduleBeat(g: Graph, s: Session, n: number, t: number) {
  const chord = CHORDS[Math.floor(n / BEATS_PER_CHORD) % CHORDS.length];
  const step = n % BEATS_PER_CHORD;
  if (step === 0) playChord(g, s, chord, t);
  // Let the first chord breathe before the pulse comes in.
  if (n >= 4 && step !== 7) playKick(g, s.dry, t);
  if (n >= 8) playHat(g, s.dry, t + BEAT / 2);
  if (Math.random() < 0.4) {
    const note = chord.notes[Math.floor(Math.random() * chord.notes.length)] + (Math.random() < 0.5 ? 12 : 24);
    playShimmer(g, s, note, t + (Math.random() < 0.5 ? 0 : BEAT / 2));
  }
}

function tick() {
  if (!graph || !session) return;
  while (nextBeat < graph.ctx.currentTime + 0.25) {
    scheduleBeat(graph, session, beat, nextBeat);
    nextBeat += BEAT;
    beat++;
  }
}

function onVisibility() {
  if (!graph || !playing) return;
  if (document.hidden) graph.ctx.suspend();
  else graph.ctx.resume();
}

export async function startSound() {
  if (playing) return;
  graph ??= buildGraph();
  const g = graph;
  await g.ctx.resume();

  session = { dry: g.ctx.createGain(), pad: g.ctx.createGain(), fx: g.ctx.createGain() };
  session.dry.connect(g.master);
  session.pad.connect(g.padFilter);
  session.fx.connect(g.delay);

  const now = g.ctx.currentTime;
  g.master.gain.cancelScheduledValues(now);
  g.master.gain.setValueAtTime(Math.max(g.master.gain.value, 0.0001), now);
  g.master.gain.linearRampToValueAtTime(VOLUME, now + 2.5);

  nextBeat = now + 0.1;
  beat = 0;
  playing = true;
  tick();
  timer = setInterval(tick, 60);
  document.addEventListener("visibilitychange", onVisibility);
  savePreference(true);
  emit();
}

export function stopSound() {
  if (!playing || !graph) return;
  const g = graph;
  const s = session;
  playing = false;
  clearInterval(timer);
  document.removeEventListener("visibilitychange", onVisibility);

  const now = g.ctx.currentTime;
  g.master.gain.cancelScheduledValues(now);
  g.master.gain.setValueAtTime(g.master.gain.value, now);
  g.master.gain.linearRampToValueAtTime(0.0001, now + 0.8);
  setTimeout(() => {
    s?.dry.disconnect();
    s?.pad.disconnect();
    s?.fx.disconnect();
    if (!playing) g.ctx.suspend();
  }, 900);
  session = null;
  savePreference(false);
  emit();
}

export function toggleSound() {
  if (playing) stopSound();
  else void startSound();
}

export function isPlaying() {
  return playing;
}

export function subscribeSound(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Output loudness (RMS) in 0..1, read every frame by the 3D core to set its drift speed.
export function getLevel() {
  if (!graph || (!playing && graph.master.gain.value < 0.001)) return 0;
  const { analyser, wave } = graph;
  analyser.getFloatTimeDomainData(wave);
  let sum = 0;
  for (let i = 0; i < wave.length; i++) sum += wave[i] * wave[i];
  return Math.min(1, Math.sqrt(sum / wave.length) / 0.2);
}

function savePreference(on: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {}
}

export function wantsSound() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    return false;
  }
}
