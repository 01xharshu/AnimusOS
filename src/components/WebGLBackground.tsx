'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import gsap from 'gsap';
import { useAppContext, APP_STATE } from '@/context/AppContext';

export default function WebGLBackground() {
    const { currentState } = useAppContext();
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const composerRef = useRef<EffectComposer | null>(null);
    const particlesRef = useRef<THREE.Points | null>(null);
    const materialRef = useRef<THREE.PointsMaterial | null>(null);
    const bloomRef = useRef<UnrealBloomPass | null>(null);
    
    // Performance governor state
    const governorRef = useRef({
        lastTime: 0,
        smoothedMs: 16.7,
        poorFrames: 0,
        strongFrames: 0,
        qualityTier: 2, // 0 = low, 1 = med, 2 = high
        maxParticles: 20000,
        currentParticles: 20000
    });

    // Animation states
    const animState = useRef({
        time: 0,
        speed: 1,
        mouseX: 0,
        mouseY: 0,
        targetX: 0,
        targetY: 0,
        cameraTargetZ: 50,
        isHelixWorld: false,
        isTransitioningToHelix: false
    });

    useEffect(() => {
        if (!containerRef.current) return;
        
        // Reduced motion & performance capability
        const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const hwConcurrency = navigator.hardwareConcurrency || 4;
        const isHighEnd = hwConcurrency > 4 && !isReducedMotion;
        
        // Initialize Three.js
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x010a0f, 0.002);
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 50;
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Post-Processing
        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));
        
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            isHighEnd ? 1.5 : 0.8, // strength
            0.4, // radius
            0.85 // threshold
        );
        composer.addPass(bloomPass);
        bloomRef.current = bloomPass;

        const filmPass = new FilmPass(
            isHighEnd ? 0.35 : 0.15, // noise intensity
            false // grayscale
        );
        composer.addPass(filmPass);
        
        composerRef.current = composer;

        // Particle System
        const maxParticles = isHighEnd ? 20000 : 5000;
        governorRef.current.maxParticles = maxParticles;
        governorRef.current.currentParticles = maxParticles;
        governorRef.current.qualityTier = isHighEnd ? 2 : 1;

        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(maxParticles * 3);
        const originalPositions = new Float32Array(maxParticles * 3);
        const randoms = new Float32Array(maxParticles);
        
        for (let i = 0; i < maxParticles; i++) {
            const r = 20 + Math.random() * 40;
            const theta = Math.random() * Math.PI * 2;
            const z = (Math.random() - 0.5) * 400;
            
            positions[i * 3] = r * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(theta);
            positions[i * 3 + 2] = z;

            originalPositions[i * 3] = positions[i * 3];
            originalPositions[i * 3 + 1] = positions[i * 3 + 1];
            originalPositions[i * 3 + 2] = positions[i * 3 + 2];
            
            randoms[i] = Math.random();
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('aOriginalPosition', new THREE.BufferAttribute(originalPositions, 3));
        geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

        const material = new THREE.PointsMaterial({
            size: 0.8,
            color: 0x00e5ff,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        materialRef.current = material;

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);
        particlesRef.current = particles;

        // Resize
        const handleResize = () => {
            if (!camera || !renderer) return;
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            composer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // Mouse Move
        const handleMouseMove = (e: MouseEvent) => {
            const state = animState.current;
            if (state.isHelixWorld) {
                state.targetX = (e.clientX - window.innerWidth / 2) * 0.05;
                state.targetY = (e.clientY - window.innerHeight / 2) * 0.05;
            } else {
                state.targetX = (e.clientX - window.innerWidth / 2) * 0.02;
                state.targetY = (e.clientY - window.innerHeight / 2) * 0.02;
            }
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Render loop
        let animationFrameId: number;
        const renderLoop = (time: number) => {
            const gov = governorRef.current;
            if (gov.lastTime) {
                const deltaMs = time - gov.lastTime;
                gov.smoothedMs += (deltaMs - gov.smoothedMs) * 0.05;
                
                // Adaptive governor logic
                gov.poorFrames = gov.smoothedMs > 24 ? gov.poorFrames + 1 : 0;
                gov.strongFrames = gov.smoothedMs < 15 ? gov.strongFrames + 1 : 0;

                if (gov.poorFrames > 90 && gov.qualityTier > 0) {
                    gov.qualityTier--;
                    gov.poorFrames = 0; // cooldown
                    gov.currentParticles = Math.floor(gov.maxParticles * (gov.qualityTier === 1 ? 0.5 : 0.25));
                    if (particlesRef.current) particlesRef.current.geometry.setDrawRange(0, gov.currentParticles);
                }
                if (gov.strongFrames > 360 && gov.qualityTier < 2) {
                    gov.qualityTier++;
                    gov.strongFrames = 0; // cooldown
                    gov.currentParticles = Math.floor(gov.maxParticles * (gov.qualityTier === 2 ? 1 : 0.5));
                    if (particlesRef.current) particlesRef.current.geometry.setDrawRange(0, gov.currentParticles);
                }
            }
            gov.lastTime = time;

            const state = animState.current;
            state.time += 0.002 * state.speed;
            state.mouseX += (state.targetX - state.mouseX) * 0.05;
            state.mouseY += (state.targetY - state.mouseY) * 0.05;

            camera.position.x = state.mouseX;
            camera.position.y = -state.mouseY;
            camera.position.z += (state.cameraTargetZ - camera.position.z) * 0.05;
            camera.lookAt(0, 0, 0);

            if (particles) {
                if (state.isTransitioningToHelix) {
                    particles.rotation.z += 0.05;
                    particles.scale.x += 0.02;
                    particles.scale.y += 0.02;
                } else if (state.isHelixWorld) {
                    particles.rotation.y = state.time * 0.2;
                    particles.rotation.z = state.time * 0.1;
                    
                    const positions = particles.geometry.attributes.position.array as Float32Array;
                    const originals = particles.geometry.attributes.aOriginalPosition.array as Float32Array;
                    
                    const drawLimit = gov.currentParticles;
                    for (let i = 0; i < drawLimit; i++) {
                        const i3 = i * 3;
                        const t = state.time + originals[i3+2] * 0.01;
                        const r = 30;
                        const offset = (i % 2 === 0) ? 0 : Math.PI;
                        
                        const targetX = Math.sin(t + offset) * r;
                        const targetY = originals[i3+1] * 0.1; 
                        const targetZ = originals[i3+2];
                        
                        if (i % 100 < 5) {
                            positions[i3] += (Math.cos(t) * r * (Math.random()-0.5) - positions[i3]) * 0.1;
                        } else {
                            positions[i3] += (targetX - positions[i3]) * 0.05;
                        }
                        positions[i3+1] += (targetY - positions[i3+1]) * 0.05;
                        positions[i3+2] += (targetZ - positions[i3+2]) * 0.05;
                    }
                    particles.geometry.attributes.position.needsUpdate = true;
                } else {
                    particles.rotation.z = state.time * 0.5;
                }
            }
            
            // Dynamic Bloom Strength based on speed and tier
            if (bloomPass) {
                const baseStrength = gov.qualityTier === 2 ? 1.5 : gov.qualityTier === 1 ? 1.0 : 0.5;
                bloomPass.strength = baseStrength + (state.speed * 0.1);
            }

            composer.render();
            animationFrameId = requestAnimationFrame(renderLoop);
        };
        animationFrameId = requestAnimationFrame(renderLoop);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
            
            geometry.dispose();
            material.dispose();
            renderer.dispose();
            composer.dispose();
            if (containerRef.current?.contains(renderer.domElement)) {
                containerRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    useEffect(() => {
        const state = animState.current;
        const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        switch(currentState) {
            case APP_STATE.LORE:
                gsap.to(state, { speed: 20, duration: 0.5, yoyo: true, repeat: 1 });
                break;
            case APP_STATE.TRANSITION:
                state.isTransitioningToHelix = true;
                if (cameraRef.current && !isReducedMotion) {
                    gsap.to(cameraRef.current.position, {
                        x: () => (Math.random() - 0.5) * 50,
                        y: () => (Math.random() - 0.5) * 50,
                        duration: 0.1, yoyo: true, repeat: 20
                    });
                }
                break;
            case APP_STATE.HELIX:
                state.isTransitioningToHelix = false;
                state.isHelixWorld = true;
                
                if (materialRef.current) {
                    gsap.to(materialRef.current.color, { r: 1, g: 1, b: 1, duration: 2 });
                }
                if (sceneRef.current?.fog) {
                    sceneRef.current.fog = new THREE.FogExp2(0x001e3c, 0.002);
                }
                if (particlesRef.current) {
                    gsap.to(particlesRef.current.scale, { x: 1, y: 1, z: 1, duration: 1, ease: "power2.out" });
                }
                if (bloomRef.current) {
                    gsap.to(bloomRef.current, { strength: 2.5, duration: 1, ease: "power2.out" });
                }
                break;
            case APP_STATE.DEEPDIVE:
                state.cameraTargetZ = -150;
                if (cameraRef.current && !isReducedMotion) {
                    gsap.to(cameraRef.current.rotation, { z: Math.PI * 2, duration: 2, ease: "power3.inOut" });
                }
                break;
        }
    }, [currentState]);

    return (
        <>
            <div id="webgl-container" ref={containerRef} className="fixed inset-0 z-[1]"></div>
            <div className="scanlines fixed inset-0 z-[50] pointer-events-none opacity-30" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2))', backgroundSize: '100% 4px' }}></div>
            <div className="vignette fixed inset-0 z-[49] pointer-events-none" style={{ background: 'radial-gradient(circle at center, transparent 30%, #000 120%)' }}></div>
        </>
    );
}
