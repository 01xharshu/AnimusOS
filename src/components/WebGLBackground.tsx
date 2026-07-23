'use client';
import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { Points, PointMaterial, Effects } from '@react-three/drei';
import * as THREE from 'three';
import { UnrealBloomPass } from 'three-stdlib';
import gsap from 'gsap';
import { useAppContext, APP_STATE } from '@/context/AppContext';

declare module '@react-three/fiber' {
    interface ThreeElements {
        unrealBloomPass: any;
    }
}

extend({ UnrealBloomPass });

// Custom performance governor
function usePerformanceGovernor(maxParticles: number) {
    const [qualityTier, setQualityTier] = useState(2); // 0=low, 1=med, 2=high
    const frameData = useRef({ smoothedMs: 16.7, poorFrames: 0, strongFrames: 0 });

    useFrame((state, delta) => {
        const ms = delta * 1000;
        frameData.current.smoothedMs += (ms - frameData.current.smoothedMs) * 0.05;
        const { smoothedMs } = frameData.current;

        if (smoothedMs > 24) frameData.current.poorFrames++;
        else frameData.current.poorFrames = 0;

        if (smoothedMs < 15) frameData.current.strongFrames++;
        else frameData.current.strongFrames = 0;

        if (frameData.current.poorFrames > 90 && qualityTier > 0) {
            setQualityTier(q => Math.max(0, q - 1));
            frameData.current.poorFrames = 0;
        } else if (frameData.current.strongFrames > 360 && qualityTier < 2) {
            setQualityTier(q => Math.min(2, q + 1));
            frameData.current.strongFrames = 0;
        }
    });

    return qualityTier === 2 ? maxParticles : qualityTier === 1 ? Math.floor(maxParticles * 0.5) : Math.floor(maxParticles * 0.25);
}

function ParticleField({ appState, isReducedMotion }: { appState: APP_STATE, isReducedMotion: boolean }) {
    const ref = useRef<THREE.Points>(null);
    const particleCount = usePerformanceGovernor(isReducedMotion ? 5000 : 20000);
    
    const [positions, originalPositions] = useMemo(() => {
        const pos = new Float32Array(20000 * 3);
        const orig = new Float32Array(20000 * 3);
        for (let i = 0; i < 20000; i++) {
            const r = 20 + Math.random() * 40;
            const theta = Math.random() * Math.PI * 2;
            const z = (Math.random() - 0.5) * 400;
            pos[i * 3] = r * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(theta);
            pos[i * 3 + 2] = z;
            orig[i * 3] = pos[i * 3];
            orig[i * 3 + 1] = pos[i * 3 + 1];
            orig[i * 3 + 2] = pos[i * 3 + 2];
        }
        return [pos, orig];
    }, []);

    const animState = useRef({ time: 0, speed: 1, isHelix: false, color: new THREE.Color('#00e5ff') });

    useEffect(() => {
        const state = animState.current;
        if (appState === APP_STATE.LORE) {
            gsap.to(state, { speed: 15, duration: 1, yoyo: true, repeat: 1, ease: 'power2.inOut' });
            state.isHelix = false;
        } else if (appState === APP_STATE.HELIX) {
            state.isHelix = true;
            gsap.to(state.color, { r: 1, g: 1, b: 1, duration: 2 });
        }
    }, [appState]);

    useFrame((state, delta) => {
        if (!ref.current) return;
        const anim = animState.current;
        anim.time += delta * 0.2 * anim.speed;
        
        // Update color
        const mat = ref.current.material as THREE.PointsMaterial;
        mat.color.copy(anim.color);

        if (anim.isHelix) {
            ref.current.rotation.y = anim.time;
            ref.current.rotation.z = anim.time * 0.5;
            
            // Complex geometry deformation
            const pos = ref.current.geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                const t = anim.time + originalPositions[i3+2] * 0.01;
                const r = 30;
                const offset = (i % 2 === 0) ? 0 : Math.PI;
                const targetX = Math.sin(t + offset) * r;
                pos[i3] += (targetX - pos[i3]) * 0.05;
                pos[i3+1] += (originalPositions[i3+1] * 0.1 - pos[i3+1]) * 0.05;
                pos[i3+2] += (originalPositions[i3+2] - pos[i3+2]) * 0.05;
            }
            ref.current.geometry.attributes.position.needsUpdate = true;
        } else {
            ref.current.rotation.z = anim.time;
        }
        
        // Limit drawn particles based on governor
        ref.current.geometry.setDrawRange(0, particleCount);
    });

    return (
        <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial transparent color="#00e5ff" size={0.8} sizeAttenuation={true} depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.6} />
        </Points>
    );
}

function SceneChoreography({ appState, isReducedMotion }: { appState: APP_STATE, isReducedMotion: boolean }) {
    const { camera, mouse } = useThree();
    const target = useRef(new THREE.Vector3(0, 0, 50));

    useEffect(() => {
        if (appState === APP_STATE.DEEPDIVE) {
            target.current.z = -150;
            if (!isReducedMotion) {
                gsap.to(camera.rotation, { z: Math.PI * 2, duration: 2, ease: "power3.inOut" });
            }
        } else {
            target.current.z = 50;
            gsap.to(camera.rotation, { z: 0, duration: 1, ease: "power2.out" });
        }
    }, [appState, camera, isReducedMotion]);

    useFrame((state) => {
        // Pointer parallax
        const parallaxStrength = appState === APP_STATE.HELIX ? 5 : 2;
        target.current.x = mouse.x * parallaxStrength;
        target.current.y = mouse.y * parallaxStrength;
        
        camera.position.lerp(target.current, 0.05);
        camera.lookAt(0, 0, 0);
    });

    return null;
}

export default function WebGLBackground() {
    const { currentState } = useAppContext();
    const [isReducedMotion, setIsReducedMotion] = useState(false);

    useEffect(() => {
        setIsReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }, []);

    return (
        <>
            <div className="fixed inset-0 z-[1] bg-black">
                <Canvas gl={{ antialias: false, powerPreference: "high-performance", alpha: false }} dpr={[1, 1.5]}>
                    <color attach="background" args={[currentState === APP_STATE.HELIX ? '#001e3c' : '#010a0f']} />
                    <fogExp2 attach="fog" args={[currentState === APP_STATE.HELIX ? '#001e3c' : '#010a0f', 0.002]} />
                    
                    <ParticleField appState={currentState} isReducedMotion={isReducedMotion} />
                    <SceneChoreography appState={currentState} isReducedMotion={isReducedMotion} />
                    
                    {/* Post Processing: Bloom */}
                    <Effects disableGamma>
                        <unrealBloomPass threshold={0.85} strength={currentState === APP_STATE.HELIX ? 2.5 : 1.2} radius={0.4} />
                    </Effects>
                </Canvas>
            </div>
            {/* Cinematic overlays (Grain/Scanlines) */}
            <div className="fixed inset-0 z-[50] pointer-events-none opacity-[0.15] mix-blend-overlay bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] bg-repeat" />
            <div className="fixed inset-0 z-[49] pointer-events-none" style={{ background: 'radial-gradient(circle at center, transparent 30%, #000 120%)' }}></div>
        </>
    );
}
