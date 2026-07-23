import os

# --- WEBGL BACKGROUND ---
with open('src/components/WebGLBackground.tsx', 'w') as f:
    f.write("""'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { useAppContext, APP_STATE } from '@/context/AppContext';

export default function WebGLBackground() {
    const { currentState } = useAppContext();
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const particlesRef = useRef<THREE.Points | null>(null);
    const materialRef = useRef<THREE.PointsMaterial | null>(null);
    
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
        
        // Initialize Three.js
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x010a0f, 0.002);
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 50;
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Particle System
        const particleCount = window.innerWidth < 768 ? 4000 : 15000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const originalPositions = new Float32Array(particleCount * 3);
        const randoms = new Float32Array(particleCount);
        
        for (let i = 0; i < particleCount; i++) {
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
            blending: THREE.AdditiveBlending
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
        const renderLoop = () => {
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
                    
                    for (let i = 0; i < particleCount; i++) {
                        const i3 = i * 3;
                        const t = state.time + originals[i3+2] * 0.01;
                        const r = 30;
                        const offset = (i % 2 === 0) ? 0 : Math.PI;
                        
                        // Morph to DNA structure
                        const targetX = Math.sin(t + offset) * r;
                        const targetY = originals[i3+1] * 0.1; // flatten
                        const targetZ = originals[i3+2];
                        
                        // Bridge connections
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

            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(renderLoop);
        };
        renderLoop();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
            
            // Dispose Three.js objects
            geometry.dispose();
            material.dispose();
            renderer.dispose();
            if (containerRef.current?.contains(renderer.domElement)) {
                containerRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    // Sync state changes with WebGL animations
    useEffect(() => {
        const state = animState.current;
        
        switch(currentState) {
            case APP_STATE.LORE:
                // Hyper-warp simulation on each lore card (if needed)
                gsap.to(state, { speed: 20, duration: 0.5, yoyo: true, repeat: 1 });
                break;
            case APP_STATE.TRANSITION:
                state.isTransitioningToHelix = true;
                if (cameraRef.current) {
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
                
                // Color switch
                if (materialRef.current) {
                    gsap.to(materialRef.current.color, { r: 1, g: 1, b: 1, duration: 2 });
                }
                if (sceneRef.current?.fog) {
                    sceneRef.current.fog = new THREE.FogExp2(0x001e3c, 0.002);
                }
                if (particlesRef.current) {
                    gsap.to(particlesRef.current.scale, { x: 1, y: 1, z: 1, duration: 1, ease: "power2.out" });
                }
                break;
            case APP_STATE.DEEPDIVE:
                state.cameraTargetZ = -150;
                if (cameraRef.current) {
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
""")

