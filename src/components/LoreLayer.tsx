'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useAppContext, APP_STATE } from '@/context/AppContext';
import { loreData } from '@/data/loreData';

export default function LoreLayer() {
    const { currentState, setCurrentState, currentLoreIndex, setCurrentLoreIndex } = useAppContext();
    const cardRef = useRef<HTMLDivElement>(null);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (currentState !== APP_STATE.LORE) return;

        const data = loreData[currentLoreIndex];
        
        // Decrypt text effect
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
        const decrypt = (finalString: string, setFn: (val: string) => void, duration: number = 1500) => {
            let iterations = 0;
            const maxIterations = finalString.length * 2;
            const intervalDuration = duration / maxIterations;

            const interval = setInterval(() => {
                setFn(finalString.split('').map((char, index) => {
                    if (index < iterations / 2) return char;
                    if (char === ' ') return ' ';
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join(''));

                if (iterations >= maxIterations) {
                    clearInterval(interval);
                    setFn(finalString);
                }
                iterations++;
            }, intervalDuration);
            return interval;
        };

        if (cardRef.current) {
            gsap.fromTo(cardRef.current, 
                { opacity: 0, y: 100, scale: 0.9, rotationX: -10 },
                { opacity: 1, y: 0, scale: 1, rotationX: 0, duration: 0.8, ease: "elastic.out(1, 0.8)",
                  onComplete: () => {
                      decrypt(data.title, setTitle, 800);
                      setTimeout(() => decrypt(data.text, setBody, 2000), 300);
                  }
                }
            );
        }
    }, [currentLoreIndex, currentState]);

    useEffect(() => {
        const handleScroll = (e: WheelEvent) => {
            if (currentState !== APP_STATE.LORE) return;
            if (e.deltaY > 0) {
                if (currentLoreIndex < loreData.length - 1) {
                    setCurrentLoreIndex(currentLoreIndex + 1);
                } else {
                    setCurrentState(APP_STATE.TRANSITION);
                }
            } else if (e.deltaY < 0 && currentLoreIndex > 0) {
                setCurrentLoreIndex(currentLoreIndex - 1);
            }
        };

        window.addEventListener('wheel', handleScroll, { passive: true });
        return () => window.removeEventListener('wheel', handleScroll);
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
        if (data.theme === "#ffb700") { utterance.pitch = 1.3; utterance.rate = 0.85; }
        else if (data.theme === "#ff2a2a") { utterance.pitch = 0.7; utterance.rate = 0.95; }
        else { utterance.pitch = 1; utterance.rate = 0.95; }

        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        synth.speak(utterance);
    };

    if (currentState !== APP_STATE.LORE) return null;
    const data = loreData[currentLoreIndex];

    return (
        <div id="lore-layer" style={{ display: 'flex' }}>
            <div className="scroll-indicator" id="scroll-hint">[ SCROLL OR SWIPE TO NAVIGATE MEMORIES ]</div>

            <div className="memory-card" ref={cardRef}>
                <div className="card-corner cc-tl" style={{ borderColor: data.theme }}></div>
                <div className="card-corner cc-tr" style={{ borderColor: data.theme }}></div>
                <div className="card-corner cc-bl" style={{ borderColor: data.theme }}></div>
                <div className="card-corner cc-br" style={{ borderColor: data.theme }}></div>
                
                <div className="text-center">
                    <div className="interactive" style={{ color: data.theme }} dangerouslySetInnerHTML={{ __html: data.icon }}></div>
                    <div className="flex justify-between items-end mb-4 border-b border-gray-800 pb-2">
                        <div className="mono text-xs md:text-sm tracking-[0.4em]" style={{ color: data.theme }}>{data.id}</div>
                        <div className="mono text-xs text-gray-500 tracking-widest">ERA: {data.era}</div>
                    </div>
                    <h1 className="cinzel text-4xl md:text-6xl font-bold mb-6 tracking-wider">{title}</h1>
                    
                    <div className="text-lg md:text-xl font-light leading-relaxed text-gray-300 text-justify mb-8 min-h-[12rem]">
                        {body}
                    </div>

                    <div className="flex justify-center border-t border-gray-800 pt-6">
                        <button className={`audio-btn interactive ${isPlaying ? 'playing' : ''}`} onClick={playAudio}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span>{isPlaying ? 'AUDIO LOG PLAYING...' : 'DECRYPT AUDIO LOG'}</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className="timeline-indicator">
                {loreData.map((_, i) => (
                    <div key={i} className={`dot ${i === currentLoreIndex ? 'active' : ''}`} style={i === currentLoreIndex ? { backgroundColor: data.theme, boxShadow: `0 0 15px ${data.theme}` } : {}}></div>
                ))}
            </div>
        </div>
    );
}
