'use client';

import React, { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  Float,
  useGLTF,
  ContactShadows,
  MeshDistortMaterial,
  Html,
  Text,
  PresentationControls
} from '@react-three/drei';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import {
  Truck,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  Activity,
  ChevronRight,
  Zap,
  Globe,
  Lock,
  Users,
  Layers,
  Search,
  Menu,
  X,
  CreditCard
} from 'lucide-react';
import * as THREE from 'three';

// --- STYLES & UTILS ---
const glassStyle = "bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]";

// --- 3D TRUCK MODEL ---
const TruckModel = () => {
  const [error, setError] = useState(false);
  let scene;

  try {
    // Using a reliable public low-poly truck model
    const gltf = useGLTF('https://market-assets.fra1.digitaloceanspaces.com/market-assets/models/low-poly-truck/model.gltf', true);
    scene = gltf.scene;
  } catch (e) {
    if (!error) setError(true);
  }

  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  if (error || !scene) {
    return (
      <mesh ref={ref}>
        <octahedronGeometry args={[2, 2]} />
        <MeshDistortMaterial color="#3b82f6" speed={3} distort={0.5} />
      </mesh>
    );
  }

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={3.2}
      position={[0, -1.2, 0]}
      rotation={[0, -Math.PI / 4, 0]}
    />
  );
};

// --- ERROR BOUNDARY ---
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// --- 3D FLOATING LOGISTICS ICON ---
const FloatingIcon = () => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime()) * 0.2;
      meshRef.current.rotation.y = Math.cos(state.clock.getElapsedTime() * 0.8) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <MeshDistortMaterial color="#3b82f6" speed={2} distort={0.4} />
    </mesh>
  );
};

// --- TILT CARD WRAPPER ---
const TiltContainer = ({ children, className = "" }) => {
  const ref = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotX = (y - centerY) / 10;
    const rotY = (centerX - x) / 10;
    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ perspective: 1000, transformStyle: "preserve-3d" }}
      className={`relative ${className}`}
    >
      {children}
    </motion.div>
  );
};



// --- 3D WATER BACKGROUND ---
const WaterBackground = () => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <Float
      speed={0.8}
      rotationIntensity={0.2}
      floatIntensity={0.5}
      floatingRange={[-1, 1]}
    >
      <mesh ref={meshRef} position={[0, 0, -12]} scale={[16, 16, 16]}>
        <sphereGeometry args={[1, 160, 160]} />
        <MeshDistortMaterial
          color="#0a1a3a"
          speed={0.8}
          distort={0.2}
          radius={1}
          metalness={1}
          roughness={0}
          opacity={0.3}
          transparent
        />
      </mesh>
    </Float>
  );
};

const HeroThreeScene = () => {
  return (
    <div className="absolute inset-0 z-0">
      <ErrorBoundary fallback={
        <div className="absolute inset-0 flex items-center justify-center bg-blue-900/5">
          <div className="w-32 h-32 rounded-full border border-blue-500/20 blur-xl animate-pulse"></div>
        </div>
      }>
        <Canvas shadows dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={35} />
          <ambientLight intensity={0.4} />
          <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={1.2} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />

          <Suspense fallback={null}>
            <WaterBackground />
            <PresentationControls
              global
              config={{ mass: 2, tension: 500 }}
              snap={{ mass: 4, tension: 1500 }}
              rotation={[0, 0.3, 0]}
              polar={[-Math.PI / 3, Math.PI / 3]}
              azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
            >
              <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.4}>
                <TruckModel />
              </Float>
            </PresentationControls>

            <ContactShadows position={[0, -2.5, 0]} opacity={0.3} scale={20} blur={2.5} far={4.5} />
            <Environment preset="night" />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
};

// --- COMPONENTS ---
const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 px-8 h-20 flex items-center justify-between backdrop-blur-xl bg-black/40">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] relative group cursor-pointer">
        <Truck className="text-white group-hover:scale-110 transition-transform" size={20} />
        <div className="absolute inset-0 bg-blue-400 blur-lg opacity-0 group-hover:opacity-40 transition-opacity"></div>
      </div>
      <span className="text-2xl font-black tracking-tighter uppercase italic text-white leading-none">FleetFlow</span>
    </div>

    <div className="flex items-center gap-4">
      <a href="/login" className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-blue-600 hover:text-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-blue-600/40">
        Command Center
      </a>
    </div>
  </nav>
);

const featureData = [
  {
    title: "Fleet Lifecycle Optimization",
    icon: <Activity className="text-blue-400" size={24} />,
    desc: "Advanced predictive maintenance algorithms and real-time lifecycle tracking for maximum ROI."
  },
  {
    title: "Real-Time Financial Analytics",
    icon: <BarChart3 className="text-indigo-400" size={24} />,
    desc: "Granular cost-per-km tracking and automated expense reconciliation for your entire logistics network."
  },
  {
    title: "Driver Safety & Compliance",
    icon: <ShieldCheck className="text-teal-400" size={24} />,
    desc: "Rule-based safety audits and driver performance monitoring integrated with biometric safeguards."
  }
];

export default function Home() {
  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <main className="min-h-screen bg-[#020202] text-white selection:bg-blue-500/30 overflow-x-hidden">

      <Navbar />

      {/* HERO SECTION */}
      <header className="relative min-h-screen pt-20 flex flex-col items-center justify-center px-8 lg:px-20">
        <HeroThreeScene />

        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center pt-20"
          >
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 border border-blue-500/20 bg-blue-500/5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
              The Standard of Intelligence
            </div>

            <h1 className="text-7xl md:text-[110px] font-black tracking-tighter leading-[0.85] mb-8 uppercase italic">
              Next-Gen <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-600 bg-clip-text text-transparent">Fleet Intelligence.</span>
            </h1>

            <p className="text-neutral-500 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed font-light mx-auto">
              Replace inefficient, manual logbooks with a centralized, rule-based digital hub that optimizes the lifecycle of your delivery fleet, monitors driver safety, and tracks financial performance.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/login"
                className="group relative px-10 py-5 bg-blue-600 rounded-2xl font-black text-[12px] uppercase tracking-widest text-white shadow-[0_15px_40px_-5px_rgba(37,99,235,0.4)] overflow-hidden transition-all"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative z-10 flex items-center gap-3">
                  Enter Command Center <ArrowRight size={18} />
                </span>
              </motion.a>

              <a href="#features" className="px-10 py-5 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 rounded-2xl font-black text-[12px] uppercase tracking-widest text-white/80 transition-all backdrop-blur-xl">
                Learn More
              </a>
            </div>
          </motion.div>
        </div>

        {/* SCROLL INDICATOR */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-600">Explore System</span>
          <div className="w-px h-10 bg-gradient-to-b from-blue-600/50 to-transparent"></div>
        </motion.div>
      </header>

      {/* 3D FEATURE CARDS SECTION */}
      <section id="features" className="relative py-40 px-8 max-w-7xl mx-auto z-10">
        <div className="text-center mb-32">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-6"
          >
            Engineered for <span className="bg-blue-600 px-4 py-1 text-black not-italic ml-2">Scale.</span>
          </motion.h2>
          <p className="text-neutral-500 text-lg uppercase tracking-widest font-black">Industrial Grade Infrastructure</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {featureData.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <TiltContainer className="h-full">
                <div className={`${glassStyle} h-full p-1 rounded-[2rem] group hover:border-blue-500/30 transition-colors duration-500`}>
                  <div className="bg-neutral-950/80 rounded-[1.8rem] p-10 h-full flex flex-col border border-white/5 group-hover:bg-neutral-900/40 transition-colors">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(37,99,235,0.2)] transition-all">
                      {f.icon}
                    </div>
                    <h3 className="text-2xl font-black uppercase mb-4 tracking-tight leading-none">{f.title}</h3>
                    <p className="text-neutral-500 leading-relaxed mb-auto font-medium text-sm">{f.desc}</p>

                  </div>

                  {/* DEPTH SHADOW GLOW */}
                  <div className="absolute inset-x-10 -bottom-5 h-5 bg-blue-600/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </TiltContainer>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="relative px-8 py-40 border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-10">
          <Truck className="w-[800px] h-[800px] text-blue-900 -rotate-12" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(37,99,235,0.4)]">
            <Layers className="text-white" size={32} />
          </div>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-10 italic">Ready to optimize your global operations?</h2>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/login"
            className="inline-flex items-center gap-4 px-14 py-6 bg-white text-black font-black uppercase tracking-[0.2em] italic text-sm rounded-full shadow-[0_20px_60px_rgba(255,255,255,0.2)] hover:bg-blue-600 hover:text-white transition-all"
          >
            Initialize Command Center <ChevronRight size={20} />
          </motion.a>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="relative py-20 px-8 border-t border-white/5 z-10 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-3">
              <Truck className="text-blue-600" size={20} />
              <span className="text-xl font-black uppercase tracking-tighter italic">FleetFlow</span>
            </div>
            <p className="text-neutral-600 text-[9px] font-black uppercase tracking-[0.3em]">Advanced Logistics Intelligence Engine</p>
          </div>

          <p className="text-neutral-500 text-[9px] font-black uppercase tracking-[0.4em] text-center md:text-right">
            © 2024 Global Systems Division. All Rights Reserved. <br />
            <span className="text-blue-950">Encrypted Communication Protocol v4.2</span>
          </p>
        </div>
      </footer>
    </main>
  );
}
