import os

# --- DATA ---
with open('src/data/loreData.ts', 'w') as f:
    f.write("""export const svgIsu = `<svg class="svg-icon" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2"><path d="M50 5 L95 85 L50 95 L5 85 Z" /><circle cx="50" cy="65" r="15" /><path d="M50 5 L50 50" stroke-dasharray="2 4"/><path d="M25 50 L75 50" stroke-dasharray="2 4"/></svg>`;
export const svgApple = `<svg class="svg-icon" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2"><circle cx="50" cy="50" r="40"/><circle cx="50" cy="50" r="25" stroke-dasharray="4 6"/><path d="M50 10 C 80 30, 80 70, 50 90 C 20 70, 20 30, 50 10 Z" fill="currentColor" fill-opacity="0.15"/><circle cx="50" cy="50" r="5" fill="currentColor"/></svg>`;
export const svgTemplar = `<svg class="svg-icon" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3"><path d="M50 10 L65 35 L90 50 L65 65 L50 90 L35 65 L10 50 L35 35 Z" fill="currentColor" fill-opacity="0.2"/><circle cx="50" cy="50" r="20" stroke-width="1" stroke-dasharray="2 4"/></svg>`;
export const svgAssassin = `<svg class="svg-icon" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M50 5 L90 95 L50 75 L10 95 Z" fill="currentColor" fill-opacity="0.15"/><path d="M50 40 L65 80 L50 70 L35 80 Z" stroke-width="1.5"/></svg>`;
export const svgHelix = `<svg class="node-icon" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10 C 80 50, 20 50, 80 90" stroke-dasharray="3 5"/><path d="M80 10 C 20 50, 80 50, 20 90" stroke-dasharray="3 5"/><circle cx="50" cy="28" r="4" fill="currentColor"/><circle cx="50" cy="72" r="4" fill="currentColor"/><circle cx="50" cy="50" r="5" fill="currentColor"/></svg>`;

export const loreData = [
    { id: "SEQ_01", theme: "#ffb700", era: "75,000 BCE", title: "THE ISU ERA", icon: svgIsu, text: "Long before written history, Earth was ruled by the Isu—a highly advanced, trinary-DNA species. They forged humanity in their image, genetically modifying primates to create a docile, controllable workforce. We were not their children; we were their engineered tools.", audio: "We were the First Civilization. We built you to serve. But we profoundly underestimated the volatile nature of the human spirit." },
    { id: "SEQ_02", theme: "#ffb700", era: "75,000 BCE", title: "PIECES OF EDEN", icon: svgApple, text: "To ensure absolute obedience from their human slaves, the Isu engineered the Pieces of Eden. These technological marvels manipulated a specific neurotransmitter built directly into the human brain, forcing compliance, bending reality, and subduing rebellion.", audio: "The artifacts were mathematical perfection. Designed for control. A single pulse from an Apple could force an entire city to its knees." },
    { id: "SEQ_03", theme: "#ff2a2a", era: "THE IDEOLOGY", title: "THE SCHISM", icon: svgTemplar, text: "Following the extinction of the Isu via a catastrophic solar flare, humanity inherited the earth. The Templar Order rose from the ashes, believing humanity is inherently chaotic and flawed. They seek to use surviving Isu technology to enforce order, guidance, and strict control.", audio: "Humanity is a chaotic, frightened child. Left alone, it will burn the house down. We provide the structure they secretly crave." },
    { id: "SEQ_04", theme: "#00e5ff", era: "THE IDEOLOGY", title: "THE BROTHERHOOD", icon: svgAssassin, text: "Standing against the Templars are the Assassins. They believe Free Will, though messy and dangerous, is fundamentally better than a gilded cage. For millennia, they have fought in the shadows to keep Pieces of Eden out of the hands of tyrants.", audio: "Nothing is true, everything is permitted. We work in the dark, to serve the light. Free will is our most sacred right." }
];

export const gameData = [
    { id: "HLX_01", era: "431 BCE", title: "ODYSSEY", subtitle: "THE PELOPONNESIAN WAR", text: "Kassandra, a legendary Spartan mercenary, wields the Spear of Leonidas. She dismantles the secretive Cult of Kosmos and ultimately secures the Staff of Hermes Trismegistus, achieving immortality to guard it across millennia.", audio: "Before the Hidden Ones, there was the Eagle Bearer. She walked among gods and monsters, altering the fate of Greece." },
    { id: "HLX_02", era: "49 BCE", title: "ORIGINS", subtitle: "PTOLEMAIC EGYPT", text: "Bayek of Siwa, the last Medjay, seeks vengeance for his son's murder. Alongside his wife Aya, they unravel the Order of the Ancients and establish the Hidden Ones, the precursors to the Assassin Brotherhood.", audio: "From the shifting sands of Egypt, vengeance birthed a creed. Bayek and Aya laid the eternal foundation in the shadows." },
    { id: "HLX_03", era: "861 CE", title: "MIRAGE", subtitle: "GOLDEN AGE BAGHDAD", text: "Basim Ibn Ishaq transforms from a street thief into a Master Assassin. Plagued by terrifying visions, he ultimately uncovers his true, horrifying nature as the reincarnation of the Isu Loki.", audio: "A thief in Baghdad, a vengeful god in disguise. Basim's journey permanently blurred the lines between ancient past and present." },
    { id: "HLX_04", era: "873 CE", title: "VALHALLA", subtitle: "THE VIKING EXPANSION", text: "Eivor Wolf-Kissed leads her Raven Clan to England. She battles the remnants of the Order of the Ancients and discovers she is the reincarnation of Odin, ultimately rejecting Isu manipulation for her own humanity.", audio: "Destiny called her Odin, but Eivor chose her own path. She defied the ancient gods themselves to forge her own saga." },
    { id: "HLX_05", era: "1191 CE", title: "AC I", subtitle: "THE THIRD CRUSADE", text: "Altaïr Ibn-La'Ahad hunts nine Templars to restore his stripped honor. He reclaims the Apple of Eden from his corrupted mentor, Al Mualim, and begins a lifelong journey of reforming the Brotherhood's tenets.", audio: "The original Master. Altaïr stripped away systemic corruption to forge a Brotherhood guided by wisdom and restraint." },
    { id: "HLX_06", era: "1476 CE", title: "EZIO TRILOGY", subtitle: "THE RENAISSANCE", text: "Ezio Auditore da Firenze avenges his betrayed family, overthrows the tyrannical Borgias in Rome, and rebuilds the fractured Brotherhood. He serves as the Conduit, delivering Minerva's apocalyptic warning to the future.", audio: "From a flamboyant noble to the legendary Mentor. Ezio lived a profound life of tragedy, triumph, and revelation." },
    { id: "HLX_07", era: "1715 CE", title: "BLACK FLAG", subtitle: "GOLDEN AGE OF PIRACY", text: "Edward Kenway inadvertently enters the ancient war for profit. He races the Templars to the 'Observatory', a massive Isu surveillance device, eventually abandoning selfish pursuits for the noble cause of the Creed.", audio: "He fought for gold, but found a much higher purpose. For a time, the perilous seas belonged solely to him." },
    { id: "HLX_08", era: "1754 CE", title: "AC III & ROGUE", subtitle: "AMERICAN REVOLUTION", text: "Shay Cormac betrays the Assassins, decimating the Colonial Brotherhood. Years later, Ratonhnhaké:ton (Connor) rebuilds the Assassins from nothing, aiding the American Revolution while hunting his Templar father.", audio: "A brutal saga of betrayal and rebirth. Shay broke the New World, and Connor forged it anew in the fires of revolution." },
    { id: "HLX_09", era: "1789 CE", title: "UNITY", subtitle: "THE FRENCH REVOLUTION", text: "Arno Dorian seeks redemption in blood-soaked Paris. He uncovers a radical Templar plot and navigates a tragic love affair with Templar Elise, proving the ideological lines between factions are dangerously blurred.", audio: "In the starving streets of Paris, Arno learned firsthand that the Creed is a heavy, solitary burden." },
    { id: "HLX_10", era: "1868 CE", title: "SYNDICATE", subtitle: "INDUSTRIAL REVOLUTION", text: "Twins Jacob and Evie Frye liberate smog-choked London from Templar Grand Master Crawford Starrick. They build an underground gang, the Rooks, and secure the Shroud of Eden hidden beneath Buckingham Palace.", audio: "The grim industrial age brought dangerous new weapons. Together, the Frye twins conquered the underworld of London." }
];
""")

# --- CONTEXT ---
with open('src/context/AppContext.tsx', 'w') as f:
    f.write("""'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

export enum APP_STATE { BOOT, LORE, TRANSITION, HELIX, DEEPDIVE }

interface AppContextType {
    currentState: APP_STATE;
    setCurrentState: (state: APP_STATE) => void;
    currentLoreIndex: number;
    setCurrentLoreIndex: (index: number) => void;
    currentHelixIndex: number;
    setCurrentHelixIndex: (index: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [currentState, setCurrentState] = useState<APP_STATE>(APP_STATE.BOOT);
    const [currentLoreIndex, setCurrentLoreIndex] = useState(0);
    const [currentHelixIndex, setCurrentHelixIndex] = useState(0);

    return (
        <AppContext.Provider value={{ currentState, setCurrentState, currentLoreIndex, setCurrentLoreIndex, currentHelixIndex, setCurrentHelixIndex }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext must be used within AppProvider');
    return context;
}
""")

# --- CURSOR ---
with open('src/components/CustomCursor.tsx', 'w') as f:
    f.write("""'use client';
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
""")

# --- BOOT SCREEN ---
with open('src/components/BootScreen.tsx', 'w') as f:
    f.write("""'use client';
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
""")

