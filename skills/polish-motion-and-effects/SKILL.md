---
name: polish-motion-and-effects
description: Audit, redesign, and refine frontend animation timing, easing, keyframes, transitions, micro-interactions, masks, blur, grain, glow, refraction, distortion, particles, and post-processing so an interface feels premium, coherent, and responsive. Use when motion feels generic, stiff, floaty, excessive, inconsistent, mechanically correct but visually tasteless, or when an advanced website needs a final motion-design and effects-polish pass.
---

# Polish Motion and Effects

Edit motion with the same care as typography. Advanced motion is defined by timing, hierarchy, and restraint more than by the number of effects.

## Audit the existing motion

Record every animation:

- Trigger
- Duration
- Delay
- Easing
- Distance
- Scale
- Blur
- Opacity
- Stagger
- Interrupt behavior
- Reduced-motion behavior

Classify each as:

- Orientation
- Hierarchy
- Feedback
- Continuity
- Delight
- Atmosphere

Remove or redesign animations with no clear purpose.

## Define the motion character

Choose one dominant character:

- Precise and editorial
- Soft and atmospheric
- Elastic and tactile
- Mechanical and stepped
- Cinematic and spatial
- Energetic and reactive

Write three rules. Example:

1. Interface feedback is immediate and short.
2. Scene changes use slow spatial continuity.
3. Decorative atmosphere never competes with reading.

Do not use unrelated motion personalities across components.

## Create motion tokens

```ts
const motion = {
  duration: {
    instant: 0.12,
    quick: 0.22,
    standard: 0.45,
    expressive: 0.85,
    cinematic: 1.4,
  },
  ease: {
    enter: [0.16, 1, 0.3, 1],
    exit: [0.7, 0, 0.84, 0],
    move: [0.65, 0, 0.35, 1],
  },
  distance: {
    micro: 6,
    standard: 18,
    scene: 48,
  },
};
```

Use tokens as a family, then tune signature moments individually.

Avoid applying one easing curve to everything.

## Shape animation arcs

For each important transition design:

1. Preparation
2. Departure
3. Peak change
4. Arrival
5. Settle

Not every animation needs visible anticipation or overshoot. Use them when the material or action implies tension.

Keep interactive acknowledgment within roughly one frame whenever possible.

## Keyframe intentionally

Use keyframes to control changing relationships, not only start and end values.

```ts
const reveal = [
  { at: 0.00, y: 36, opacity: 0, blur: 12, scale: 0.985 },
  { at: 0.18, y: 28, opacity: 0.2, blur: 9, scale: 0.99 },
  { at: 0.72, y: 2, opacity: 1, blur: 0, scale: 1 },
  { at: 1.00, y: 0, opacity: 1, blur: 0, scale: 1 },
];
```

Inspect velocity at keyframe boundaries. Avoid accidental pauses and sudden acceleration.

## Direct entrances and exits differently

Entrances establish hierarchy. Exits preserve continuity.

- Let dominant elements arrive clearly.
- Let supporting elements follow with small stagger.
- Begin exits before the next scene fully enters.
- Keep a shared object, line, light, or motion direction across transitions.
- Avoid fading every element independently.

Do not animate all text from below by default.

## Control stagger

Use stagger to reveal structure:

- Lines within a headline
- Items in reading order
- Spatially related elements
- Cascading system response

Use small intervals. Stop staggering when the final item feels delayed rather than composed.

Vary stagger direction based on interaction direction or spatial origin.

## Build an effects palette

Select one primary and at most two supporting effect families:

### Optical

- Blur-to-focus
- Refraction
- Chromatic separation
- Fresnel light
- Depth of field

### Material

- Grain
- Glass
- Metallic reflection
- Paper texture
- Liquid deformation

### Transitional

- Masks
- Clip-path wipes
- Displacement
- Dissolve
- Light sweep

### Atmospheric

- Particles
- Bloom
- Fog
- Trails
- Scan lines

Keep all selected effects compatible with the same material story.

## Apply effects with hierarchy

- Primary effect: signature scene or hero
- Supporting effect: transitions or interactive response
- Ambient effect: low-intensity atmosphere

Do not apply glow to every border, icon, heading, and object.

Define effect limits:

```ts
type EffectBudget = {
  maximumBloomStrength: number;
  maximumBlurPx: number;
  maximumChromaticOffsetPx: number;
  particleCountByTier: Record<string, number>;
  simultaneousFullScreenPasses: number;
};
```

## Use the correct technology

Use:

- CSS transitions for simple state changes
- CSS keyframes for lightweight loops
- Motion for React state and springs
- GSAP for complex timelines and scroll choreography
- SVG masks and filters for vector effects
- Canvas for dense 2D atmosphere
- WebGL shaders for large procedural distortion or 3D post-processing

Do not use WebGL for an effect that CSS can render more clearly and cheaply.

## Refine micro-interactions

Every control should show:

- Rest
- Hover or focus
- Press
- Loading when applicable
- Success or completion
- Disabled state

Keep movement proportional to component size. Use color, light, and shape response before exaggerated travel.

Ensure keyboard focus receives an equivalent visual response.

## Polish scroll-driven motion

- Smooth input without making it feel delayed.
- Tie scrubbed animation to normalized progress.
- Add holds around important reading compositions.
- Avoid continuous motion at identical speed.
- Use velocity-reactive effects briefly.
- Make reverse scrolling coherent.
- Prevent scene state from desynchronizing during fast scroll.

## Review frame by frame

Record important sequences and inspect:

- First readable frame
- Peak distortion
- Layer overlaps
- Text contrast
- Direction changes
- Settle frame
- Reverse playback

Fix ugly intermediate frames even when the animation looks acceptable at normal speed.

## Add restraint passes

Perform:

1. Remove 30% of decorative motion.
2. Reduce effect intensity until hierarchy returns.
3. Restore only the effects whose absence is clearly felt.
4. Shorten interactions that delay user intent.
5. Increase stillness around important copy.

Premium motion needs contrast between movement and rest.

## Make it responsive and accessible

- Shorten travel on small screens.
- Reduce layered filters and particles.
- Replace hover-only effects.
- Preserve immediate touch response.
- Provide reduced-motion transitions that retain state and hierarchy.
- Avoid flashing and rapid high-contrast oscillation.
- Keep focus visible.
- Preserve semantic content outside effect layers.

## Validate

Test:

- Cold load
- Repeated entry and exit
- Interrupted animation
- Rapid state changes
- Reverse scroll
- Touch and keyboard
- Resize
- Low frame rate
- Reduced motion
- Background-tab return
- Route unmount and remount
- Visual consistency across sections

Check for duplicate timelines, stale listeners, and undisposed rendering resources.

## Deliver

Provide:

- Motion character and rules
- Motion tokens
- Revised keyframes and easings
- Effects palette and budget
- Before-and-after motion rationale
- Responsive and reduced-motion behavior
- Recorded or interactive validation

Consider the polish complete only when motion establishes hierarchy, effects share one visual logic, interactions respond immediately, and still frames remain carefully composed.
