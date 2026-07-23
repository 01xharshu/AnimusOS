'use client';
import { useAppContext, APP_STATE } from '@/context/AppContext';

export default function BootScreen() {
    const { currentState, setCurrentState } = useAppContext();

    if (currentState !== APP_STATE.BOOT) return null;

    return (
        <div id="boot-screen">
            <div className="mono" id="terminal-log">
                <div>[SYSTEM] INITIALIZING ANIMUS PROXY...</div>
                <div>[SYSTEM] ESTABLISHING NEURAL LINK...</div>
                <div>[SYSTEM] BYPASSING ABSTERGO FIREWALLS...</div>
            </div>
            
            <div className="sync-rings-container">
                <svg viewBox="0 0 100 100" className="sync-ring ring-1"><circle cx="50" cy="50" r="45"/></svg>
                <svg viewBox="0 0 100 100" className="sync-ring ring-2"><circle cx="50" cy="50" r="35"/></svg>
                <svg viewBox="0 0 100 100" className="sync-ring ring-3"><circle cx="50" cy="50" r="25"/></svg>
                <div className="ring-core"></div>
            </div>

            <button 
                className="sync-btn mono interactive" 
                onClick={() => setCurrentState(APP_STATE.LORE)}
            >
                Initiate Synchronization
            </button>
            <div className="mono text-gray-600 mt-8 text-sm tracking-[0.5em] animate-pulse">CONNECTING TO HOST...</div>
        </div>
    );
}
