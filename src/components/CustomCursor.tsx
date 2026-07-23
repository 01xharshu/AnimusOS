'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initial setup
        gsap.set(ringRef.current, { xPercent: -50, yPercent: -50 });
        gsap.set(dotRef.current, { xPercent: -50, yPercent: -50 });

        const onMouseMove = (e: MouseEvent) => {
            if (dotRef.current) {
                gsap.set(dotRef.current, { x: e.clientX, y: e.clientY });
            }
            if (ringRef.current) {
                gsap.to(ringRef.current, {
                    x: e.clientX,
                    y: e.clientY,
                    duration: 0.15,
                    ease: "power2.out"
                });
            }
        };

        const onMouseDown = () => {
            gsap.to(ringRef.current, { scale: 0.8, duration: 0.2, ease: "power2.out" });
            gsap.to(dotRef.current, { scale: 0, duration: 0.2 });
        };

        const onMouseUp = () => {
            gsap.to(ringRef.current, { scale: 1, duration: 0.2, ease: "elastic.out(1, 0.3)" });
            gsap.to(dotRef.current, { scale: 1, duration: 0.2 });
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, []);

    return (
        <>
            <div ref={dotRef} className="fixed top-0 left-0 w-1.5 h-1.5 bg-[#00e5ff] rounded-full pointer-events-none z-[9999] shadow-[0_0_10px_#00e5ff]" />
            <div ref={ringRef} className="fixed top-0 left-0 w-6 h-6 border border-[rgba(0,229,255,0.5)] rounded-full pointer-events-none z-[9998] transition-colors duration-300" />
        </>
    );
}
