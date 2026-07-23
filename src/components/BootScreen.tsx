'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useAppContext, APP_STATE } from '@/context/AppContext';

export default function BootScreen() {
    const { currentState, setCurrentState } = useAppContext();
    const containerRef = useRef<HTMLDivElement>(null);
    const tlRef = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        if (currentState !== APP_STATE.BOOT || !containerRef.current) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline();
            tlRef.current = tl;
            
            // Initial states
            gsap.set('.log-line', { opacity: 0, y: 10, filter: 'blur(4px)' });
            gsap.set('.sync-rings', { scale: 0, opacity: 0, rotation: -90 });
            gsap.set('.sync-btn', { opacity: 0, y: 20 });
            gsap.set('.connecting-text', { opacity: 0 });

            // Entrance Choreography
            tl.to('.log-line', {
                opacity: 0.7,
                y: 0,
                filter: 'blur(0px)',
                stagger: 0.15,
                duration: 0.8,
                ease: 'power2.out',
                delay: 0.5
            })
            .to('.sync-rings', {
                scale: 1,
                opacity: 1,
                rotation: 0,
                duration: 1.2,
                ease: 'expo.out'
            }, '-=0.4')
            .to('.sync-btn', {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.6')
            .to('.connecting-text', {
                opacity: 1,
                duration: 0.6,
                yoyo: true,
                repeat: -1,
                ease: 'power1.inOut'
            }, '-=0.2');
        }, containerRef);

        return () => ctx.revert();
    }, [currentState]);

    const handleSync = () => {
        // Exit Choreography
        if (tlRef.current) {
            tlRef.current.kill();
        }
        
        const exitTl = gsap.timeline({
            onComplete: () => setCurrentState(APP_STATE.LORE)
        });

        exitTl.to('.sync-btn', { opacity: 0, scale: 0.9, duration: 0.4, ease: 'power2.in' })
              .to('.sync-rings', { scale: 2, opacity: 0, duration: 0.6, ease: 'expo.in' }, '<')
              .to('.log-line, .connecting-text', { opacity: 0, duration: 0.4 }, '-=0.4')
              .to(containerRef.current, { backgroundColor: 'transparent', duration: 0.4 });
    };

    if (currentState !== APP_STATE.BOOT) return null;

    return (
        <div ref={containerRef} className="fixed inset-0 z-[100] bg-[#020406] flex flex-col justify-center items-center">
            <div className="absolute top-8 left-8 text-[#00e5ff] font-['Share_Tech_Mono'] text-xs tracking-widest text-left opacity-70 h-[30vh] overflow-hidden" style={{ maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }}>
                <div className="log-line mb-1">[SYSTEM] INITIALIZING ANIMUS PROXY...</div>
                <div className="log-line mb-1">[SYSTEM] ESTABLISHING NEURAL LINK...</div>
                <div className="log-line mb-1">[SYSTEM] BYPASSING ABSTERGO FIREWALLS...</div>
                <div className="log-line mb-1">[SYSTEM] CALIBRATING SPATIAL DEPTH...</div>
            </div>
            
            <div className="sync-rings relative w-[150px] h-[150px] mb-12">
                <svg viewBox="0 0 100 100" className="absolute inset-0 fill-none stroke-[#00e5ff] stroke-1 opacity-50" style={{ strokeDasharray: '2 10' }}>
                    <circle cx="50" cy="50" r="45" />
                </svg>
                <svg viewBox="0 0 100 100" className="absolute inset-0 fill-none stroke-[#00e5ff] stroke-2" style={{ strokeDasharray: '40 100' }}>
                    <circle cx="50" cy="50" r="35" />
                </svg>
                <svg viewBox="0 0 100 100" className="absolute inset-0 fill-none stroke-[#00e5ff] stroke-[3px]" style={{ strokeDasharray: '10 30' }}>
                    <circle cx="50" cy="50" r="25" />
                </svg>
                <div className="absolute inset-[30%] border border-[#00e5ff] rounded-full flex items-center justify-center">
                    <div className="w-1/2 h-1/2 bg-[#00e5ff] rounded-full opacity-50"></div>
                </div>
            </div>

            <button 
                className="sync-btn interactive bg-transparent border border-[rgba(255,255,255,0.08)] text-[#f0f4f8] px-12 py-5 text-sm tracking-[0.3em] font-['Share_Tech_Mono'] uppercase transition-colors hover:bg-[rgba(0,229,255,0.1)] hover:border-[#00e5ff] hover:text-[#00e5ff] backdrop-blur-md"
                onClick={handleSync}
            >
                Initiate Synchronization
            </button>
            <div className="connecting-text font-['Share_Tech_Mono'] text-[rgba(240,244,248,0.4)] mt-8 text-xs tracking-[0.5em]">CONNECTING TO HOST...</div>
        </div>
    );
}
