"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface ThreeHolographicSphereProps {
  variant?: "gold" | "cyan";
  isSpeaking?: boolean;
  isDark?: boolean;
  className?: string;
}

export const ThreeHolographicSphere: React.FC<ThreeHolographicSphereProps> = ({
  variant = "cyan",
  isSpeaking = false,
  isDark = true,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isSpeakingRef = useRef(isSpeaking);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let resizeObserver: ResizeObserver | null = null;

    let sphereGeo: THREE.IcosahedronGeometry | null = null;
    let sphereMat: THREE.MeshBasicMaterial | null = null;
    let innerGeo: THREE.IcosahedronGeometry | null = null;
    let innerMat: THREE.MeshBasicMaterial | null = null;
    let particleGeometry: THREE.BufferGeometry | null = null;
    let particleMaterial: THREE.PointsMaterial | null = null;
    let particleTexture: THREE.CanvasTexture | null = null;

    try {
      const initialWidth = container.clientWidth > 0 ? container.clientWidth : 360;
      const initialHeight = container.clientHeight > 0 ? container.clientHeight : 360;

      // Scene, Camera, Renderer
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        42,
        initialWidth / Math.max(initialHeight, 1),
        0.1,
        1000
      );

      const updateCameraDistance = (width: number, height: number) => {
        if (!camera || !renderer) return;
        const w = width > 0 ? width : 360;
        const h = height > 0 ? height : 360;
        const aspect = w / h;
        camera.aspect = aspect;
        // If width is narrower than height, adjust camera distance so the horizontal bounds never clip
        if (aspect < 1) {
          camera.position.z = Math.min(360, 260 / aspect);
        } else {
          camera.position.z = 260;
        }
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2));
      updateCameraDistance(initialWidth, initialHeight);
      container.appendChild(renderer.domElement);

      // Group for all rotating elements
      const globeGroup = new THREE.Group();
      scene.add(globeGroup);

      // ── Colors Configuration based on Variant & Theme ──────────────────────
      const isGold = variant === "gold";

      const outerColor = isDark
        ? (isGold ? 0xdfb74a : 0x38bdf8)
        : (isGold ? 0xb45309 : 0x0284c7);

      const innerColor = isDark
        ? (isGold ? 0xf59e0b : 0x6366f1)
        : (isGold ? 0xd97706 : 0x4338ca);

      const colors = isDark
        ? (isGold
            ? [
                new THREE.Color(0xdfb74a), // Gold
                new THREE.Color(0xf59e0b), // Amber
                new THREE.Color(0xfef08a), // Bright Yellow
                new THREE.Color(0xf97316), // Orange
              ]
            : [
                new THREE.Color(0x38bdf8), // Sky blue
                new THREE.Color(0x6366f1), // Indigo
                new THREE.Color(0x10b981), // Emerald
                new THREE.Color(0xf59e0b), // Amber
              ])
        : (isGold
            ? [
                new THREE.Color(0xb45309), // Deep Amber
                new THREE.Color(0xd97706), // Warm Gold
                new THREE.Color(0x78350f), // Dark Gold
                new THREE.Color(0xea580c), // Rich Orange
              ]
            : [
                new THREE.Color(0x0284c7), // Ocean Blue
                new THREE.Color(0x4338ca), // Deep Indigo
                new THREE.Color(0x0f766e), // Dark Teal
                new THREE.Color(0x7c3aed), // Violet
              ]);

      // 1. Central Wireframe Icosahedron Sphere
      sphereGeo = new THREE.IcosahedronGeometry(52, 3);
      sphereMat = new THREE.MeshBasicMaterial({
        color: outerColor,
        wireframe: true,
        transparent: true,
        opacity: isDark ? (isGold ? 0.32 : 0.28) : 0.52,
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      globeGroup.add(sphere);

      // 2. Inner Glowing Core
      innerGeo = new THREE.IcosahedronGeometry(30, 2);
      innerMat = new THREE.MeshBasicMaterial({
        color: innerColor,
        wireframe: true,
        transparent: true,
        opacity: isDark ? (isGold ? 0.5 : 0.45) : 0.68,
      });
      const innerSphere = new THREE.Mesh(innerGeo, innerMat);
      globeGroup.add(innerSphere);

      // 3. Floating Particle Cloud
      const particleCount = 260;
      particleGeometry = new THREE.BufferGeometry();
      const particlePositions = new Float32Array(particleCount * 3);
      const particleColors = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        const radius = 56 + Math.random() * 32;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        particlePositions[i * 3] = x;
        particlePositions[i * 3 + 1] = y;
        particlePositions[i * 3 + 2] = z;

        const c = colors[Math.floor(Math.random() * colors.length)];
        particleColors[i * 3] = c.r;
        particleColors[i * 3 + 1] = c.g;
        particleColors[i * 3 + 2] = c.b;
      }

      particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
      particleGeometry.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

      // Particle texture
      const canvas = document.createElement("canvas");
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        grad.addColorStop(0, "rgba(255,255,255,1)");
        grad.addColorStop(0.4, "rgba(255,255,255,0.8)");
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(8, 8, 8, 0, Math.PI * 2);
        ctx.fill();
      }
      particleTexture = new THREE.CanvasTexture(canvas);

      particleMaterial = new THREE.PointsMaterial({
        size: 4.5,
        map: particleTexture,
        transparent: true,
        opacity: 0.85,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const particles = new THREE.Points(particleGeometry, particleMaterial);
      globeGroup.add(particles);

      // Animation Loop
      const clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        if (!renderer || !scene || !camera) return;

        const elapsedTime = clock.getElapsedTime();
        const speaking = isSpeakingRef.current;

        // Speed boost when speaking
        const speedMult = speaking ? 1.6 : 1.0;

        // Autonomous continuous rotation
        globeGroup.rotation.y = elapsedTime * 0.18 * speedMult;
        globeGroup.rotation.x = Math.sin(elapsedTime * 0.12) * 0.14;

        innerSphere.rotation.y = -elapsedTime * 0.32 * speedMult;
        particles.rotation.y = -elapsedTime * 0.08 * speedMult;

        // Subtle breath/pulse on active speaking
        const targetScale = speaking ? 1.06 + Math.sin(elapsedTime * 8) * 0.03 : 1.0;
        globeGroup.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

        renderer.render(scene, camera);
      };

      animate();

      // Resize Handler with ResizeObserver
      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            const { width, height } = entry.contentRect;
            if (width > 0 && height > 0) {
              updateCameraDistance(width, height);
            }
          }
        });

        resizeObserver.observe(container);
      }
    } catch (err) {
      console.warn("ThreeHolographicSphere WebGL initialized fallback:", err);
      setHasWebGL(false);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (resizeObserver) resizeObserver.disconnect();
      if (renderer && container && container.contains(renderer.domElement)) {
        try {
          container.removeChild(renderer.domElement);
        } catch {}
      }
      if (renderer) {
        try { renderer.dispose(); } catch {}
      }
      try { sphereGeo?.dispose(); } catch {}
      try { sphereMat?.dispose(); } catch {}
      try { innerGeo?.dispose(); } catch {}
      try { innerMat?.dispose(); } catch {}
      try { particleGeometry?.dispose(); } catch {}
      try { particleMaterial?.dispose(); } catch {}
      try { particleTexture?.dispose(); } catch {}
    };
  }, [variant, isDark]);

  if (!hasWebGL) {
    const isGold = variant === "gold";
    return (
      <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
        <div 
          className={`w-64 h-64 rounded-full border-2 border-dashed animate-spin ${
            isGold ? "border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.5)]" : "border-cyan-400 shadow-[0_0_35px_rgba(0,240,255,0.5)]"
          }`}
          style={{ animationDuration: isSpeaking ? "4s" : "12s" }}
        >
          <div className={`w-full h-full rounded-full flex items-center justify-center ${isGold ? "bg-amber-500/10" : "bg-cyan-500/10"}`}>
            <div className={`w-40 h-40 rounded-full border border-dotted ${isGold ? "border-amber-300" : "border-cyan-300"} animate-ping`} style={{ animationDuration: "3s" }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full pointer-events-none select-none ${className}`}
      aria-hidden="true"
    />
  );
};
