'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useAppContext, APP_STATE } from '@/context/AppContext';

export default function AbstergoSplash() {
    const { currentState, setCurrentState } = useAppContext();
    const splashRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (currentState === APP_STATE.TRANSITION && splashRef.current) {
            gsap.fromTo(splashRef.current, { opacity: 0 }, { opacity: 1, duration: 0.1 });
            
            setTimeout(() => {
                gsap.to(splashRef.current, { 
                    opacity: 0, 
                    duration: 0.8, 
                    onComplete: () => {
                        setCurrentState(APP_STATE.HELIX);
                    }
                });
            }, 3000);
        }
    }, [currentState, setCurrentState]);

    if (currentState !== APP_STATE.TRANSITION) return null;

    return (
        <div id="abstergo-splash" ref={splashRef} style={{ display: 'flex' }}>
            <div className="mono text-red-500 mb-8 tracking-widest text-2xl font-bold shadow-red-500/50 drop-shadow-lg">CRITICAL ERROR: MEMORY OVERRIDE DETECTED</div>
            <div className="glitch-abstergo cinzel text-white">ABSTERGO</div>
            <div className="mono text-white mt-8 tracking-[0.5em] text-xl opacity-80">ENTERTAINMENT OS // SYSTEM HIJACK</div>
        </div>
    );
}
