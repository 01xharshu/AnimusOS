import re

with open('index.html', 'r') as f:
    html = f.read()

# Extract styles
style_match = re.search(r'<style>(.*?)</style>', html, re.DOTALL)
styles = style_match.group(1) if style_match else ''

# Extract body contents (excluding the script tag at the end if we can)
body_match = re.search(r'<body>(.*?)</body>', html, re.DOTALL)
body_content = body_match.group(1) if body_match else ''

# Separate script from body
script_match = re.search(r'<script>(.*?)</script>', body_content, re.DOTALL)
script = script_match.group(1) if script_match else ''

# Remove script from body HTML
if script_match:
    body_content = body_content.replace(script_match.group(0), '')

# Replace some HTML syntax with JSX syntax
jsx_content = body_content.replace('class=', 'className=')
# Fix self-closing tags
jsx_content = re.sub(r'<img(.*?)(?<!/)>', r'<img\1/>', jsx_content)
jsx_content = re.sub(r'<br>', r'<br/>', jsx_content)
# Convert style="..." to style={{...}}
# Just clear them out for simplicity if any exist, or leave if not too many
# For AnimusOS, there are very few inline styles. Let's handle 'style="color: var(--animus-cyan);"'
jsx_content = jsx_content.replace('style="color: var(--animus-cyan);"', 'style={{ color: "var(--animus-cyan)" }}')

with open('src/app/globals.css', 'a') as f:
    f.write('\n' + styles)

page_tsx = f"""\"use client\";

import {{ useEffect }} from 'react';
import Script from 'next/script';
import * as THREE from 'three';
import gsap from 'gsap';

export default function Home() {{
    useEffect(() => {{
        if (typeof window === 'undefined') return;
        
        // Ensure that script is run only once
        if ((window as any).__animus_initialized) return;
        (window as any).__animus_initialized = true;

        {script}
        
    }}, []);

    return (
        <main>
            {jsx_content}
            <Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" strategy="beforeInteractive" />
            <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" strategy="beforeInteractive" />
        </main>
    );
}}
"""

with open('src/app/page.tsx', 'w') as f:
    f.write(page_tsx)
    
print("Converted successfully.")
