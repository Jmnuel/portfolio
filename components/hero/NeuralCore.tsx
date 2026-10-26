"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { getLevel } from "@/lib/sound";
import { useTheme } from "@/lib/useTheme";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;
  uniform float uSize;
  uniform float uPixelRatio;
  attribute vec3 aTarget;
  attribute float aRandom;
  varying float vAlpha;

  void main() {
    // Stagger the morph per particle so the shape dissolves rather than snaps.
    float t = smoothstep(aRandom * 0.4, 0.6 + aRandom * 0.4, uMorph);
    vec3 p = mix(position, aTarget, t);

    float wave = sin(p.x * 2.1 + uTime * 0.7) * sin(p.y * 2.4 + uTime * 0.5) * sin(p.z * 1.9 + uTime * 0.6);
    p += normalize(p + 0.0001) * wave * 0.16 * (1.0 - t * 0.6);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (0.5 + aRandom) / -mv.z;

    float depth = smoothstep(9.0, 3.5, -mv.z);
    vAlpha = (0.25 + 0.75 * aRandom) * (0.35 + 0.65 * depth);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.05, d);
    gl_FragColor = vec4(uColor, a * vAlpha);
  }
`;

function buildGeometry(count: number) {
  const positions = new Float32Array(count * 3);
  const targets = new Float32Array(count * 3);
  const randoms = new Float32Array(count);
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    // Fibonacci sphere with a slightly thick shell.
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const shell = 1.55 + (Math.random() - 0.5) * 0.18;
    positions.set([Math.cos(theta) * r * shell, y * shell, Math.sin(theta) * r * shell], i * 3);

    // Target: a two-armed spiral disc, like a galaxy seen at an angle.
    const arm = i % 2;
    const radius = 0.35 + Math.pow(Math.random(), 0.7) * 2.6;
    const angle = radius * 1.6 + arm * Math.PI + (Math.random() - 0.5) * 0.7;
    const spread = 0.12 * (3 - radius);
    targets.set(
      [
        Math.cos(angle) * radius + (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread * 0.8,
        Math.sin(angle) * radius + (Math.random() - 0.5) * spread,
      ],
      i * 3,
    );

    randoms[i] = Math.random();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aTarget", new THREE.BufferAttribute(targets, 3));
  geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));
  return geometry;
}

function Core({ count, color }: { count: number; color: string }) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);
  const { gl } = useThree();

  const geometry = useMemo(() => buildGeometry(count), [count]);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uMorph: { value: 0 },
          uSize: { value: 26 },
          uPixelRatio: { value: 1 },
          uColor: { value: new THREE.Color(color) },
        },
      }),
    // Colour is updated in the effect below, so the material is only built once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    material.uniforms.uColor.value.set(color);
    material.blending = color === "#ffffff" ? THREE.AdditiveBlending : THREE.NormalBlending;
    material.needsUpdate = true;
  }, [color, material]);

  useEffect(() => {
    material.uniforms.uPixelRatio.value = gl.getPixelRatio();
  }, [gl, material]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      scroll.current = Math.min(1, window.scrollY / (window.innerHeight * 0.9));
    };
    onScroll();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  useFrame((state, delta) => {
    const u = material.uniforms;
    // With sound on, louder music makes the particles flow and the core spin a little faster.
    const level = getLevel();
    u.uTime.value += delta * (1 + level * 2.5);
    u.uMorph.value = THREE.MathUtils.damp(u.uMorph.value, scroll.current, 4, delta);
    if (!group.current) return;
    const g = group.current;
    g.rotation.y += delta * (0.08 + level * 0.25);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, pointer.current.y * 0.35 + u.uMorph.value * 0.9, 3, delta);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, -pointer.current.x * 0.25, 3, delta);
    g.position.x = THREE.MathUtils.damp(g.position.x, pointer.current.x * 0.15, 3, delta);
    if (inner.current) {
      inner.current.rotation.x += delta * 0.2;
      inner.current.rotation.y -= delta * 0.15;
      inner.current.scale.setScalar(1 - u.uMorph.value * 0.6);
    }
  });

  return (
    <group ref={group}>
      <points geometry={geometry} material={material} />
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.22} />
      </mesh>
      {[0.35, -0.6].map((tilt, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + tilt, tilt, 0]}>
          <torusGeometry args={[2.25 + i * 0.25, 0.0035, 8, 256]} />
          <meshBasicMaterial color={color} transparent opacity={0.18} />
        </mesh>
      ))}
    </group>
  );
}

export default function NeuralCore() {
  const { theme } = useTheme();
  const wrapper = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  // Phones get fewer particles and a lower pixel ratio to stay smooth on modest GPUs.
  const [small] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);
  const count = small ? 2600 : 9000;

  // Stop rendering once the hero has scrolled out of view.
  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapper} className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 45 }}
        dpr={small ? [1, 1.25] : [1, 1.75]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        frameloop={visible ? "always" : "never"}
      >
        <Core count={count} color={theme === "dark" ? "#ffffff" : "#111111"} />
      </Canvas>
    </div>
  );
}
