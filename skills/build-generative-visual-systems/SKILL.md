---
name: build-generative-visual-systems
description: Design and implement deterministic procedural visual systems for websites using seeded randomness, parametric composition, Canvas, SVG, WebGL, Three.js, instancing, particles, noise fields, and shaders. Use for generative brand identities, endlessly variable hero art, data-reactive graphics, procedural backgrounds, algorithmic layouts, interactive art direction, dynamic campaign systems, or requests for visuals that feel custom rather than template-based.
---

# Build Generative Visual Systems

Create a visual grammar that can produce many coherent outputs. Do not confuse uncontrolled randomness with generative design.

## Define the system

Write:

- The visual premise
- The invariant brand rules
- The allowed variation
- The input parameters
- The output surfaces
- The deterministic seed strategy
- The failure boundaries

Separate:

- **Constants:** palette, type, stroke character, spacing, contrast
- **Parameters:** density, scale, turbulence, symmetry, depth, speed
- **Inputs:** seed, content, data, pointer, audio, time, viewport
- **Outputs:** hero, section divider, card art, social export, motion loop

## Build a parameter contract

```ts
type GenerativeParameters = {
  seed: string;
  palette: string[];
  density: number;
  turbulence: number;
  symmetry: number;
  depth: number;
  motion: number;
  focalPoint: { x: number; y: number };
};
```

Clamp every parameter to an intentional range. Give parameters perceptual names rather than exposing raw shader constants.

## Make randomness deterministic

Use a seeded pseudo-random generator. The same seed and parameters must recreate the same composition.

```ts
function mulberry32(seed: number) {
  return () => {
    let value = seed += 0x6d2b79f5;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}
```

Do not call `Math.random()` inside the render loop.

Derive stable sub-seeds for layout, color, motion, and texture so changing one system does not reshuffle everything.

## Define a composition grammar

Choose a limited set of rules:

- Focal region
- Primary and secondary forms
- Alignment field
- Scale hierarchy
- Collision and overlap policy
- Empty-space minimum
- Edge behavior
- Contrast distribution
- Repetition and mutation

Use constraint solving, rejection sampling, or spatial indexing when simple placement creates collisions.

Maintain readable safe areas for copy and controls.

## Choose the renderer

Use:

- SVG for crisp, editable vector systems
- Canvas 2D for dense flat graphics and exported frames
- CSS for small decorative systems
- WebGL for large particle fields, realtime noise, fluid deformation, or 3D depth
- Pre-rendered assets when runtime generation adds no user value

Keep a shared parameter model when multiple renderers produce the same identity.

## Create procedural form

Combine a small number of techniques:

- Signed distance fields
- Curl noise and flow fields
- Voronoi or cellular structure
- L-systems and recursive branching
- Reaction-diffusion-inspired masks
- Instanced geometry
- Attractors and repellers
- Parametric curves
- Particle advection
- Domain-warped noise

Do not stack techniques without an art-direction reason.

## Use shaders as design rules

Pass brand parameters as uniforms:

```glsl
uniform float uTime;
uniform float uDensity;
uniform float uTurbulence;
uniform vec3 uColorA;
uniform vec3 uColorB;

void main() {
  float field = noise(vPosition * uDensity + uTime * 0.08);
  field = smoothstep(0.25, 0.78, field + uTurbulence * 0.2);
  vec3 color = mix(uColorA, uColorB, field);
  gl_FragColor = vec4(color, field);
}
```

Keep animation temporally coherent. Move through a noise field rather than replacing random values every frame.

## Make the system content-aware

Allow content or data to influence form without destroying the brand:

- Headline length changes focal width
- Category changes palette subset
- Numeric magnitude changes density or scale
- Sentiment changes tension or curvature
- User identity selects a stable seed
- Live data changes a bounded parameter

Never map critical data to an ambiguous visual without labels.

## Create controlled variation

Generate a contact sheet of at least 12 seeds. Evaluate:

- Brand consistency
- Focal clarity
- Copy safety
- Color balance
- Variety
- Failure cases

Promote strong seeds to curated presets. Blacklist or repair invalid outputs.

Build controls for:

- Seed
- Reroll
- Density
- Motion
- Palette
- Export
- Reset

Hide development controls in production unless user customization is part of the product.

## Animate the system

Use motion to reveal the rules:

- Assemble from the generating field
- Transition between seeds through shared structure
- Let pointer input bend rather than replace the composition
- Couple velocity to distortion
- Use scroll to change phase, density, or depth
- Return smoothly to a stable rest state

Avoid constant high-energy movement. Give the system breathing states.

## Support export and reuse

When required:

- Export SVG for vector systems
- Render high-resolution PNG frames
- Record deterministic loops
- Store seed and parameter metadata
- Generate responsive crops from the same seed
- Preserve transparent-background output

Ensure exported and runtime results use the same rules.

## Protect performance and accessibility

- Use instancing and typed arrays.
- Reuse buffers and materials.
- Cap pixel ratio and particle count.
- Pause offscreen or hidden rendering.
- Provide reduced-motion behavior.
- Keep semantic content outside the generative canvas.
- Provide a deterministic static poster fallback.
- Avoid flashing, excessive contrast oscillation, and high-frequency camera movement.

## Validate

Test:

- Repeatability with the same seed
- Variation across many seeds
- Extreme parameter values
- Wide, square, portrait, and mobile layouts
- Copy collisions
- Slow devices
- WebGL failure
- Reduced motion
- Long-running memory behavior
- Export fidelity

## Deliver

Provide:

- The visual grammar
- Parameter schema and bounds
- Seed strategy
- Renderer implementation
- Curated presets
- Interaction mapping
- Responsive and fallback modes
- Contact-sheet or multi-seed validation
- Export behavior when requested

Consider the system complete only when it produces diverse outputs that remain unmistakably part of the same identity.
