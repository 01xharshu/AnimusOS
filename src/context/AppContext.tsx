'use client';
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
