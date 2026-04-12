```markdown
# Design System Strategy: Magical Literacy & Tactical Play

## 1. Overview & Creative North Star: "The Living Storybook"
This design system is built upon the **Creative North Star: The Living Storybook.** We are moving away from the "educational dashboard" aesthetic toward an immersive, tactile experience that feels like a digital pop-up book. 

To break the "template" look, we leverage **Intentional Softness.** This means avoiding rigid geometric grids in favor of organic, overlapping "bubbles" of content. We utilize exaggerated typography scales and asymmetric layouts—where floating characters or magical particles break the container bounds—to create a sense of wonder. The goal is to make the child feel they are interacting with magic, not software.

---

## 2. Color & Tonal Depth
Our palette transitions from a warm, creamy parchment base to vibrant, magical accents.

### The Palette
- **Base Surface:** `surface` (#f8f6f2) – A soft cream that reduces eye strain compared to pure white.
- **Primary Hero:** `primary` (#00618f) to `primary_container` (#00affe) gradients.
- **Secondary Hero:** `secondary` (#006a33) to `secondary_container` (#3fff8b) gradients.
- **Role-Based Accents (The Character Classes):**
    - **Dwarf (Strength):** `tertiary` (#7e5200) / `tertiary_container` (#feaa00)
    - **Peri (Nature):** `secondary` / `secondary_container`
    - **Kesatria (Wisdom):** `primary` / `primary_container`
    - **Penyihir (Magic):** Fuchsia/Purple (Custom Gradient Tones)
    - **Pemanah (Precision):** Rose/Pink (Custom Gradient Tones)

### The "No-Line" Rule
**Strict Directive:** Do not use 1px solid borders to define sections. Layout boundaries must be established via:
1.  **Background Shifts:** Place a `surface_container_low` card atop a `surface` background.
2.  **Tonal Transitions:** Use soft, multi-stop gradients instead of hard lines.

### Surface Hierarchy & Glassmorphism
Treat the UI as layered sheets of "Magic Glass."
- Use `surface_container_lowest` (#ffffff) for the most elevated interactive cards.
- **Glass Effect:** For floating navigation or modal overlays, use `surface_bright` with 70% opacity and a `20px` backdrop-blur. This allows the vibrant role-based colors to bleed through softly.

---

## 3. Typography: Editorial Playfulness
We pair high-character display fonts with highly legible body text to maintain a "Premium Literacy" feel.

- **Display & Headlines:** `plusJakartaSans`. This should be used at `display-lg` (3.5rem) for hero moments. Encourage tight tracking (-2%) and generous leading to make the "bubble" shapes of the letters feel cohesive.
- **Body & Labels:** `beVietnamPro`. A clean sans-serif that ensures long-form reading (stories) is effortless. 

**Typographic Signature:** Use `headline-lg` for section headers, but apply a subtle gradient (e.g., `primary` to `primary_dim`) to the text itself to give it a "glowing" magical quality.

---

## 4. Elevation & Depth: Tonal Layering
We do not use "shadows" in the traditional CSS sense. We use **Ambient Illumination.**

- **The Layering Principle:** Stack surfaces like physical objects.
    - Level 0: `surface` (The floor)
    - Level 1: `surface_container_low` (Large content areas)
    - Level 2: `surface_container_lowest` (Interactive cards)
- **Ambient Shadows:** When an element must "float" (like a reward modal), use a shadow with a 40px blur, 0% spread, and a 6% opacity tinted with the `primary` color. This mimics a soft glow rather than a dark shadow.
- **The "Ghost Border":** If accessibility requires a stroke, use `outline_variant` at 15% opacity. It should be felt, not seen.

---

## 5. Components: The Bubble Language

### Buttons (The "Jewel" Style)
- **Primary:** `xl` (3rem) rounded corners. Use a gradient from `primary` to `primary_container`. Add a subtle inner-glow (1px white inner-shadow at 20% opacity) to give it a 3D glass effect.
- **Secondary:** `surface_container_highest` background with `on_surface` text. No border.

### Interactive Chips
- Used for "Word Tags" or "Role Selection."
- **Shape:** `full` (pill-shaped).
- **Behavior:** On hover, the chip should scale (1.05x) and trigger a subtle particle "sparkle" effect (using a CSS mask-image of a noise texture).

### Progress Bars (Magical XP)
- Forbid flat, rectangular bars.
- Use `full` rounded containers with a `secondary_fixed` fill. Incorporate a "shimmer" animation that moves from left to right to indicate active energy.

### Cards & Discovery Lists
- **Rule:** No dividers. Use `2rem` (xl) vertical spacing to separate story modules.
- Use `surface_container_low` as the card base. When a child selects a "Role," the card’s accent glow changes to that role’s color (e.g., Orange for Dwarf).

### Magical Input Fields
- **State:** When focused, the input field should not just change border color; it should gain a soft outer glow using the `primary_fixed` token.
- **Corner Radius:** `md` (1.5rem).

---

## 6. Do’s and Don’ts

### Do:
- **Use Asymmetry:** Place a character illustration overlapping the edge of a `surface_container`. It breaks the "digital box" feel.
- **Use Textures:** Apply a very low-opacity "grain" or "dust" texture to the `surface` background to mimic high-end paper.
- **Animate Transitions:** Every state change should feel "fluid." Use `cubic-bezier(0.34, 1.56, 0.64, 1)` for a bouncy, playful feel.

### Don’t:
- **Don't use pure black:** Use `on_surface` (#2e2f2d) for text. High contrast is too harsh for a magical world.
- **Don't use 1px lines:** If you feel the need to draw a line, use a spacing gap or a color shift instead.
- **Don't use "Default" Shadows:** Avoid the grey, muddy shadows found in standard UI kits. Always tint your shadows with the brand's primary or secondary blues/greens.

---

## Director's Closing Note
Remember, we are not building a tool; we are building a **portal**. Every button press should feel like a small spark of magic. Use the `roundedness-xl` and `surface-container` tiers to create a world that feels soft, safe, and deeply premium.```