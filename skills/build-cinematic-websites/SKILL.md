---
name: build-cinematic-websites
description: Build, recreate, or upgrade premium cinematic websites with advanced motion graphics, scroll-driven storytelling, keyframed timelines, WebGL/Three.js scenes, shaders, particle systems, 3D transitions, pointer interactions, and production-ready responsive behavior. Use for experiential landing pages, immersive portfolios, interactive brand stories, creative-development sites, award-style microsites, WebGL hero sections, GSAP or Motion animation systems, and requests to analyze or reproduce the interaction language of a reference website.
---

# Build Cinematic Websites

Create an intentional interactive experience, not a collection of unrelated effects. Treat art direction, narrative, motion, interaction, performance, accessibility, and responsive behavior as one system.

## Operating principles

- Lead with a working experience. Inspect, implement, test, and iterate instead of only describing an approach.
- Preserve the user's content and brand intent while translating reference-site techniques into an original visual system.
- Use motion to explain hierarchy, state, depth, or progression. Remove effects that add noise without meaning.
- Build a strong static composition before adding animation.
- Prefer one memorable interaction per scene over many weak interactions.
- Keep essential navigation and content in semantic HTML. Treat Canvas and WebGL as progressive enhancement.
- Adapt complexity to device capability and reduced-motion preferences.
- Never claim that a WebGL path works based only on a successful static render. Validate initialization, interaction, resize, cleanup, and fallback behavior.

## Execute this workflow

### 1. Inspect the project and constraints

Before editing:

1. Read project instructions and inspect the existing framework, package manager, scripts, styles, assets, and hosting configuration.
2. Preserve unrelated user changes.
3. Identify the target browsers, device classes, content requirements, accessibility needs, and performance budget.
4. Inspect reference websites directly when permitted. Record composition, typography, spatial rhythm, motion grammar, interaction triggers, scene transitions, and fallback behavior.
5. Separate reusable techniques from copyrighted identity. Recreate the interaction principles, not proprietary text, branding, illustrations, or source code.

For an existing experience, map:

- Current route and component structure
- Rendering layers and z-index order
- Scroll or gesture state
- Animation ownership
- GPU-heavy sections
- Breakpoints and reduced-motion behavior
- Deployment and verification workflow

### 2. Write a motion brief

Define the experience in plain language before coding:

- **Premise:** What should the visitor feel?
- **Narrative arc:** What changes from entrance to conclusion?
- **Hero action:** What is the first meaningful interaction?
- **Motion grammar:** Smooth, elastic, mechanical, organic, editorial, or cinematic
- **Depth model:** Flat layers, 2.5D parallax, or full 3D
- **Signature moment:** The single most memorable transition or response
- **Exit state:** What should remain after the sequence completes?

Then define 3–7 scenes. Give every scene:

- A normalized time range from `0` to `1`
- A visual state
- A copy state
- An entry transition
- A primary interaction
- An exit transition
- A lightweight fallback

Avoid starting implementation until this scene map is coherent.

### 3. Choose the rendering stack deliberately

Use the lightest stack capable of the intended result:

| Need | Preferred approach |
|---|---|
| Text reveals, layout transitions, UI feedback | CSS transitions/keyframes or Motion |
| Sequenced timelines, pinning, scrubbed scroll | GSAP timeline and ScrollTrigger |
| React-first spring motion | Motion |
| Vector morphs and illustrated motion | SVG with GSAP or Motion |
| Thousands of particles or procedural fields | WebGL shaders |
| Real 3D geometry, lighting, cameras, post-processing | Three.js or React Three Fiber |
| Small decorative noise or gesture traces | Canvas 2D |
| Frame-by-frame hero animation | Optimized image sequence or video |

Do not introduce WebGL only to animate DOM text. Do not animate thousands of DOM nodes.

Use React Three Fiber when declarative React composition materially improves the scene. Use direct Three.js when precise lifecycle control, minimal abstraction, or custom rendering architecture matters more.

### 4. Design the motion architecture

Use one normalized progress value as the source of truth for scroll-led experiences:

```ts
type MotionState = {
  target: number;
  current: number;
  velocity: number;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

function smoothstep(start: number, end: number, value: number) {
  const t = clamp01((value - start) / (end - start));
  return t * t * (3 - 2 * t);
}
```

Update `target` from input and interpolate `current` inside one animation loop. Derive scenes, camera position, shader uniforms, DOM transitions, and progress UI from `current`.

Do not let multiple components own competing scroll listeners or animation loops. Centralize:

- Virtual scroll or native scroll mapping
- Current progress
- Pointer position and velocity
- Active scene
- Input locking
- Reduced-motion state
- Renderer quality level

Keep rapidly changing animation values in refs, stores, or engine objects. Avoid React state updates on every frame.

### 5. Build keyframes as data

Represent motion states explicitly instead of scattering magic numbers across components:

```ts
type Keyframe = {
  at: number;
  cameraZ: number;
  cameraX: number;
  bloom: number;
  portalOpacity: number;
  copyOpacity: number;
};

const keyframes: Keyframe[] = [
  { at: 0.00, cameraZ: 8.5, cameraX: 0.0, bloom: 0.4, portalOpacity: 1, copyOpacity: 1 },
  { at: 0.30, cameraZ: 6.8, cameraX: 0.2, bloom: 0.7, portalOpacity: 0, copyOpacity: 0 },
  { at: 0.72, cameraZ: 4.4, cameraX: 0.0, bloom: 0.9, portalOpacity: 0, copyOpacity: 1 },
  { at: 1.00, cameraZ: 6.0, cameraX: 0.0, bloom: 0.5, portalOpacity: 0, copyOpacity: 1 },
];
```

Interpolate between neighboring keyframes. Keep visual timing editable without rewriting renderer logic.

For GSAP, label timeline sections:

```ts
const timeline = gsap.timeline({ paused: true });

timeline
  .addLabel("intro", 0)
  .from(".eyebrow", { opacity: 0, y: 18, duration: 0.6 }, "intro")
  .from(".headline-line", { yPercent: 110, stagger: 0.08, duration: 0.9 }, "intro+=0.1")
  .addLabel("portal", 1.1)
  .to(camera.position, { z: 4.8, duration: 1.6, ease: "power2.inOut" }, "portal");
```

For scrubbed timelines, map normalized progress to timeline progress rather than firing many independent tweens.

### 6. Construct a layered scene

Use a predictable composition:

1. Static color or gradient fallback
2. WebGL or Canvas world
3. Atmospheric overlays such as grain, vignette, or scan lines
4. Semantic copy and navigation
5. Interaction controls and progress feedback

For WebGL, separate the scene into functional groups:

- Background field
- Hero object
- Transition geometry
- Environmental depth
- Interactive effects
- Post-processing

Create one renderer, one resize handler, and normally one request-animation-frame loop.

Dispose of geometries, materials, textures, render targets, composers, and listeners on unmount.

### 7. Create advanced WebGL motion

Prefer GPU-side animation for large systems. Pass time, progress, pointer, velocity, and scene parameters as uniforms:

```glsl
uniform float uTime;
uniform float uProgress;
uniform vec2 uPointer;

void main() {
  vec3 p = position;
  float wave = sin(p.x * 0.45 + uTime) * cos(p.y * 0.35 - uTime * 0.7);
  p.y += wave * mix(0.08, 0.32, uProgress);
  p.x += uPointer.x * 0.18;

  vec4 viewPosition = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * viewPosition;
}
```

Use these techniques selectively:

- Vertex displacement for organic surfaces
- Fragment shaders for fresnel glow, iridescence, noise, masks, or dissolves
- Instancing for repeated geometry
- Buffer geometry for particles
- Render targets for trails, feedback, portals, or transitions
- Raycasting for object-level input
- Post-processing for subtle bloom, depth of field, chromatic shift, or grain
- Physics only when it materially improves response

Keep post-processing restrained. Bloom should reinforce luminous materials, not wash out typography.

### 8. Add meaningful interactions

Support several input modes while keeping one primary action:

- Pointer position for parallax or lighting
- Pointer velocity for intensity or distortion
- Click/tap for an impulse, ripple, or scene event
- Drag for orbit, displacement, or object manipulation
- Hold for charging, resistance, or transformation
- Scroll for narrative progression
- Keyboard for equivalent controls
- Device orientation only as optional enhancement

Make interaction legible. Use a small cue such as `DRAG / ORBIT` or animate the object slightly to demonstrate affordance.

Do not trap the user. Provide a skip, replay, or direct navigation mechanism when the sequence controls access to content.

### 9. Direct typography like motion graphics

Keep text in HTML whenever possible. Use clipping wrappers and line-level animation:

```css
.line-mask {
  overflow: hidden;
}

.line-mask > span {
  display: block;
  transform: translateY(110%);
}
```

Use:

- Staggered line reveals
- Variable font axes
- Tracking and weight modulation
- Masked wipes
- Blur-to-sharp transitions
- Counter-motion between serif and sans-serif lines

Avoid animating every word. Preserve reading time and contrast.

### 10. Make motion responsive

Do not merely scale the desktop scene down.

For smaller screens:

- Reduce particle and instance counts
- Cap device pixel ratio
- Simplify post-processing
- Reframe the camera
- Enlarge touch targets
- Shorten travel distances
- Replace hover-only effects
- Keep copy within safe regions
- Hide low-value atmospheric layers

Use capability-based quality tiers when helpful:

```ts
const quality =
  window.innerWidth < 640 ? "low" :
  navigator.hardwareConcurrency <= 4 ? "medium" :
  "high";
```

Treat this as a heuristic, then allow runtime degradation if frame time remains high.

### 11. Protect performance

Set budgets before polishing:

- Target 60 FPS on capable desktops and a stable 30–60 FPS on mobile.
- Avoid per-frame object allocation.
- Reuse vectors, matrices, geometries, and materials.
- Use instancing and texture atlases.
- Pause rendering when the document is hidden.
- Lazy-load non-critical 3D scenes and compressed assets.
- Use Draco, Meshopt, KTX2, WebP, or AVIF where appropriate.
- Keep the initial experience useful before the largest visual payload finishes.
- Monitor bundle size, draw calls, triangle count, texture memory, and post-processing passes.

Prefer a visually simpler stable experience over an unstable maximal one.

### 12. Provide graceful fallback and accessibility

Always implement:

- A CSS gradient or static visual beneath WebGL
- A catch path for WebGL context creation failure
- Semantic HTML content that remains available without Canvas
- Keyboard-operable controls
- Visible focus styles
- Appropriate ARIA labels for interaction controls
- A `prefers-reduced-motion` mode
- Sufficient color contrast

In reduced-motion mode, preserve scene meaning with fades or direct state changes. Do not simply leave elements hidden at their pre-animation state.

### 13. Validate the experience

Run project linting and the production build. Then test the actual interface.

Validate:

- First load with empty cache
- WebGL initialization and fallback
- Resize and orientation changes
- Mouse, trackpad, keyboard, touch, and high-DPI behavior
- Every timeline boundary
- Rapid scrolling and reverse scrolling
- Repeated replay
- Component unmount and remount
- Background-tab recovery
- Reduced-motion mode
- Desktop and mobile layouts
- Text readability over bright frames
- Missing assets and console errors

Test at least one low-powered configuration or throttled profile. Record any browser environment that disables GPU rendering so the fallback result is not mistaken for the WebGL result.

### 14. Finish the work

Remove debugging controls, dead shaders, unused assets, and unexplained magic numbers. Keep any useful visual tuning controls behind a development flag.

Deliver:

- The working implementation
- A concise summary of the motion system
- Interaction instructions
- Verification results
- Any known device limitations
- The production or preview URL when deployment is requested

## Quality bar

Reject the result and iterate when:

- Motion feels ornamental instead of narrative
- Text becomes hard to read during animation
- Scroll input feels delayed or trapped
- Scene cuts are abrupt without intent
- Mobile is only a cropped desktop experience
- WebGL failure leaves a blank screen
- The first meaningful frame takes too long to appear
- Multiple effects compete for attention
- Reduced-motion users lose content
- Replay or resize produces duplicate renderers or listeners

Consider the experience complete only when it remains compelling as a static composition, becomes clearer through motion, responds naturally to input, and degrades without breaking.
