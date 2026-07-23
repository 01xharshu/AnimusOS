import os

# --- HELIX ARCHIVE ---
with open('src/components/HelixArchive.tsx', 'w') as f:
    f.write("""'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useAppContext, APP_STATE } from '@/context/AppContext';
import { gameData, svgHelix } from '@/data/loreData';

export default function HelixArchive() {
    const { currentState, setCurrentState, currentHelixIndex, setCurrentHelixIndex } = useAppContext();
    const trackRef = useRef<HTMLDivElement>(null);
    const detailLayerRef = useRef<HTMLDivElement>(null);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);

    // Horizontal Scroll inertia
    useEffect(() => {
        if (currentState !== APP_STATE.HELIX) return;
        
        let targetScrollX = 0;
        let currentScrollX = 0;
        let lastScrollX = 0;
        let isDragging = false;
        let startX = 0;
        let animationFrameId: number;

        const maxScroll = trackRef.current ? trackRef.current.scrollWidth - window.innerWidth : 0;

        const handleMouseDown = (e: MouseEvent) => {
            isDragging = true;
            startX = e.pageX;
            document.body.classList.add('cursor-drag');
        };

        const handleMouseUp = () => {
            isDragging = false;
            document.body.classList.remove('cursor-drag');
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            const walk = (e.pageX - startX) * 2.5;
            targetScrollX -= walk;
            startX = e.pageX;
        };

        const handleWheel = (e: WheelEvent) => {
            targetScrollX += e.deltaY + e.deltaX;
        };

        const renderLoop = () => {
            if (trackRef.current) {
                targetScrollX = Math.max(0, Math.min(targetScrollX, trackRef.current.scrollWidth - window.innerWidth));
                currentScrollX += (targetScrollX - currentScrollX) * 0.1;
                
                const velocity = currentScrollX - lastScrollX;
                lastScrollX = currentScrollX;
                const skewAmt = Math.max(-15, Math.min(15, velocity * -0.2));

                trackRef.current.style.transform = `translate3d(${-currentScrollX}px, 0, 0)`;
                
                // apply skew to children
                const nodes = trackRef.current.querySelectorAll('.helix-node') as NodeListOf<HTMLElement>;
                nodes.forEach(node => {
                    const existingTransform = node.style.transform.replace(/skewX\\([^)]*\\)/g, '').replace(/perspective\\(1000px\\)/g, '').trim();
                    node.style.transform = `perspective(1000px) skewX(${skewAmt}deg) ${existingTransform}`;
                });
            }
            animationFrameId = requestAnimationFrame(renderLoop);
        };

        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('wheel', handleWheel, { passive: true });
        
        animationFrameId = requestAnimationFrame(renderLoop);

        // Entrance animation
        gsap.fromTo('.helix-node', 
            { opacity: 0, x: 200, rotationY: 45 },
            { opacity: 1, x: 0, rotationY: 0, stagger: 0.1, duration: 1.2, ease: "power4.out" }
        );

        return () => {
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('wheel', handleWheel);
            cancelAnimationFrame(animationFrameId);
            document.body.classList.remove('cursor-drag');
        };
    }, [currentState]);

    const openDeepDive = (index: number) => {
        setCurrentHelixIndex(index);
        setCurrentState(APP_STATE.DEEPDIVE);
        
        gsap.to('#helix-layer', {opacity: 0, scale: 0.9, filter: 'blur(20px)', duration: 0.6});
        
        if (detailLayerRef.current) {
            gsap.set(detailLayerRef.current, { opacity: 1, display: 'flex' });
            
            const leftPanel = detailLayerRef.current.querySelector('.detail-left');
            const rightPanel = detailLayerRef.current.querySelectorAll('.detail-panel')[1];
            
            gsap.fromTo(leftPanel, { x: '-100%' }, { x: '0%', duration: 0.8, ease: "power4.out" });
            gsap.fromTo(rightPanel, { x: '100%' }, { x: '0%', duration: 0.8, ease: "power4.out", delay: 0.1 });
            
            const data = gameData[index];
            
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
            };

            setTimeout(() => {
                decrypt(data.title, setTitle, 800);
                setTimeout(() => decrypt(data.text, setBody, 2000), 400);
            }, 600);
        }
    };

    const closeDeepDive = () => {
        if (detailLayerRef.current) {
            const leftPanel = detailLayerRef.current.querySelector('.detail-left');
            const rightPanel = detailLayerRef.current.querySelectorAll('.detail-panel')[1];
            
            gsap.to(leftPanel, { x: '-100%', duration: 0.6, ease: "power3.in" });
            gsap.to(rightPanel, { x: '100%', duration: 0.6, ease: "power3.in", delay: 0.1 });
            gsap.to(detailLayerRef.current, { opacity: 0, duration: 0.8, delay: 0.4, onComplete: () => {
                setCurrentState(APP_STATE.HELIX);
            }});
            
            gsap.to('#helix-layer', { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.8, delay: 0.4, ease: "power3.out" });
            
            const synth = window.speechSynthesis;
            if (synth.speaking) synth.cancel();
            setIsPlaying(false);
            setTitle('');
            setBody('');
        }
    };

    const playAudio = () => {
        if (typeof window === 'undefined') return;
        const synth = window.speechSynthesis;
        if (synth.speaking) {
            synth.cancel();
            setIsPlaying(false);
            return;
        }

        const data = gameData[currentHelixIndex];
        const utterance = new SpeechSynthesisUtterance(data.audio);
        utterance.pitch = 0.9; utterance.rate = 1.1; 
        
        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        synth.speak(utterance);
    };

    return (
        <>
            <div id="helix-layer" style={{ display: currentState === APP_STATE.HELIX || currentState === APP_STATE.DEEPDIVE ? 'flex' : 'none' }}>
                <div className="flex justify-between items-end w-full">
                    <div>
                        <div className="mono text-gray-400 tracking-[0.3em] text-sm mb-2 pl-[4rem]">ABSTERGO // PROJECT HELIX</div>
                        <h1 className="cinzel text-4xl md:text-6xl helix-header-text">SIMULATION ARCHIVE</h1>
                    </div>
                    <div className="mono text-gray-400 tracking-widest text-sm pr-12 hidden md:block">DRAG OR SCROLL TO NAVIGATE</div>
                </div>

                <div className="helix-track-wrapper interactive-drag" id="helix-wrapper">
                    <div className="helix-track" id="helix-track" ref={trackRef}>
                        {gameData.map((game, i) => (
                            <div 
                                key={i} 
                                className="helix-node interactive"
                                onClick={() => openDeepDive(i)}
                                onMouseMove={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const x = e.clientX - rect.left;
                                    const y = e.clientY - rect.top;
                                    const centerX = rect.width / 2;
                                    const centerY = rect.height / 2;
                                    const rotateX = ((y - centerY) / centerY) * -15;
                                    const rotateY = ((x - centerX) / centerX) * 15;

                                    const currentTransform = e.currentTarget.style.transform;
                                    const skewMatch = currentTransform.match(/skewX\\([^)]*\\)/);
                                    const skewPart = skewMatch ? skewMatch[0] : '';
                                    
                                    gsap.to(e.currentTarget, {
                                        rotateX: rotateX, rotateY: rotateY, 
                                        transformPerspective: 1000, ease: "power1.out", duration: 0.3
                                    });
                                }}
                                onMouseLeave={(e) => {
                                    gsap.to(e.currentTarget, { rotateX: 0, rotateY: 0, ease: "elastic.out(1, 0.3)", duration: 1 });
                                }}
                            >
                                <div className="text-right w-full mono text-sm text-gray-400 tracking-widest">{game.era}</div>
                                <div dangerouslySetInnerHTML={{ __html: svgHelix }} />
                                <div className="w-full text-center node-content-wrapper">
                                    <div className="mono text-[var(--abstergo-blue)] text-sm tracking-[0.4em] mb-3">{game.id}</div>
                                    <div className="cinzel text-2xl font-bold text-white tracking-widest">{game.title}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div id="helix-detail-layer" ref={detailLayerRef} style={{ display: 'none' }}>
                <button className="close-btn interactive" onClick={closeDeepDive}>[ TERMINATE ]</button>
                
                <div className="detail-panel detail-left">
                    <div id="detail-icon" className="text-white opacity-10 mb-8 w-24 h-24" dangerouslySetInnerHTML={{ __html: svgHelix }}></div>
                    <div className="mono text-gray-400 tracking-[0.4em] text-xl mb-4">ER // {gameData[currentHelixIndex]?.era}</div>
                    <h1 className="cinzel text-5xl md:text-8xl font-bold text-white mb-4 leading-none">{title || gameData[currentHelixIndex]?.title}</h1>
                    <h2 className="mono text-2xl md:text-4xl text-[var(--abstergo-blue)] tracking-widest">{gameData[currentHelixIndex]?.subtitle}</h2>
                </div>
                
                <div className="detail-panel">
                    <div className="text-xl md:text-2xl font-light leading-relaxed text-gray-300 text-justify">
                        {body}
                    </div>
                    <button className={`helix-audio-btn interactive ${isPlaying ? 'playing' : ''}`} onClick={playAudio}>
                        <span>{isPlaying ? 'FILE PLAYING...' : 'ACCESS ARCHIVE FILE'}</span>
                    </button>
                </div>
            </div>
        </>
    );
}
""")

