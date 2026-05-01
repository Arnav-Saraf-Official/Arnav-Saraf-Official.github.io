India-Themed Portfolio — Experience Implementation Plan
Important points:
- In svelte
- Has routing
- Uses tailwind.

1. Core Concept

This is a guided, scroll-driven narrative experience structured as a continuous journey:

Arrival (Sky)
Approach (Gateway)
Entry (Zoom into content)
Exploration (Market street of projects)
Navigation (Compass control layer)

The user should feel like they are moving forward through space, not scrolling through a webpage.

2. Global Interaction Model
Scroll Behavior
Scroll is the primary input
Maps to a virtual camera moving forward
No abrupt jumps or section snapping unless triggered via navigation
Motion Philosophy
Movement is smooth, eased, and continuous
Avoid linear motion—use easing to simulate natural acceleration/deceleration
Maintain a consistent directional flow (forward/downward)
Focus Management
At any moment, there should be one clear focal point
Background elements must never compete with primary content
3. Section 1 — Arrival (Sky)
Purpose

Create a calm entry point and establish visual tone.

Behavior
Minimal visual elements (sky gradient, subtle clouds)
Slow vertical motion tied to scroll
No interactive elements or text initially
Constraints
Keep visual noise extremely low
Avoid introducing UI too early
4. Section 2 — Approach (Gateway)
Purpose

Introduce a clear destination and guide user attention.

Behavior
Gateway emerges gradually into view
Remains centered and becomes dominant
Background motion slows slightly to emphasize the structure
Design Requirements
Strong symmetry
Clear silhouette
Visually distinct from background
Transition Role

Acts as a visual anchor and prepares for entry into content.

5. Section 3 — Entry (Zoom Transition)
Purpose

Transition from cinematic intro → usable interface.

Behavior
Camera moves toward and into the gateway
Scale increases to simulate forward motion
Exterior environment subtly fades or de-emphasizes
Interior content begins to appear
Content Reveal
Primary content fades in progressively
Motion slows to signal “arrival”
Constraints
Avoid abrupt transitions
Ensure readability as soon as content appears
6. Section 4 — Home (Inside Gateway)
Purpose

Provide immediate clarity and orientation.

Content
Name / identity
Short descriptor
Clear call-to-action (e.g., “Explore Projects”)
Behavior
Static or near-static compared to previous sections
Minimal motion to reduce cognitive load
UX Goal

User should immediately understand:

Where they are
What the site is
What to do next
7. Section 5 — Market Street (Projects)
Core Metaphor

User is walking forward down a street.

Scroll = forward movement
Projects = stalls on either side
Depth = progression through work
8. Market Spatial Design
Layout
Center: clear road/path (must remain visually unobstructed)
Left/Right: alternating stalls
Background: subtle environmental context (non-distracting)
Depth Structure
Foreground: nearest stalls (largest, most detailed)
Midground: active interaction zone
Background: distant stalls (faded, smaller)
9. Market Motion Behavior
Forward Movement Illusion
All elements move relative to a virtual camera
Stalls approach from distance → pass by → exit view
Scaling
Objects increase in size as they approach
Decrease as they move away
Horizontal Perspective
Distant stalls appear closer to center
Near stalls sit farther toward edges
Visibility Management
Only a limited number of stalls visible at once
Distant elements fade or reduce detail
10. Stall Interaction Model
Passive State
Subtle idle animation (e.g., slight movement)
Low visual emphasis unless near center
Focus State (near center)
Increased clarity and scale
Slight highlight or emphasis
Active State (user interaction)
Click/tap opens project details
Transition should be quick and reversible
Content Rules
Minimal text on stall itself
Detailed information appears in overlay/modal
11. Market Pacing
Scroll Rhythm
Each project should occupy a consistent “scroll duration”
Avoid large empty gaps or overcrowding
Timing
Maintain a steady cadence of new elements entering view
Prevent both:
Visual overload
Dead zones with no interaction
12. Navigation — Compass System
Purpose

Provide non-linear navigation without breaking immersion.

Visibility
Hidden or subtle during intro
Appears after user reaches main content
Positioning
Fixed location (e.g., corner)
Must not obstruct primary content
13. Compass Interaction
Behavior
Default: compact icon
On interaction: expands into radial menu
Options
Home
Market
About
Contact
Navigation Effect
Smooth transition to target section
Should feel like repositioning the “camera,” not jumping pages
14. Visual System Guidelines
Color Strategy
One dominant color (warm tone)
One contrasting color (cool tone)
One neutral base
Consistency Rules
Uniform style across all elements
Consistent stroke widths and shapes
Avoid mixing illustration styles
15. Depth and Layering
Layer Model

Limit to 3 layers:

Background (slowest movement)
Midground (primary structures)
Foreground (interactive elements)
Rule

Each layer must have a clear purpose—no redundant elements.

16. Motion Guidelines
Principles
Use easing for all motion
Avoid abrupt starts/stops
Maintain directional consistency
Limits
Do not animate everything
Prioritize clarity over spectacle
17. Performance-Aware Design
Constraints
Limit number of active elements on screen
Reduce detail for distant objects
Avoid excessive visual effects
Behavior
Elements outside the visible range should be de-emphasized or not rendered
18. Pacing Constraints
Intro Duration
Should not require more than ~3–5 seconds of scrolling
Market Duration
Long enough to explore, but not repetitive
Maintain engagement through variation in stalls
19. Emotional Tone
Target Feel
Warm and inviting
Slightly playful
Controlled and intentional
Avoid
Visual chaos
Over-saturation
Excessive animation
20. Failure Cases to Watch
No clear focal point at any stage
Overcrowded market layout
Inconsistent visual style
Navigation that is hard to discover
Animation interfering with usability