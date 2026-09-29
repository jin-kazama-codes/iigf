import React, { useEffect, useRef } from 'react';
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

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      1000
    );

    const updateCameraDistance = (width: number, height: number) => {
      if (width <= 0 || height <= 0) return;
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

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    updateCameraDistance(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Group for all rotating elements
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Colors Configuration based on Variant & Theme
    const isGold = variant === 'gold';

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
    const sphereGeo = new THREE.IcosahedronGeometry(52, 3);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: outerColor,
      wireframe: true,
      transparent: true,
      opacity: isDark ? (isGold ? 0.35 : 0.32) : 0.52,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(sphere);

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

    // 3. Floating Particle Cloud
    const particleCount = 260;
    const particleGeometry = new THREE.BufferGeometry();
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

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

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

    const particleMaterial = new THREE.PointsMaterial({
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
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
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
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          updateCameraDistance(width, height);
        }
      }
    });

    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      particleTexture.dispose();
    };
  }, [variant, isDark]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full pointer-events-none select-none ${className}`}
      aria-hidden="true"
    />
  );
};
