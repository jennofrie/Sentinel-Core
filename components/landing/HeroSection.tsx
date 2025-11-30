"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    // Ensure video autoplays and handles loading
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.warn("Video autoplay failed:", error);
      });
      
      // Preload video to prevent layout shift
      videoRef.current.load();
    }
  }, []);

  const handleVideoError = () => {
    setVideoError(true);
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#0b1021]">
      {/* Tech Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Radial Gradient Overlay for Depth */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(0, 240, 255, 0.1) 0%, transparent 70%)'
        }}
      />

      {/* Main Content Container - Split Screen */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-8rem)]">
          
          {/* Left Side - Text Content */}
          <div className="flex flex-col justify-center space-y-6 lg:space-y-8 order-2 lg:order-1">
            {/* Subtitle */}
            <p className="text-safe-cyan font-semibold text-sm lg:text-base tracking-wider uppercase">
              Today's Enterprise Threat Intelligence Platform
            </p>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight tracking-tight">
              Advanced Blue Team{" "}
              <span className="text-safe-cyan">Intelligence</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-lg lg:text-xl text-slate-300 max-w-xl leading-relaxed">
              Sentinel is the only cost-effective enterprise platform that's built for change. 
              Start analyzing threats in real-time now.
            </p>

            {/* CTA Button */}
            <div className="pt-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-3 px-8 py-4 bg-safe-cyan text-slate-950 font-bold text-base lg:text-lg rounded-lg hover:bg-safe-cyan/90 transition-all duration-300 shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] group"
              >
                Let's talk
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Side - Video Container */}
          <div className="flex justify-center lg:justify-end order-1 lg:order-2">
            <div 
              className="relative w-full max-w-[700px] lg:max-w-[750px] rounded-2xl overflow-hidden"
              style={{
                aspectRatio: '16 / 9',
                boxShadow: '0 0 40px -10px rgba(0, 243, 255, 0.3), 0 0 80px -20px rgba(0, 243, 255, 0.15)',
              }}
            >
              {/* Glassmorphic Border */}
              <div className="absolute inset-0 rounded-2xl border border-safe-cyan/20 bg-gradient-to-br from-safe-cyan/5 to-transparent pointer-events-none z-10" />
              
              {/* Video Element */}
              {!videoError ? (
                <video
                  ref={videoRef}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover rounded-2xl"
                  preload="auto"
                  style={{ aspectRatio: '16 / 9' }}
                  onError={handleVideoError}
                >
                  <source src="/videos/sentinel-demo.mp4" type="video/mp4" />
                </video>
              ) : (
                <div className="w-full h-full bg-slate-900/90 flex items-center justify-center rounded-2xl" style={{ aspectRatio: '16 / 9' }}>
                  <p className="text-slate-500 font-mono text-sm">Video unavailable</p>
                </div>
              )}

              {/* Subtle Inner Glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
