'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useAppContext, APP_STATE } from '@/context/AppContext';
import { gameData, svgHelix } from '@/data/loreData';
import { getMaleVoice } from '@/utils/audioUtils';
import { mulberry32, stringToSeed } from '@/utils/mathUtils';

export default function HelixArchive() {
    const { currentState, setCurrentState, currentHelixIndex, setCurrentHelixIndex } = useAppContext();
    const trackRef = useRef<HTMLDivElement>(null);
    const detailLayerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);

    // Advanced Horizontal Scroll inertia & Magnetic Snapping
    useEffect(() => {
        if (currentState !== APP_STATE.HELIX || !trackRef.current) return;
        
        const track = trackRef.current;
        let targetX = 0;
        let currentX = 0;
        let isDragging = false;
        let startX = 0;

        const handleMouseDown = (e: MouseEvent) => {
            isDragging = true;
            startX = e.pageX;
            document.body.style.cursor = 'none'; // Keep custom cursor
        };

        const handleMouseUp = () => {
            isDragging = false;
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            const walk = (e.pageX - startX) * 2.5;
            targetX -= walk;
            startX = e.pageX;
        };

        const handleWheel = (e: WheelEvent) => {
            targetX += e.deltaY + e.deltaX;
        };

        const ctx = gsap.context(() => {
            // GSAP Ticker for smooth physics
            gsap.ticker.add(() => {
                if (!track) return;
                
                const maxScroll = track.scrollWidth - window.innerWidth;
                targetX = Math.max(0, Math.min(targetX, maxScroll));
                
                // Magnetic snapping
                const velocity = targetX - currentX;
                if (!isDragging && Math.abs(velocity) < 15) {
                    const nodes = track.querySelectorAll('.helix-node') as NodeListOf<HTMLElement>;
                    let minDistance = Infinity;
                    let closestIdeal = targetX;
                    const viewportCenter = currentX + window.innerWidth / 2;

                    nodes.forEach((node) => {
                        const nodeCenter = node.offsetLeft + node.offsetWidth / 2;
                        const dist = Math.abs(nodeCenter - viewportCenter);
                        if (dist < minDistance) {
                            minDistance = dist;
                            closestIdeal = nodeCenter - window.innerWidth / 2;
                        }
                    });

                    if (minDistance < window.innerWidth * 0.3) {
                        targetX += (closestIdeal - targetX) * 0.08;
                    }
                }

                currentX += (targetX - currentX) * 0.1;
                const skewAmt = Math.max(-15, Math.min(15, (currentX - targetX) * 0.05));

                gsap.set(track, { x: -currentX });
                
                // Physical depth and skew per node
                const viewportCenter = currentX + window.innerWidth / 2;
                const nodes = track.querySelectorAll('.helix-node') as NodeListOf<HTMLElement>;
                
                nodes.forEach(node => {
                    const nodeCenter = node.offsetLeft + node.offsetWidth / 2;
                    const dist = Math.abs(nodeCenter - viewportCenter);
                    const scale = Math.max(0.85, 1.1 - (dist / (window.innerWidth * 0.5)) * 0.25);
                    
                    gsap.set(node, {
                        scale: scale,
                        skewX: skewAmt,
                        transformPerspective: 1000,
                        force3D: true
                    });
                });
            });
        }, trackRef);

        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('wheel', handleWheel, { passive: true });
        
        // Entrance Choreography
        gsap.fromTo('.helix-node', 
            { opacity: 0, x: 200, rotationY: 45 },
            { opacity: 1, x: 0, rotationY: 0, stagger: 0.1, duration: 1.2, ease: "power4.out" }
        );

        return () => {
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('wheel', handleWheel);
            ctx.revert();
        };
    }, [currentState]);

    const openDeepDive = (index: number) => {
        setCurrentHelixIndex(index);
        setCurrentState(APP_STATE.DEEPDIVE);
        
        gsap.to('#helix-layer', {opacity: 0, scale: 0.95, filter: 'blur(20px)', duration: 0.6, ease: 'power2.inOut'});
        
        if (detailLayerRef.current) {
            gsap.set(detailLayerRef.current, { opacity: 1, display: 'flex' });
            
            const leftPanel = detailLayerRef.current.querySelector('.detail-left');
            const rightPanel = detailLayerRef.current.querySelectorAll('.detail-panel')[1];
            
            gsap.fromTo(leftPanel, { x: '-100%' }, { x: '0%', duration: 0.8, ease: "power4.out" });
            gsap.fromTo(rightPanel, { x: '100%' }, { x: '0%', duration: 0.8, ease: "power4.out", delay: 0.1 });
            
            const data = gameData[index];
            setTitle(data.title);
            
            if (titleRef.current) gsap.set(titleRef.current.children, { y: '110%' });
            if (textRef.current) gsap.set(textRef.current, { opacity: 0 });

            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
            const decrypt = (finalString: string, setFn: (val: string) => void, duration: number = 1500) => {
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
            };

            setTimeout(() => {
                if (titleRef.current) gsap.to(titleRef.current.children, { y: '0%', duration: 0.6, ease: "power4.out" });
                gsap.to(textRef.current, { opacity: 1, duration: 0.6, ease: 'power2.out' });
                decrypt(data.text, setBody, 1500);
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
        const maleVoice = getMaleVoice();
        if (maleVoice) utterance.voice = maleVoice;

        utterance.pitch = 0.8; utterance.rate = 1.0; 
        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        synth.speak(utterance);
    };

    return (
        <>
            <div id="helix-layer" className="fixed inset-0 z-10 py-16 flex-col bg-[radial-gradient(circle_at_center,rgba(0,30,60,0.4)_0%,transparent_100%)]" style={{ display: currentState === APP_STATE.HELIX || currentState === APP_STATE.DEEPDIVE ? 'flex' : 'none' }}>
                <div className="flex justify-between items-end w-full px-[5vw]">
                    <div>
                        <div className="font-['Share_Tech_Mono'] text-[rgba(240,244,248,0.4)] tracking-[0.3em] text-sm mb-2">ABSTERGO // PROJECT HELIX</div>
                        <h1 className="cinematic-display text-4xl md:text-6xl text-white border-b-2 border-[rgba(255,255,255,0.1)] pb-4 inline-block">SIMULATION ARCHIVE</h1>
                    </div>
                    <div className="font-['Share_Tech_Mono'] text-[rgba(240,244,248,0.4)] tracking-widest text-sm hidden md:block uppercase">DRAG OR SCROLL TO NAVIGATE</div>
                </div>

                <div className="flex-grow flex items-center w-full overflow-hidden relative mt-8 cursor-none interactive">
                    <div className="flex gap-12 px-[10vw] pb-12 w-max" ref={trackRef}>
                        {gameData.map((game, i) => (
                            <div 
                                key={i} 
                                className="helix-node glass-panel interactive flex-[0_0_350px] h-[500px] flex flex-col justify-between p-10 relative overflow-hidden transition-all duration-300 hover:border-white hover:bg-[rgba(4,20,40,0.8)]"
                                onClick={() => openDeepDive(i)}
                                onMouseMove={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const x = e.clientX - rect.left;
                                    const y = e.clientY - rect.top;
                                    const centerX = rect.width / 2;
                                    const centerY = rect.height / 2;
                                    const rotateX = ((y - centerY) / centerY) * -15;
                                    const rotateY = ((x - centerX) / centerX) * 15;
                                    gsap.to(e.currentTarget, {
                                        rotateX, rotateY, 
                                        transformPerspective: 1000, ease: "power1.out", duration: 0.3
                                    });
                                }}
                                onMouseLeave={(e) => {
                                    gsap.to(e.currentTarget, { rotateX: 0, rotateY: 0, ease: "elastic.out(1, 0.3)", duration: 1 });
                                }}
                            >
                                <div className="text-right w-full font-['Share_Tech_Mono'] text-sm text-[rgba(240,244,248,0.4)] tracking-widest">{game.era}</div>
                                <div className="w-[90px] h-[90px] mx-auto text-white opacity-30 transition-all duration-400 group-hover:opacity-100 group-hover:drop-shadow-[0_0_15px_#fff]" dangerouslySetInnerHTML={{ __html: svgHelix }} />
                                <div className="w-full text-center" style={{ transform: 'translateZ(20px)' }}>
                                    <div className="font-['Share_Tech_Mono'] text-[#00e5ff] text-sm tracking-[0.4em] mb-3">{game.id}</div>
                                    <div className="cinematic-display text-2xl font-normal text-white tracking-widest uppercase">{game.title}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div id="helix-detail-layer" ref={detailLayerRef} className="fixed inset-0 z-30 hidden bg-[rgba(2,4,6,0.95)] backdrop-blur-[30px] p-0 flex-row items-stretch opacity-0 overflow-hidden">
                <button className="absolute top-8 right-12 bg-transparent border border-[rgba(255,255,255,0.3)] text-white px-6 py-3 cursor-none font-['Share_Tech_Mono'] transition-all z-40 tracking-[0.2em] uppercase hover:bg-white hover:text-black hover:shadow-[0_0_20px_#fff] interactive" onClick={closeDeepDive}>
                    [ TERMINATE ]
                </button>
                
                <div className="detail-panel detail-left flex-1 relative px-16 py-24 flex flex-col justify-center border-r border-[rgba(255,255,255,0.1)] bg-[linear-gradient(90deg,transparent,rgba(0,229,255,0.05))]">
                    <div className="text-white opacity-10 mb-8 w-24 h-24" dangerouslySetInnerHTML={{ __html: svgHelix }}></div>
                    <div className="font-['Share_Tech_Mono'] text-[rgba(240,244,248,0.4)] tracking-[0.4em] text-xl mb-4 uppercase">ER // {gameData[currentHelixIndex]?.era}</div>
                    
                    <h1 className="cinematic-display text-5xl md:text-7xl font-light text-white mb-4 leading-none overflow-hidden" ref={titleRef}>
                        <span className="block">{title || gameData[currentHelixIndex]?.title}</span>
                    </h1>
                    
                    <h2 className="font-['Share_Tech_Mono'] text-2xl md:text-3xl text-[#00e5ff] tracking-widest uppercase">{gameData[currentHelixIndex]?.subtitle}</h2>
                </div>
                
                <div className="detail-panel flex-1 relative px-16 py-24 flex flex-col justify-center">
                    <div ref={textRef} className="text-lg md:text-xl font-light leading-relaxed text-[rgba(240,244,248,0.7)] text-justify min-h-[12rem]">
                        {body}
                    </div>
                    <button className={`interactive bg-[rgba(0,229,255,0.1)] border border-[#00e5ff] text-white px-8 py-4 font-['Share_Tech_Mono'] tracking-[0.1em] transition-all mt-12 self-start uppercase hover:bg-[#00e5ff] hover:shadow-[0_0_25px_#00e5ff] ${isPlaying ? 'bg-white border-white text-black' : ''}`} onClick={playAudio}>
                        <span>{isPlaying ? 'FILE PLAYING...' : 'ACCESS ARCHIVE FILE'}</span>
                    </button>
                </div>
            </div>
        </>
    );
}
