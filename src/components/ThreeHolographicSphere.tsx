import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeHolographicSphereProps {
  variant?: 'gold' | 'cyan';
  isSpeaking?: boolean;
  isDark?: boolean;
  className?: string;
}

export const ThreeHolographicSphere: React.FC<ThreeHolographicSphereProps> = ({
  variant = 'cyan',
  isSpeaking = false,
  isDark = true,
  className = '',
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

    // Disposables tracking
    const disposables: Array<{ dispose: () => void }> = [];

    try {
      const initialWidth = container.clientWidth || 320;
      const initialHeight = container.clientHeight || 320;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        42,
        initialWidth / Math.max(initialHeight, 1),
        0.1,
        1000
      );

      const updateCameraDistance = (width: number, height: number) => {
        if (!camera || !renderer || width <= 0 || height <= 0) return;
        const aspect = width / height;
        camera.aspect = aspect;
        if (aspect < 1) {
          camera.position.z = Math.min(360, 260 / aspect);
        } else {
          camera.position.z = 260;
        }
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'default',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      updateCameraDistance(initialWidth, initialHeight);
      container.appendChild(renderer.domElement);

      const globeGroup = new THREE.Group();
      scene.add(globeGroup);

      const isGold = variant === 'gold';
      const outerColor = isDark
        ? (isGold ? 0xdfb74a : 0x38bdf8)
        : (isGold ? 0xb45309 : 0x0284c7);

      const innerColor = isDark
        ? (isGold ? 0xf59e0b : 0x6366f1)
        : (isGold ? 0xd97706 : 0x4338ca);

      const colors = isDark
        ? (isGold
            ? [new THREE.Color(0xdfb74a), new THREE.Color(0xf59e0b), new THREE.Color(0xfef08a), new THREE.Color(0xf97316)]
            : [new THREE.Color(0x38bdf8), new THREE.Color(0x6366f1), new THREE.Color(0x10b981), new THREE.Color(0xf59e0b)])
        : (isGold
            ? [new THREE.Color(0xb45309), new THREE.Color(0xd97706), new THREE.Color(0x78350f), new THREE.Color(0xea580c)]
            : [new THREE.Color(0x0284c7), new THREE.Color(0x4338ca), new THREE.Color(0x0f766e), new THREE.Color(0x7c3aed)]);

      // 1. Central Wireframe Icosahedron Sphere
      const sphereGeo = new THREE.IcosahedronGeometry(52, 3);
      const sphereMat = new THREE.MeshBasicMaterial({
        color: outerColor,
        wireframe: true,
        transparent: true,
        opacity: isDark ? (isGold ? 0.35 : 0.32) : 0.52,
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      globeGroup.add(sphere);
      disposables.push(sphereGeo, sphereMat);

      // 2. Inner Glowing Core
      const innerGeo = new THREE.IcosahedronGeometry(30, 2);
      const innerMat = new THREE.MeshBasicMaterial({
        color: innerColor,
        wireframe: true,
        transparent: true,
        opacity: isDark ? (isGold ? 0.52 : 0.48) : 0.68,
      });
      const innerSphere = new THREE.Mesh(innerGeo, innerMat);
      globeGroup.add(innerSphere);
      disposables.push(innerGeo, innerMat);

      // 3. Floating Particle Cloud
      const particleCount = 200;
      const particleGeometry = new THREE.BufferGeometry();
      const particlePositions = new Float32Array(particleCount * 3);
      const particleColors = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        const radius = 56 + Math.random() * 30;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);

        particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        particlePositions[i * 3 + 2] = radius * Math.cos(phi);

        const c = colors[Math.floor(Math.random() * colors.length)];
        particleColors[i * 3] = c.r;
        particleColors[i * 3 + 1] = c.g;
        particleColors[i * 3 + 2] = c.b;
      }

      particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
      particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
      disposables.push(particleGeometry);

      // Particle texture
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        grad.addColorStop(0, 'rgba(255,255,255,1)');
        grad.addColorStop(0.4, 'rgba(255,255,255,0.8)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(8, 8, 8, 0, Math.PI * 2);
        ctx.fill();
      }
      const particleTexture = new THREE.CanvasTexture(canvas);
      disposables.push(particleTexture);

      const particleMaterial = new THREE.PointsMaterial({
        size: 4.5,
        map: particleTexture,
        transparent: true,
        opacity: 0.85,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      disposables.push(particleMaterial);

      const particles = new THREE.Points(particleGeometry, particleMaterial);
      globeGroup.add(particles);

      // Animation Loop
      const clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        if (!renderer || !scene || !camera) return;

        const elapsedTime = clock.getElapsedTime();
        const speaking = isSpeakingRef.current;
        const speedMult = speaking ? 1.6 : 1.0;

        globeGroup.rotation.y = elapsedTime * 0.18 * speedMult;
        globeGroup.rotation.x = Math.sin(elapsedTime * 0.12) * 0.14;
        innerSphere.rotation.y = -elapsedTime * 0.32 * speedMult;
        particles.rotation.y = -elapsedTime * 0.08 * speedMult;

        const targetScale = speaking ? 1.06 + Math.sin(elapsedTime * 8) * 0.03 : 1.0;
        globeGroup.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

        renderer.render(scene, camera);
      };

      animate();

      // Resize observer
      if (typeof ResizeObserver !== 'undefined') {
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
      console.warn('Three.js WebGL fallback activated:', err);
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
        try {
          renderer.dispose();
        } catch {}
      }
      disposables.forEach((item) => {
        try {
          item.dispose();
        } catch {}
      });
    };
  }, [variant, isDark]);

  if (!hasWebGL) {
    // Pure CSS Holographic Glowing Sphere Fallback
    const isGold = variant === 'gold';
    return (
      <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
        <div 
          className={`w-48 h-48 rounded-full border-2 border-dashed animate-spin ${
            isGold ? 'border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.5)]' : 'border-cyan-400 shadow-[0_0_35px_rgba(0,240,255,0.5)]'
          }`}
          style={{ animationDuration: isSpeaking ? '4s' : '10s' }}
        >
          <div className={`w-full h-full rounded-full flex items-center justify-center ${isGold ? 'bg-amber-500/10' : 'bg-cyan-500/10'}`}>
            <div className={`w-28 h-28 rounded-full border border-dotted ${isGold ? 'border-amber-300' : 'border-cyan-300'} animate-ping`} style={{ animationDuration: '3s' }} />
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
