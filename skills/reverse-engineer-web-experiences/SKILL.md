---
name: reverse-engineer-web-experiences
description: Analyze sophisticated public websites and convert their visual language, layout system, animation timing, interaction model, rendering approach, responsive behavior, and performance strategy into an evidence-backed implementation blueprint or original recreation. Use when a user shares a website URL and asks how it was made, wants to reproduce its feel, needs a technical teardown, wants a motion specification, or wants an advanced reference site rebuilt without copying proprietary identity or source code.
---

# Reverse Engineer Web Experiences

Turn observable behavior into a buildable system. Distinguish evidence from inference.

## Establish the target

Clarify whether the output is:

- A visual and technical analysis
- A motion and interaction specification
- A proof of concept
- A close structural recreation with original branding
- A production implementation

Record the required fidelity, routes, devices, content, assets, and deployment target.

## Inspect the live experience

Use permitted public-web tools to observe the site. Do not attempt to bypass authentication, paywalls, access restrictions, or anti-bot protections.

Capture evidence at:

- Initial load
- Before and after the first interaction
- Each major scroll threshold
- Hover, click, drag, hold, and keyboard states
- Desktop and narrow viewports
- Reduced-motion mode when available
- WebGL-disabled or low-capability behavior

Reload after destructive or one-time sequences so every state is observed cleanly.

## Build an evidence ledger

Record each finding:

| Observation | Evidence | Confidence | Likely implementation |
|---|---|---|---|
| Copy remains sharp above 3D scene | DOM inspection and selection behavior | High | Semantic HTML overlay |
| Particles deform around pointer | Pointer test | High | Shader uniform or GPU simulation |
| Scroll feels eased | Input versus visual delay | Medium | Virtual scroll or progress interpolation |

Label uncertain stack detection as inference. Do not present library guesses as facts.

## Decompose the experience

Map five systems:

### Composition

- Grid and safe areas
- Typography scale and line breaks
- Layer order
- Negative space
- Color and contrast
- Repeated layout rules

### Narrative

- Scene order
- Information revealed per scene
- Progression logic
- Entry and exit states
- Signature moment

### Motion

- Trigger
- Delay
- Duration
- Easing
- Stagger
- Direction
- Continuity across scenes
- Relationship to input velocity

### Interaction

- Available actions
- Discoverability cues
- Input-to-output mapping
- State transitions
- Completion and recovery

### Rendering

- DOM, SVG, Canvas 2D, WebGL, video, image sequence, or hybrid
- Camera and depth model
- Particles, shaders, lighting, post-processing
- Asset formats
- Likely performance strategy

## Create a motion capture map

Represent the experience as normalized progress:

```ts
type ObservedScene = {
  id: string;
  range: [number, number];
  copyState: string;
  visualState: string;
  cameraState: string;
  interaction: string;
  transition: string;
};
```

Estimate timing numerically:

- Use screen recording or repeated observation
- Measure relative rather than absolute timing when scroll controls playback
- Identify easing from acceleration and deceleration shape
- Note whether transitions are time-driven, input-driven, or state-driven

## Infer architecture conservatively

Use observable evidence to choose a plausible implementation:

- DOM transforms for layout-bound elements
- GSAP or Motion for sequenced interface animation
- Canvas for dense 2D visuals
- Three.js or React Three Fiber for 3D scenes
- Shaders for large procedural systems
- Video or image sequences for pre-rendered photorealism

Provide alternatives when multiple stacks could create the same result.

Do not reproduce minified source, private APIs, proprietary copy, protected assets, logos, or distinctive illustrations without permission.

## Translate, do not trace

Preserve these transferable qualities:

- Density
- Rhythm
- Contrast
- Depth
- Interaction intensity
- Scene pacing
- Editorial hierarchy

Change:

- Brand identity
- Copy
- Iconography
- Proprietary imagery
- Exact geometry
- Distinctive signature assets

Make the new work recognizably original while matching the reference's level of craft.

## Produce the implementation blueprint

Specify:

- Component tree
- Rendering-layer diagram
- Scene data model
- Timeline ownership
- Input architecture
- Asset pipeline
- Breakpoints
- Quality tiers
- Fallback states
- Accessibility behavior
- Testing plan

Example:

```txt
Experience
├── SemanticHeader
├── WebGLStage
│   ├── Atmosphere
│   ├── HeroObject
│   └── TransitionSystem
├── SceneCopy
├── InteractionCue
└── ProgressIndicator
```

## Build in fidelity passes

Implement in this order:

1. Static composition
2. Scene state changes
3. Primary timeline
4. Hero interaction
5. Rendering detail
6. Responsive reframing
7. Performance and fallback
8. Final timing polish

Avoid polishing shaders before the narrative and layout are correct.

## Compare systematically

Use side-by-side screenshots or recordings at the same viewport and scene state.

Compare:

- Silhouette and composition
- Text position and scale
- Depth and camera framing
- Transition timing
- Pointer response
- Scene continuity
- Mobile composition

Fix structural differences before color micro-adjustments.

## Deliver

For analysis, provide:

- What is directly observed
- What is inferred
- The likely stack
- The scene and motion map
- The reconstruction plan
- Difficulty, risks, and performance implications

For implementation, also provide:

- The working code
- Interaction instructions
- Responsive and fallback behavior
- Validation results
- Preview or production URL when requested

Do not call a recreation accurate until the major scenes, interaction states, mobile framing, and fallback path have been tested.
