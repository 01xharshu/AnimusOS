---
name: invent-web-interactions
description: Invent, prototype, compare, and productionize unconventional frontend interactions that go beyond standard hover, scroll, and click patterns. Use for experimental landing pages, creative-development websites, gesture-driven interfaces, spatial navigation, physics-based controls, playful product interactions, new input mechanics, interaction laboratories, and requests for a website to feel more surprising, tactile, or unlike a conventional template.
---

# Invent Web Interactions

Create an interaction language with its own logic. Do not decorate a standard layout with random effects.

## Start with the interaction thesis

Write one sentence that defines how the interface behaves:

> The page behaves like a magnetic archive: nearby ideas attract, align, and reveal detail when the visitor slows down.

Define:

- The emotional quality: precise, playful, resistant, fluid, elastic, mechanical, mysterious, or calm
- The primary input: pointer, drag, hold, wheel, touch, keyboard, microphone, camera, orientation, or time
- The visible consequence
- The user benefit
- The escape route when the mechanic is unclear

Reject concepts that only rename familiar carousel, cursor-trail, or parallax patterns.

## Produce three interaction candidates

Generate three mechanics before committing:

1. A low-risk mechanic that improves a familiar pattern
2. A medium-risk mechanic with an unfamiliar response
3. A high-risk signature interaction that could define the experience

Describe every candidate using:

| Field | Question |
|---|---|
| Input | What does the visitor physically do? |
| Mapping | How does input become a normalized signal? |
| Response | What visibly or audibly changes? |
| Feedback | How does the user know the system noticed? |
| Meaning | Why does this response fit the content? |
| Recovery | How can the user undo, skip, or retry? |
| Equivalent | What is the keyboard and reduced-motion version? |

Select the strongest concept using distinctiveness, clarity, implementation cost, device coverage, and narrative relevance.

## Build an interaction laboratory first

Create an isolated route or component that contains:

- A neutral background
- The interactive object
- Live input readouts
- Tunable constants
- Reset and replay controls
- Pointer, touch, and keyboard test modes
- A small frame-rate readout during development

Do not integrate the mechanic into the full page until the isolated version feels good.

Expose meaningful controls such as:

```ts
type InteractionTuning = {
  attraction: number;
  damping: number;
  inertia: number;
  activationRadius: number;
  releaseThreshold: number;
  maximumDisplacement: number;
};
```

Prefer five understandable controls over dozens of unexplained numbers.

## Normalize input

Convert raw input into stable signals:

```ts
type InputState = {
  position: { x: number; y: number };
  delta: { x: number; y: number };
  velocity: { x: number; y: number };
  pressure: number;
  active: boolean;
  modality: "pointer" | "touch" | "keyboard";
};
```

- Smooth position separately from velocity.
- Clamp extreme wheel and pointer deltas.
- Use distance-independent thresholds.
- Account for pixel ratio and viewport size.
- Avoid relying on mouse hover for essential behavior.
- Use Pointer Events when a single input model is sufficient.

## Model the mechanic as a state machine

Define states before animation:

```ts
type InteractionPhase =
  | "idle"
  | "discoverable"
  | "engaged"
  | "charged"
  | "released"
  | "settling"
  | "complete";
```

Make transitions explicit. Prevent accidental repeated triggers. Allow interrupted motion to settle gracefully instead of snapping to a default.

Use continuous progress for animation and discrete state for meaning.

## Design tactile response

Combine only the feedback channels that reinforce the action:

- Spatial displacement
- Scale or deformation
- Light or color energy
- Particle emission
- Sound
- Mobile haptics when available and appropriate
- Copy or cursor-state change
- Environmental response around the object

Sequence feedback:

1. Acknowledge input within one frame
2. Build tension or anticipation
3. Deliver a clear event
4. Show consequence
5. Settle into a new readable state

Avoid long delays before acknowledging input.

## Use physically plausible motion selectively

Use springs for attachment, inertia for momentum, friction for drag, and constraints for boundaries.

```ts
velocity += (target - position) * stiffness;
velocity *= damping;
position += velocity;
```

Tune by feel, then verify:

- No runaway energy
- No oscillation that blocks reading
- No device-dependent timing
- No nausea-inducing camera response
- No accidental gesture conflict with browser navigation

Use fixed or clamped time steps when simulation stability matters.

## Invent from metaphors

Translate content into behavior:

- Archives become magnetic fields, stacks, lenses, or constellations
- Progress becomes pressure, growth, assembly, erosion, or temperature
- Navigation becomes orbit, tunneling, folding, focusing, or sorting
- Comparison becomes balance, interference, refraction, or resonance
- Identity becomes a rule-based generative system

Do not use a metaphor merely because it looks impressive. Make the behavior legible after one attempt.

## Add a strangeness budget

Keep conventional behavior for:

- Navigation
- Essential forms
- Legal and transactional content
- Critical calls to action

Spend novelty on:

- The hero gesture
- Scene transitions
- Exploration
- Brand expression
- Optional discovery

Do not make every element interactive.

## Productionize the chosen mechanic

- Separate input, simulation, rendering, and UI state.
- Keep frame-changing values outside React render cycles.
- Use one animation loop for tightly coupled effects.
- Dispose of listeners and rendering resources.
- Pause when the document is hidden.
- Add feature detection and a static fallback.
- Preserve direct links and semantic page structure.
- Make tuning constants responsive or capability-aware.

## Validate behavior

Test:

- Slow, fast, hesitant, and chaotic input
- Touch with one and multiple fingers
- Keyboard-only completion
- Repeated activation
- Leaving and re-entering the viewport
- Resize during interaction
- Reduced motion
- Low frame rate
- WebGL or sensor denial
- Accidental activation near controls

Observe whether a first-time visitor discovers the mechanic without explanation. Add the smallest possible cue if they do not.

## Deliver

Provide:

- The interaction thesis
- The three evaluated concepts
- The isolated prototype
- The selected production mechanic
- Tunable parameters
- Keyboard, mobile, and fallback behavior
- Test results and known limitations

Consider the work complete only when the mechanic is distinctive, learnable, reversible, responsive, and meaningfully connected to the content.
