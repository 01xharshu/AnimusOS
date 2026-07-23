---
name: choreograph-parallax-depth
description: Design, implement, and refine sophisticated parallax systems using scroll, pointer movement, velocity, camera motion, CSS transforms, Canvas, WebGL, and layered 2.5D composition. Use for immersive landing pages, spatial storytelling, depth-rich hero sections, cinematic scroll sequences, layered editorial layouts, product reveals, camera fly-throughs, or requests for advanced parallax that feels intentional rather than like uniformly moving background layers.
---

# Choreograph Parallax Depth

Create perceived space with stable visual logic. Parallax is choreography between layers, not a multiplier applied to every element.

## Define the depth thesis

Write one sentence:

> The visitor moves through a quiet archive: typography stays physically near while imagery recedes and environmental fragments pass at the edges.

Define:

- Viewer position
- Camera direction
- Stable anchor
- Focal subject
- Foreground behavior
- Background behavior
- Maximum motion intensity
- Narrative reason for moving through depth

Do not add parallax until the static composition has a clear foreground, middle ground, and background.

## Build a depth map

Assign each element:

```ts
type DepthLayer = {
  id: string;
  z: number;
  scrollFactor: number;
  pointerFactor: number;
  blur: number;
  scale: number;
  opacityRange: [number, number];
  motionLimit: number;
  role: "anchor" | "subject" | "environment" | "transition" | "ui";
};
```

Use a small number of meaningful depth bands:

- Far environment
- Background structure
- Subject plane
- Near atmosphere
- Foreground interruption
- Anchored interface

Do not give adjacent objects nearly identical speeds unless they belong to the same plane.

## Choose the parallax model

Use the simplest model that creates the intended space:

### CSS 2.5D

Use transforms, sticky sections, perspective, and clipping for editorial layers and moderate depth.

### Scroll-linked timeline

Use GSAP or Motion when scenes need precise start, hold, transition, and exit phases.

### Canvas

Use for dense 2D particles, image fragments, or mask-driven depth.

### WebGL camera

Use when depth, occlusion, lighting, perspective, or geometry must behave consistently in 3D.

Do not mix independent CSS and WebGL camera movement without one shared progress model.

## Normalize motion inputs

Maintain:

```ts
type ParallaxInput = {
  scrollTarget: number;
  scrollCurrent: number;
  scrollVelocity: number;
  pointerTarget: { x: number; y: number };
  pointerCurrent: { x: number; y: number };
  direction: -1 | 0 | 1;
};
```

Interpolate input inside one animation loop.

```ts
current += (target - current) * damping;
```

Use separate damping for:

- Camera
- Background
- Foreground
- Pointer light
- UI

This creates material difference without random easings.

## Map depth perceptually

Use nonlinear motion:

```ts
function depthResponse(z: number) {
  return Math.sign(z) * Math.pow(Math.abs(z), 1.35);
}
```

- Far layers move subtly.
- Subject layers move enough to establish space.
- Near fragments move faster but appear rarely.
- Anchored UI moves minimally or not at all.

Avoid moving body text at a speed that harms reading.

## Choreograph scenes

Divide scroll into scenes:

1. Establish space
2. Approach the subject
3. Cross or orbit the subject
4. Reveal hidden depth
5. Settle into a readable destination

For every scene specify:

- Camera position and target
- Stable anchor
- Visible layers
- Occlusion order
- Copy behavior
- Entry and exit velocity
- Transition overlap

Hold important compositions long enough to be understood.

## Create parallax patterns with intent

Use selectively:

- **Editorial window:** Image moves behind a stable clipped frame
- **Depth corridor:** Foreground edges pass while the subject stays centered
- **Horizon reveal:** Vertical motion changes the visible spatial plane
- **Object orbit:** Pointer adds a small orthogonal camera offset
- **Layer exchange:** Background becomes foreground through scale and occlusion
- **Spatial typography:** Large type occupies depth while readable copy remains anchored
- **Portal transition:** Mask, camera, and lighting converge at one threshold
- **Product disassembly:** Components separate by depth before reassembling

Do not use all patterns in one page.

## Use pointer parallax as secondary motion

Map pointer movement relative to the viewport center. Smooth and clamp it.

```ts
const nx = (pointerX / width) * 2 - 1;
const ny = -((pointerY / height) * 2 - 1);
const offsetX = nx * layer.pointerFactor;
const offsetY = ny * layer.pointerFactor;
```

Use pointer velocity for temporary energy, not continuous drift.

Return gracefully to rest when the pointer leaves.

Never make essential information reachable only through hover.

## Preserve spatial continuity

Maintain at least one visual relationship through every transition:

- Subject position
- Horizon line
- Light direction
- Motion direction
- Color field
- Repeated geometry

Without continuity, parallax becomes a sequence of unrelated slide effects.

## Control occlusion and readability

- Keep semantic copy above visually unstable layers.
- Add local contrast behind text rather than darkening the entire scene.
- Prevent foreground objects from repeatedly crossing important controls.
- Use blur and scale consistently with the depth model.
- Avoid full-screen motion directly behind long-form text.
- Freeze or simplify the scene during forms and transactional tasks.

## Reframe for mobile

Mobile parallax should:

- Use fewer layers
- Reduce camera travel
- Avoid hover dependence
- Respect browser scroll behavior
- Recompose focal points for portrait
- Use tap or device tilt only as optional enhancement
- Cap foreground speed
- Preserve a readable anchor

Do not simply reduce every multiplier by the same percentage.

## Protect comfort and accessibility

Provide reduced-motion behavior:

- Remove large camera translation
- Replace depth travel with fades, masks, or direct scene changes
- Preserve all content and state changes
- Disable velocity-reactive distortion

Avoid:

- Continuous uncontrolled camera sway
- Rapid zoom
- Strong rotational parallax
- Opposing full-screen movement
- Scroll hijacking that prevents user control

## Optimize

- Animate transforms and shader uniforms rather than layout properties.
- Reuse one animation loop.
- Avoid per-frame allocations.
- Limit high-resolution blur and filters.
- Cap device pixel ratio.
- Reduce particle and layer counts on small devices.
- Pause when hidden or offscreen.
- Use will-change only for actively animated elements.
- Remove will-change after temporary animation when practical.

## Validate

Test:

- Slow and fast scrolling
- Reverse direction
- Trackpad and mouse wheel
- Touch momentum
- Resize and orientation
- High-DPI screens
- Low frame rate
- Reduced motion
- Text readability at every scene
- Scene boundaries and direct jumps
- Repeated replay

Record the experience and inspect whether depth remains coherent when played slowly.

## Deliver

Provide:

- Depth thesis
- Layer map
- Input and damping model
- Scene timeline
- Desktop and mobile choreography
- Reduced-motion equivalent
- Performance strategy
- Interaction instructions
- Validation results

Consider the work complete only when the parallax clarifies depth and narrative, preserves user control, and still produces a strong composition when motion stops.
