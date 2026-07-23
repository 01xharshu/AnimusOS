---
name: art-direct-premium-frontends
description: Art-direct frontend websites toward a distinctive, premium, contemporary visual standard through stronger composition, typography, hierarchy, spacing, color, imagery, interaction restraint, and original visual logic. Use when a website feels generic, template-like, AI-generated, cluttered, overdecorated, insufficiently premium, visually inconsistent, or technically impressive but lacking taste; also use before adding advanced animation or WebGL so effects reinforce a coherent design direction.
---

# Art Direct Premium Frontends

Create a point of view, not a collection of fashionable components. Make the site look deliberate before making it move.

## Establish the design position

Translate the brief into five sliders:

- Quiet ↔ expressive
- Editorial ↔ spatial
- Precise ↔ organic
- Timeless ↔ trend-aware
- Restrained ↔ immersive

Choose a clear position on each slider. Do not default every premium site to black, glass, neon, and oversized sans-serif text.

Write:

- The emotional promise
- The primary visual tension
- The dominant compositional rule
- The signature material or motif
- The one effect the site is allowed to be known for

Example:

> A restrained editorial interface interrupted by one impossible depth event. Typography remains calm; imagery and transitions carry the surprise.

## Audit before redesigning

Inspect the existing site at representative desktop and mobile sizes.

Identify:

- What deserves attention first
- What currently competes for attention
- Whether the layout has a repeatable grid
- Whether type choices create hierarchy or merely variety
- Where spacing collapses
- Which effects are meaningful
- Which elements look borrowed from a generic component library
- Whether the visual tone matches the brand and content

Do not preserve weak design decisions merely because they are already implemented.

## Reject generic frontend habits

Treat these as warning signs, not automatic bans:

- Centered hero with badge, gradient headline, two pills, and dashboard mockup
- Excessive rounded rectangles
- Glass cards on every section
- Purple-blue glow without brand meaning
- Random floating 3D objects
- Uniform bento grids
- Identical reveal animation on every element
- Decorative grids, dots, rings, and noise used simultaneously
- Tiny uppercase labels everywhere
- Overuse of blur and low-contrast grey
- Every section filling exactly one viewport
- Cursor effects that add no interaction value

Keep a convention only when it is the clearest solution.

## Create three art-direction hypotheses

Develop three materially different directions:

1. **Composition-led:** Distinctive grid, crop, scale, and negative space
2. **Typography-led:** Type becomes the primary visual and motion material
3. **Spatial/material-led:** Depth, texture, light, or WebGL becomes the identity

For each direction define:

- Hero composition
- Type pairing
- Palette behavior
- Image treatment
- Interaction character
- Signature transition
- Mobile translation
- Main risk

Select one direction. Do not average the three into a weaker hybrid.

## Build a visual grammar

Limit the system:

- One primary type family and at most one contrasting family
- One dominant background behavior
- One accent color or controlled accent range
- One corner language
- One stroke language
- One depth model
- One image-treatment rule
- One motion grammar

Create tokens for:

```ts
type ArtDirectionTokens = {
  pageGutter: string;
  contentWidth: string;
  displayScale: string;
  bodyScale: string;
  lineColor: string;
  accentColor: string;
  surfaceColor: string;
  cornerRadius: string;
  depthUnit: number;
};
```

Use tokens to create rhythm, not to make every section identical.

## Compose with hierarchy

Give every viewport:

- One dominant element
- One supporting element
- One quiet region
- One directional cue

Avoid equal visual weight across headings, graphics, cards, and controls.

Use asymmetry deliberately:

- Offset the hero around a visual focal point
- Let imagery cross the grid only at meaningful moments
- Create tension between large type and precise metadata
- Preserve quiet space near high-detail graphics
- Use section transitions to reset density

Check the composition in greyscale. If hierarchy disappears without color, fix scale and placement.

## Direct typography

Choose type for voice and behavior, not only appearance.

Control:

- Line length
- Line breaks
- Optical alignment
- Tracking
- Weight contrast
- Leading
- Numeral style
- Variable-font axes
- Responsive scaling

Use large type only when the content earns it. Keep body copy readable.

Do not use more type styles to compensate for weak hierarchy.

## Direct color, light, and material

Define:

- Base field
- Surface relationship
- Text contrast hierarchy
- Accent behavior
- Light source
- Glow radius and intensity
- Texture scale

Treat glow like light emitted by a material. Do not apply it equally to text, borders, icons, and backgrounds.

Use grain, blur, refraction, chrome, glass, or bloom only when they belong to the same material story.

## Make effects earn their place

For every effect ask:

1. Does it improve hierarchy?
2. Does it communicate state?
3. Does it create depth?
4. Does it express the brand?
5. Would removing it make the experience weaker?

Remove the effect when most answers are no.

Use one hero effect, two supporting effects, and quiet transitions elsewhere as a default ceiling.

## Design advanced sections without component-library sameness

Instead of repeating card grids:

- Use editorial sequences
- Use oversized cropping
- Use changing alignment fields
- Use layered type and imagery
- Use spatial scenes
- Use controlled horizontal movement
- Use single-object storytelling
- Use progressive disclosure

Preserve scanability and semantic structure.

## Art-direct interaction

Make interaction character consistent:

- Precise sites respond quickly and settle cleanly
- Organic sites bend, drift, and recover slowly
- Mechanical sites use stepped constraints and audible state changes
- Editorial sites keep controls quiet and animate hierarchy
- Spatial sites move the environment while UI remains anchored

Do not combine elastic buttons, cinematic cameras, glitch transitions, and soft fluid cursors without a unifying logic.

## Translate to mobile

Recompose rather than shrink:

- Choose a new focal crop
- Reduce simultaneous layers
- Preserve the dominant hierarchy
- Replace hover with tap or scroll
- Keep important type from becoming decorative wallpaper
- Retain the signature moment in a simpler form
- Increase touch targets

Mobile should feel like the same art direction expressed through different constraints.

## Run taste passes

Review in this order:

1. **Silhouette pass:** Is the page recognizably composed when blurred?
2. **Hierarchy pass:** Is the reading order obvious?
3. **Restraint pass:** What can be removed?
4. **Originality pass:** Which parts look like a familiar template?
5. **Consistency pass:** Do materials, corners, strokes, and motion agree?
6. **Craft pass:** Are spacing, baselines, crops, and transitions precise?
7. **Reality pass:** Does it still work with actual content and small screens?

Make changes after every pass.

## Deliver

Provide:

- The chosen design position
- Rejected generic patterns
- The visual grammar and tokens
- Key desktop and mobile compositions
- Typography and material direction
- Effect and interaction budget
- Before-and-after rationale
- Validation screenshots or preview when implementation is requested

Consider the art direction complete only when the site has a clear point of view, remains legible without effects, and uses technical spectacle as emphasis rather than camouflage.
