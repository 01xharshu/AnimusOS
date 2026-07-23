'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useAppContext, APP_STATE } from '@/context/AppContext';

export default function AbstergoSplash() {
    const { currentState, setCurrentState } = useAppContext();
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (currentState !== APP_STATE.TRANSITION || !containerRef.current) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline();
            
            // Optical Entrance
            tl.set(containerRef.current, { opacity: 1 })
              .fromTo(textRef.current, 
                  { scale: 1.5, opacity: 0, filter: 'blur(20px)' },
                  { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.5, ease: 'power4.out' }
              )
              // Micro-glitch stutters
              .to(textRef.current, { x: 5, duration: 0.05, yoyo: true, repeat: 5 }, "+=0.2")
              .to(textRef.current, { x: -5, duration: 0.05, yoyo: true, repeat: 3 })
              .to(textRef.current, { x: 0, duration: 0.05 })
              // Hold and fade
              .to(containerRef.current, {
                  opacity: 0,
                  duration: 0.8,
                  ease: 'power2.in',
                  delay: 1.5,
                  onComplete: () => setCurrentState(APP_STATE.HELIX)
              });
        }, containerRef);

        return () => ctx.revert();
    }, [currentState, setCurrentState]);

    if (currentState !== APP_STATE.TRANSITION) return null;

    return (
        <div ref={containerRef} className="fixed inset-0 z-[100] bg-black flex flex-col justify-center items-center text-white overflow-hidden opacity-0 pointer-events-none">
            <div ref={textRef} className="flex flex-col items-center">
                <div className="font-['Share_Tech_Mono'] text-[#ff2a2a] mb-8 tracking-[0.4em] text-xl md:text-2xl font-bold" style={{ textShadow: '0 0 20px rgba(255,42,42,0.5)' }}>CRITICAL ERROR: MEMORY OVERRIDE DETECTED</div>
                <div className="cinematic-display text-[6rem] md:text-[8rem] font-bold tracking-[0.3em] relative" style={{ textShadow: '4px 0 #0055ff, -4px 0 #ff2a2a' }}>ABSTERGO</div>
                <div className="font-['Share_Tech_Mono'] text-white mt-8 tracking-[0.5em] text-lg md:text-xl opacity-80 uppercase">ENTERTAINMENT OS // SYSTEM HIJACK</div>
            </div>
        </div>
    );
}
