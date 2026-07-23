import os

# --- PAGE ---
with open('src/app/page.tsx', 'w') as f:
    f.write("""'use client';
import { AppProvider } from '@/context/AppContext';
import CustomCursor from '@/components/CustomCursor';
import WebGLBackground from '@/components/WebGLBackground';
import BootScreen from '@/components/BootScreen';
import LoreLayer from '@/components/LoreLayer';
import AbstergoSplash from '@/components/AbstergoSplash';
import HelixArchive from '@/components/HelixArchive';

export default function Home() {
    return (
        <AppProvider>
            <CustomCursor />
            <WebGLBackground />
            <BootScreen />
            <LoreLayer />
            <AbstergoSplash />
            <HelixArchive />
        </AppProvider>
    );
}
""")

