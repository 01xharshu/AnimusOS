'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            if (dotRef.current) {
                dotRef.current.style.left = e.clientX + 'px';
                dotRef.current.style.top = e.clientY + 'px';
            }
            if (ringRef.current) {
                gsap.to(ringRef.current, {
                    x: e.clientX - 10,
                    y: e.clientY - 10,
                    duration: 0.15,
                    ease: "power2.out"
                });
            }
        };
        window.addEventListener('mousemove', onMouseMove);
        return () => window.removeEventListener('mousemove', onMouseMove);
    }, []);

    return (
        <>
            <div id="custom-cursor-dot" ref={dotRef}></div>
            <div id="custom-cursor-ring" ref={ringRef}></div>
        </>
    );
}
