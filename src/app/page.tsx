"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";

export default function SplashPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [showEnter, setShowEnter] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);
    scene.fog = new THREE.FogExp2(0x020617, 0.008);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.5, 12);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // --- Core: Glowing sphere ---
    const coreGeo = new THREE.SphereGeometry(0.7, 64, 64);
    const coreMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x1e3a8a, emissiveIntensity: 0.8, metalness: 0.9, roughness: 0.2 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // --- Inner ring (horizontal) ---
    const innerRingGeo = new THREE.TorusGeometry(1.1, 0.06, 64, 200);
    const innerRingMat = new THREE.MeshStandardMaterial({ color: 0x60a5fa, emissive: 0x2563eb, metalness: 0.8 });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    scene.add(innerRing);

    // --- Outer ring (tilted) ---
    const outerRingGeo = new THREE.TorusGeometry(1.5, 0.08, 96, 300);
    const outerRingMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, emissive: 0x6d28d9, metalness: 0.9 });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.rotation.x = Math.PI / 2;
    outerRing.rotation.z = Math.PI / 4;
    scene.add(outerRing);

    // --- Orbiting particles (spheres around) ---
    const orbCount = 12;
    const orbs = [];
    for (let i = 0; i < orbCount; i++) {
      const orbGeo = new THREE.SphereGeometry(0.08, 16, 16);
      const orbMat = new THREE.MeshStandardMaterial({ color: 0xa78bfa, emissive: 0x7c3aed });
      const orb = new THREE.Mesh(orbGeo, orbMat);
      scene.add(orb);
      orbs.push(orb);
    }

    // --- Starfield particles (background) ---
    const starCount = 1500;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i*3] = (Math.random() - 0.5) * 200;
      starPos[i*3+1] = (Math.random() - 0.5) * 120;
      starPos[i*3+2] = (Math.random() - 0.5) * 100 - 50;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, transparent: true, opacity: 0.6 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // --- Floating dust particles (colorful) ---
    const dustCount = 800;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i*3] = (Math.random() - 0.5) * 12;
      dustPos[i*3+1] = (Math.random() - 0.5) * 8;
      dustPos[i*3+2] = (Math.random() - 0.5) * 10;
      dustColors[i*3] = Math.random() * 0.8 + 0.2;
      dustColors[i*3+1] = Math.random() * 0.6 + 0.4;
      dustColors[i*3+2] = Math.random() * 0.9 + 0.1;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    dustGeo.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));
    const dustMat = new THREE.PointsMaterial({ size: 0.04, vertexColors: true, transparent: true, opacity: 0.5 });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // --- Lights ---
    const ambient = new THREE.AmbientLight(0x1e1b4b);
    scene.add(ambient);
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(2, 3, 4);
    scene.add(mainLight);
    const fillLight = new THREE.PointLight(0x3b82f6, 0.7);
    fillLight.position.set(-1, 1, 2);
    scene.add(fillLight);
    const backLight = new THREE.PointLight(0x8b5cf6, 0.6);
    backLight.position.set(0, 0, -5);
    scene.add(backLight);
    const rimLight = new THREE.PointLight(0xf472b6, 0.5);
    rimLight.position.set(1.5, 1.5, 3);
    scene.add(rimLight);

    // Animation variables
    let time = 0;
    let cameraAngle = 0;
    let cameraRadius = 11;
    let cameraHeight = 1.6;

    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;
      cameraAngle += 0.002;

      // Rotate rings
      innerRing.rotation.z = time * 0.6;
      outerRing.rotation.x = Math.sin(time * 0.4) * 0.5 + Math.PI / 2;
      outerRing.rotation.y = time * 0.3;

      // Orbit spheres around the core
      orbs.forEach((orb, idx) => {
        const angle = time * 1.2 + (idx * Math.PI * 2 / orbCount);
        const radius = 1.9;
        orb.position.x = Math.cos(angle) * radius;
        orb.position.z = Math.sin(angle) * radius;
        orb.position.y = Math.sin(angle * 1.5) * 0.4;
      });

      // Gentle camera movement (subtle orbit)
      camera.position.x = Math.sin(cameraAngle) * cameraRadius;
      camera.position.z = Math.cos(cameraAngle) * cameraRadius;
      camera.position.y = cameraHeight + Math.sin(cameraAngle * 1.5) * 0.2;
      camera.lookAt(0, 0, 0);

      // Rotate starfield and dust slowly
      stars.rotation.y += 0.0003;
      dust.rotation.x += 0.001;
      dust.rotation.y += 0.0008;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    const timer = setTimeout(() => setShowEnter(true), 1800);
    const autoRedirect = setTimeout(() => router.push('/dashboard'), 6000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
      clearTimeout(autoRedirect);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [router]);

  const goToDashboard = () => router.push('/dashboard');

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div ref={containerRef} className="absolute inset-0" />
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse tracking-wide">
          hundredxmedical
        </h1>
        <p className="text-gray-300 mt-3 text-lg md:text-xl opacity-90">bekartikrawat welcomes you</p>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-4 animate-pulse" />
      </div>
      {showEnter && (
        <div className="absolute bottom-20 left-0 right-0 flex justify-center z-20">
          <button
            onClick={goToDashboard}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-lg font-semibold rounded-full shadow-2xl hover:scale-105 transition-transform duration-300 animate-bounce backdrop-blur-sm"
          >
            Enter Mediverse ➜
          </button>
        </div>
      )}
    </div>
  );
}
