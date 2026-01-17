# Seesaw Simulation
Live Demo: https://comporder.github.io/emir-ozalp-seesaw-simulation/

## Thought Process & Design Decisions

When I started this project, I intentionally kept the HTML and CSS very minimal. My first goal was to build a basic seesaw layout with just a plank and a pivot, and make sure the structure felt visually correct before adding any interaction logic. I preferred to settle the layout first instead of mixing UI and JavaScript logic too early.

After the layout was in place, I added basic click handling to test interaction. At this stage, clicks were only used to verify that weights could be placed on the plank, without focusing too much on accuracy or physics.

As interaction evolved, handling click positions became trickier once the seesaw started rotating. Especially when the plank was highly tilted, clicks near the edges caused weights to be placed slightly off from where I expected. The main issue was interpreting click positions as if the plank were unrotated, while the element itself was already rotated in screen space.

To solve this, I introduced a separate `plank-click-area` element positioned on top of the seesaw. Even though it rotates visually together with the plank, click coordinates are calculated using the plank’s unrotated reference (via local element coordinates). This made the click position consistent and predictable, and allowed weight placement to behave correctly. This approach also helped keep the physics and positioning logic simpler.

Once the click position was stable, I focused on the weight–torque relationship. I initially tested the logic using fixed weights, then updated the system to generate random weights between 1 and 10. At this stage, I mainly cared about whether the balance logic worked correctly and responded consistently to new weights.

After the torque logic started to feel right, I began improving the UI. I grouped the seesaw elements into a container, adjusted spacing, and refined the info panel layout so values were easier to read at a glance. These UI changes came after the core logic was working, and were mostly iterative improvements based on visual feedback rather than a strict design plan.

To make weights easier to distinguish visually, I adjusted their size and color based on their value. At this point, calculating size and color dynamically in JavaScript made more sense than defining static values in CSS, since each weight needed a slightly different appearance.

In later commits, I added state management using `localStorage` so that weights, positions, and values persist after a page refresh. During restore, I recreate the DOM elements first and then recompute total weight and torque values from the stored data instead of saving derived values directly. This kept the state simple and avoided inconsistencies.

In the final phase, I refactored the code for readability. I merged repeated calculation logic into a single function, removed unnecessary duplication, and tried to keep responsibilities clear. The goal was not heavy abstraction, but a structure that is easy to read and follow.

---

## Trade-offs & Limitations

- This is not a fully accurate real-world physics simulation. When using the raw torque difference directly, the seesaw reacted too sharply. To keep the motion visually readable and controllable, I intentionally applied a scaling factor when calculating the angle:

```js
const angle = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, torqueDiff / 10));
```
- Click coordinates are calculated based on the plank’s unrotated reference rather than the visual rotation. This was a conscious design choice to improve stability and keep interaction logic straightforward. In practice, click handling is intentionally kept in the plank’s local coordinate system using `offsetX`. While this approach has known limitations, an alternative would be to calculate all interactions in an unrotated coordinate system and apply rotation only during rendering. Given the scope of the task, the simpler local-coordinate solution was preferred.

---

## AI Usage

I did not use AI tools to generate the main logic or structure of this project. I mainly used them as a support tool for:

- checking small JavaScript syntax details,

- exploring alternative UI approaches,

- getting quick feedback during refactoring for readability,

- refining documentation wording and improving clarity in the README.

The core architecture, physics logic, and the step-by-step development of the project were built through my own trial-and-error process.
