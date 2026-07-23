'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useAppContext, APP_STATE } from '@/context/AppContext';
import { loreData } from '@/data/loreData';
import { getMaleVoice } from '@/utils/audioUtils';
import { mulberry32, stringToSeed } from '@/utils/mathUtils';

export default function LoreLayer() {
    const { currentState, setCurrentState, currentLoreIndex, setCurrentLoreIndex } = useAppContext();
    const containerRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (currentState !== APP_STATE.LORE) return;
        
        const data = loreData[currentLoreIndex];
        
        // Decrypt text effect
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
        const decrypt = (finalString: string, setFn: (val: string) => void, duration: number = 1200) => {
            const random = mulberry32(stringToSeed(data.id));
            let iterations = 0;
            const maxIterations = finalString.length * 2;
            const intervalDuration = duration / maxIterations;

            const interval = setInterval(() => {
                setFn(finalString.split('').map((char, index) => {
                    if (index < iterations / 2) return char;
                    if (char === ' ') return ' ';
                    return chars[Math.floor(random() * chars.length)];
                }).join(''));

                if (iterations >= maxIterations) {
                    clearInterval(interval);
                    setFn(finalString);
                }
                iterations++;
            }, intervalDuration);
            return interval;
        };

        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            // Prepare elements for animation
            gsap.set(cardRef.current, { opacity: 0, y: 48, scale: 0.98, filter: 'blur(8px)' });
            if (titleRef.current) gsap.set(titleRef.current.children, { y: '110%' });
            if (textRef.current) gsap.set(textRef.current, { opacity: 0 });
            
            setTitle(data.title);

            // Cinematic reveal
            tl.to(cardRef.current, {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: 'blur(0px)',
                duration: 1.2,
                ease: 'power3.out'
            })
            .to(titleRef.current?.children || [], {
                y: '0%',
                duration: 0.8,
                ease: 'power3.out',
                stagger: 0.05
            }, '-=0.6')
            .to(textRef.current, {
                opacity: 1,
                duration: 0.6,
                ease: 'power2.out',
                onStart: () => {
                    decrypt(data.text, setBody, 1500);
                }
            }, '-=0.4');

        }, containerRef);

        return () => ctx.revert();
    }, [currentLoreIndex, currentState]);

    useEffect(() => {
        const handleScroll = (e: WheelEvent) => {
            if (currentState !== APP_STATE.LORE) return;
            
            // GSAP Exit animation before advancing
            const changeLore = (newIndex: number | null) => {
                if (!cardRef.current) return;
                gsap.to(cardRef.current, {
                    opacity: 0,
                    scale: 0.95,
                    filter: 'blur(10px)',
                    y: -20,
                    duration: 0.4,
                    ease: 'power2.in',
                    onComplete: () => {
                        if (newIndex !== null) {
                            setCurrentLoreIndex(newIndex);
                        } else {
                            setCurrentState(APP_STATE.TRANSITION);
                        }
                    }
                });
            };

            if (e.deltaY > 50) {
                if (currentLoreIndex < loreData.length - 1) {
                    changeLore(currentLoreIndex + 1);
                } else {
                    changeLore(null);
                }
            } else if (e.deltaY < -50 && currentLoreIndex > 0) {
                changeLore(currentLoreIndex - 1);
            }
        };

        // Throttle scroll to prevent accidental rapid skips
        let timeoutId: NodeJS.Timeout;
        const throttledScroll = (e: WheelEvent) => {
            if (timeoutId) return;
            handleScroll(e);
            timeoutId = setTimeout(() => { timeoutId = undefined as any; }, 800);
        };

        window.addEventListener('wheel', throttledScroll, { passive: true });
        return () => window.removeEventListener('wheel', throttledScroll);
    }, [currentState, currentLoreIndex, setCurrentLoreIndex, setCurrentState]);

    const playAudio = () => {
        if (typeof window === 'undefined') return;
        const synth = window.speechSynthesis;
        if (synth.speaking) {
            synth.cancel();
            setIsPlaying(false);
            return;
        }

        const data = loreData[currentLoreIndex];
        const utterance = new SpeechSynthesisUtterance(data.audio);
        
        const maleVoice = getMaleVoice();
        if (maleVoice) utterance.voice = maleVoice;

        if (data.theme === "#ffb700") { utterance.pitch = 0.8; utterance.rate = 0.85; }
        else if (data.theme === "#ff2a2a") { utterance.pitch = 0.5; utterance.rate = 0.95; }
        else { utterance.pitch = 0.7; utterance.rate = 0.95; }

        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        synth.speak(utterance);
    };

    if (currentState !== APP_STATE.LORE) return null;
    const data = loreData[currentLoreIndex];

    return (
        <div ref={containerRef} className="fixed inset-0 z-10 flex flex-col justify-center items-center pointer-events-none">
            <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 text-[rgba(0,229,255,0.5)] font-['Share_Tech_Mono'] text-xs tracking-[0.3em] uppercase opacity-70">
                [ Scroll or Swipe to Navigate ]
            </div>

            <div ref={cardRef} className="glass-panel p-12 max-w-[800px] w-[90%] relative pointer-events-auto flex flex-col items-center">
                {/* Tech border decoration */}
                <div className="absolute inset-0 border border-[rgba(255,255,255,0.05)] pointer-events-none">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t border-l" style={{ borderColor: data.theme }}></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t border-r" style={{ borderColor: data.theme }}></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l" style={{ borderColor: data.theme }}></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r" style={{ borderColor: data.theme }}></div>
                </div>
                
                <div className="text-center w-full">
                    <div 
                        className="w-[100px] h-[100px] mx-auto mb-8 transition-transform duration-500 hover:scale-110" 
                        style={{ color: data.theme, filter: `drop-shadow(0 0 15px ${data.theme})` }} 
                        dangerouslySetInnerHTML={{ __html: data.icon }} 
                    />
                    
                    <div className="flex justify-between items-end mb-6 border-b border-[rgba(255,255,255,0.1)] pb-3">
                        <div className="font-['Share_Tech_Mono'] text-xs md:text-sm tracking-[0.4em]" style={{ color: data.theme }}>{data.id}</div>
                        <div className="font-['Share_Tech_Mono'] text-xs text-[rgba(240,244,248,0.4)] tracking-widest uppercase">ERA: {data.era}</div>
                    </div>
                    
                    {/* Cinematic Typography Mask */}
                    <h1 className="cinematic-display text-4xl md:text-5xl font-light mb-8 tracking-wide text-white overflow-hidden" ref={titleRef}>
                        <span className="block">{title}</span>
                    </h1>
                    
                    <div ref={textRef} className="text-base md:text-lg font-light leading-relaxed text-[rgba(240,244,248,0.7)] text-justify mb-10 min-h-[10rem]">
                        {body}
                    </div>

                    <div className="flex justify-center border-t border-[rgba(255,255,255,0.1)] pt-6">
                        <button 
                            className={`interactive flex items-center gap-3 px-6 py-3 font-['Share_Tech_Mono'] text-xs tracking-widest uppercase transition-all duration-300 border ${isPlaying ? 'bg-white text-black border-white' : 'bg-transparent text-[rgba(255,255,255,0.7)] border-[rgba(255,255,255,0.2)] hover:border-white hover:text-white'}`}
                            style={isPlaying ? { boxShadow: `0 0 20px ${data.theme}` } : {}}
                            onClick={playAudio}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span>{isPlaying ? 'AUDIO LOG PLAYING...' : 'DECRYPT AUDIO LOG'}</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-[3%] left-1/2 -translate-x-1/2 flex gap-3 pointer-events-auto">
                {loreData.map((_, i) => (
                    <button 
                        key={i} 
                        className="interactive w-12 h-[2px] transition-all duration-300 relative group"
                        onClick={() => setCurrentLoreIndex(i)}
                    >
                        <div className={`absolute inset-0 transition-all duration-500 ${i === currentLoreIndex ? 'opacity-100' : 'opacity-20 group-hover:opacity-50'}`} style={{ backgroundColor: i === currentLoreIndex ? data.theme : '#fff' }}></div>
                        {i === currentLoreIndex && (
                            <div className="absolute inset-0 blur-[4px] opacity-60" style={{ backgroundColor: data.theme }}></div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
