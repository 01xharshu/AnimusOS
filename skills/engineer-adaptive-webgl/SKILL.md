---
name: engineer-adaptive-webgl
description: Profile, optimize, and productionize demanding WebGL, Three.js, React Three Fiber, Canvas, and shader-based frontend experiences with adaptive quality, runtime performance governors, GPU-memory discipline, context-loss recovery, progressive loading, and art-directed fallbacks. Use when an advanced visual website is slow, janky, overheating devices, crashing mobile browsers, shipping a large bundle, or needs to preserve creative quality across a wide hardware range.
---

# Engineer Adaptive WebGL

Preserve the creative idea while changing the cost of producing it. Do not solve every performance problem by removing the visual system.

## Measure before editing

Capture a baseline on representative desktop and mobile profiles:

- First contentful frame
- Time until interaction
- Main-thread blocking
- Average and worst frame time
- 1% low frame rate
- Draw calls
- Triangle and point count
- Texture memory estimate
- Render-target count and resolution
- Shader compile delay
- JavaScript bundle size
- Long-task count
- Memory after repeated navigation

Record the scene, viewport, pixel ratio, device class, and browser for every measurement.

## Find the limiting resource

Distinguish:

- CPU-bound animation or React rendering
- GPU-bound fragments, geometry, overdraw, or post-processing
- Memory-bound textures, buffers, or render targets
- Network-bound asset loading
- Shader compilation stalls
- Garbage-collection spikes
- Layout and paint work outside WebGL

Change one variable at a time and re-measure.

## Establish frame budgets

Use approximate budgets:

- 60 FPS: 16.7 ms per frame
- 45 FPS: 22.2 ms per frame
- 30 FPS: 33.3 ms per frame

Reserve time for input, layout, and browser work. Do not consume the full budget inside rendering.

Define visual priorities:

1. Essential silhouette and narrative
2. Primary object and interaction
3. Lighting and depth
4. Secondary geometry
5. Particles and atmosphere
6. Expensive post-processing

Degrade from the bottom of this list upward.

## Build explicit quality tiers

```ts
type QualityTier = "poster" | "low" | "medium" | "high" | "ultra";

type QualitySettings = {
  dpr: number;
  particleCount: number;
  shadowSize: number;
  bloom: boolean;
  bloomScale: number;
  antialias: boolean;
  geometryDetail: number;
  simulationRate: number;
};
```

Keep tier settings centralized. Do not scatter device checks throughout rendering components.

Choose an initial tier using:

- Viewport size
- Device pixel ratio
- Hardware concurrency
- Device memory when available
- Reduced-motion preference
- Battery or data-saving signals when available

Treat capability detection as a starting estimate, not proof of performance.

## Add a runtime performance governor

Sample smoothed frame time and change quality slowly:

```ts
let smoothedMs = 16.7;
let poorFrames = 0;
let strongFrames = 0;

function observeFrame(deltaMs: number) {
  smoothedMs += (deltaMs - smoothedMs) * 0.05;

  poorFrames = smoothedMs > 24 ? poorFrames + 1 : 0;
  strongFrames = smoothedMs < 15 ? strongFrames + 1 : 0;

  if (poorFrames > 90) lowerQuality();
  if (strongFrames > 360) raiseQuality();
}
```

- Use hysteresis so quality does not oscillate.
- Add a cooldown between tier changes.
- Lower one costly dimension at a time.
- Avoid changing shader defines every few seconds.
- Persist a stable tier for the session when appropriate.
- Never increase quality during an active critical interaction.

## Reduce GPU cost

Inspect:

- Excessive device pixel ratio
- Full-screen transparent layers
- Overdraw from large particles
- High-frequency fragment noise
- Too many dynamic lights
- Large shadow maps
- Multiple full-resolution post-processing passes
- High-detail geometry outside the focal region
- Unnecessary material variants

Apply:

- Dynamic resolution scaling
- Instanced meshes
- Level of detail
- Frustum and distance culling
- Shared geometry and materials
- Baked lighting
- Half-resolution effects
- Cheaper shader branches
- Early alpha discard only when it actually helps
- Reduced simulation frequency with interpolated rendering

Profile after every material change.

## Reduce CPU and framework cost

- Use one animation loop.
- Keep frame values out of React state.
- Avoid per-frame object allocation.
- Reuse vectors, matrices, arrays, and raycasters.
- Batch pointer processing.
- Throttle nonvisual analytics.
- Move heavy procedural generation to workers when transfer cost is justified.
- Precompute static paths and lookup tables.
- Prevent accidental component remounts.

Separate simulation frequency from rendering frequency when useful.

## Control assets and loading

- Lazy-load the 3D engine when the first frame does not need it.
- Show an art-directed poster immediately.
- Prioritize the hero asset.
- Stream or stage secondary assets.
- Compress meshes with Draco or Meshopt.
- Use KTX2/Basis textures when supported.
- Use WebP or AVIF for raster fallback.
- Limit texture dimensions to visible need.
- Avoid loading desktop assets on mobile.
- Precompile or warm important shaders during a quiet moment.

Do not hide long initialization behind an endless generic loader.

## Manage memory explicitly

Dispose of:

- Geometries
- Materials
- Textures
- Render targets
- Post-processing composers
- Controls
- Event listeners
- Workers
- Audio nodes

Audit repeated route transitions and replay. Memory should stabilize rather than climb indefinitely.

Do not dispose of shared resources until all consumers release them.

## Handle lifecycle and failure

Implement:

- Page Visibility pausing
- Intersection-based rendering pause when appropriate
- Resize and orientation recovery
- WebGL context lost and restored handlers
- Renderer initialization failure
- Asset-load timeout or failure
- A static or 2.5D fallback
- Reduced-motion behavior

Keep semantic content and critical controls outside WebGL.

## Preserve perceptual quality

When lowering quality:

- Keep the hero silhouette
- Keep timing and interaction responsiveness
- Reduce density before removing the entire effect
- Reduce background detail before foreground detail
- Lower effect resolution before disabling it
- Replace dynamic light with a baked or shader approximation
- Preserve color, composition, and focal contrast

Judge quality from normal viewing distance, not only debug wireframes.

## Validate across a device matrix

Test:

- High-end desktop GPU
- Integrated graphics
- Recent mobile
- Older or throttled mobile
- High-DPI display
- WebGL disabled
- Reduced-motion mode
- Background-tab return
- Repeated route navigation
- Rapid resize and orientation change
- Slow network and cold cache

Verify visual state at every tier. A low tier must look intentionally art-directed, not broken.

## Deliver

Provide:

- Baseline measurements
- Identified bottleneck
- Quality-tier table
- Runtime governor behavior
- Optimization changes
- Loading strategy
- Memory and lifecycle results
- Device test matrix
- Remaining risks

Consider the work complete only when performance is stable, quality changes are unobtrusive, resource cleanup is verified, and failure produces a designed fallback instead of a blank canvas.
