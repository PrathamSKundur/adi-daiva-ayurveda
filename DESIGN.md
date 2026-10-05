# Adi Daiva Ayurveda — Design Rationale

## 1. Image audit (every image, what it is, where it goes)

| Image | What it shows · mood | Where & why |
|---|---|---|
| `consultation.jpg` (landscape) | Dr. Rohit in a white coat, smiling across his desk at a patient. Warm daylight, human, reassuring. | *Being Seen*, beside his own words, at every width. |
| `dr-rohit-desk.jpg` (portrait) | Dr. Rohit writing a prescription. Quiet, attentive. | **Landing portrait**, in a temple-arch frame, where the title sequence plays. |
| `homa.jpg` (2 versions supplied) | Dr. Rohit in a maroon shawl behind a tall Homa flame in a brick kunda. Sacred, intense. | **Chapter 2 only.** The sharper of the two is used; the softer, lower-resolution duplicate is not used. |
| `greeva-basti.jpg` | Dr. Rohit pouring warm oil into a dough ring on a patient's neck. | Panchakarma oil-ripple scene (Greeva Basti). Camera watermark cropped out. |
| `janu-basti.jpg` | Dr. Rohit filling oil reservoirs over both knees of an older woman. | Panchakarma (Janu Basti) **and** the Elders lens scene, because it is the only image of care for an older patient. Watermark cropped. |
| `swarna-prashana.jpg` | Dr. Rohit giving drops to a toddler while her mother watches. Tender. | Swarna Bindu Prashana. It is the only pediatric photo, so it is shown in two crops among text "leaves", not faked into a gallery. |
| `clinic-desk.jpg` | The empty consulting desk; registration certificates, Ganesha and Dhanvantari frames, medicine shelf. | **Landing background, blurred and faded** (the room as a memory). It returns **sharp** in the *Trust* section, where the certificates become readable. Watermark cropped. |
| `dr-skanda.jpg` | Formal headshot, white coat, stethoscope. **Assumed to be Dr. Sree Skanda** (different person from Dr. Rohit; please confirm). | Small portrait in the online-consultation block and in the footer. |
| `logo.jpg` | Gold line-art: a figure holding a herb and a lamp, rooted, under a sun, ringed by leaves. | Knocked out to transparent gold. In the landing sequence a scan line reveals it over Dr. Rohit, aligned so his face sits inside the figure's empty face: the *Divine source within*. |
| Visiting card (front/back) | Ivory stock, cocoa-umber serif type, antique gold rules, watercolour leaves, gold-ringed medallions. | Not shown on the site. It is the visual DNA (below). |

## 2. Visiting-card DNA (sampled, exposure-normalised)

- **Paper:** warm ivory `#F5ECDF` → site parchment `#F6EFE3` and cream `#FDFBF7`.
- **Ink:** cocoa-umber `#5A3A2C`. The card's headings are brown, not green, so **display type uses umber ink**. Forest green `#1B4332` is kept for the night chapter, links and the yoga figure.
- **Gold:** antique, slightly rosy `#B08D57`, never bright yellow. The bright brief gradient (`#C5A059 → #E3C77E → #D4AF37`) is used only on the booking button, the sun and one closing word.
- **Ornament:** hair-thin gold rules broken by a small flower knot; gold-ringed circular medallions; leaf sprays in the corners.
- **Type feel:** a bold transitional serif for the name; wide-tracked small capitals ("PERSONALIZED AYURVEDIC CARE"); stacked vertical words ("ANCIENT / WISDOM / MODERN / HEALING").

## 3. Rationale

**Emotional arc.** The visitor arrives worried. They meet a person first: a daylit consulting room, Dr. Rohit at his desk, and one quiet sentence: *Come, let us listen to your pulse.* He then introduces himself in his own words. Then the page goes dark, slowly enough to feel like evening, until only the Homa flame is lit. In that stillness the tagline appears: *Awaken the Divine source within!* As they keep scrolling, a sun (taken from the logo) rises through umber and saffron into parchment, and the healings are shown in that returning light. The page ends in full daylight with an address and one invitation.

**The signature moment.** The descent into the Homa and the dawn that follows it. Everything else is deliberately quieter so this lands.

**Motion language.** Heavy, eased scrolling on desktop (native on touch). Long liquid easing (0.9–1.2 s, `cubic-bezier(.22,1,.36,1)`). One 5-second breath cycle drives the booking button, gold glints and ambient glow. Each section has at most one hero-level effect: depth (hero), fire (Homa), oil (Panchakarma), gold dust (Swarna), lens (Elders), wireframe body (Yoga), self-writing ink (Manuscript).

**What we are deliberately not doing.** No loader or splash. No fire on the first screen. No card grids repeated section after section. No carousel arrows, stock icons, testimonials, statistics or cure claims. No sound. No gold everywhere. No scroll-hijacking on phones.

## 4. Verification log (three screenshot passes, headless Chrome at 360 / 390 / 768 / 1024 / 1440)

Screenshots: `screenshots/final/<width>/`. Horizontal overflow measured at every width: **0 px**.

**Pass 1 findings → fixes**
- Homa: the tagline's spaces collapsed ("Awakenthe"); आदि दैव sat on Dr. Rohit's face; the photo kept a rectangular edge. → Fixed spacing; Devanagari moved beside the tagline; an oval, lamplight-shaped burn.
- Header kept a cream bar over the darkening descent; "Book a visit" wrapped on phones. → The header reads the light underneath it and inverts; no wrapping.
- The floating booking pill covered reading text and intruded on the Homa. → It hides while you scroll down, in the night chapter, over the hero and at the closing invitation, and returns when you pause or scroll up.
- **Weakest section: "What we treat"**, eight rounded pills that read as a card grid. → Rebuilt as one continuous palm-leaf folio: ruled entries, Devanagari folio numerals, binding holes (`before-manuscript-390.jpg` / `after-manuscript-390.jpg`).
- Desktop hero: the tagline line ran over the busy chair. → Larger scrim, words set higher.
- Swarna (desktop): half the rail was empty and the neighbouring leaves were too ghostly. → Start-aligned rail; focus follows the cursor; gentler softening.

**Pass 2 → 3**
- Mobile Homa: a lighter band where the photo's top met the descent. → The frame now dissolves into night at top and bottom.
- Tablet: the "Continue" cue collided with the invitation card; the lens photo was too tall; the yoga figure often faced sideways. → Cue is desktop-only; the figure is width-capped; the body now sways back to face the visitor.

**Honest self-critique, final**
- The very first screen is the desk, sharp and warm at every width; there is no loader. ✔
- The descent and dawn are the memorable moment: the page goes to night, the flame is the only light, then the logo's sun rises back to parchment. ✔
- No repeated card grids remain. Each healing has its own form: oil stage, arched leaves, lens, figure, folio. ✔
- Gold is limited to the booking button, the sun, "Divine", the Swarna drop and hairline ornaments. ✔
- Known limits: only one Swarna Prashana photograph exists, so it appears twice (in two crops) among text leaves. More photos of real sessions, with parental consent, would strengthen that section most. The 2.5D depth uses a hand-painted depth field rather than a true depth map; it is kept subtle so it never tears.

## 5. Revision (client feedback)

- **Landing:** the blurred clinic room fills the background. The opening plays like a television title sequence (the House M.D. intro was the reference for its overlay technique): the room comes up out of focus, Dr. Rohit's portrait is revealed, a scan line passes over him and finds the clinic's own emblem within him, a Nadi pulse trace runs through the frame, and the name arrives like a credit. About 4 seconds. Every element is the client's own asset or offer; nothing new is invented. Content is never hidden behind a loader.
- **Removed:** the sun added to the dawn (not requested); the dawn is now only the light returning.
- **Replaced:** the 3D wireframe body. The client asked for a tappable body (Gut, Lungs, Joints, Mind), so that remains, now as a seated yoga figure drawn in the same single gold line as the emblem. No three.js on that section any more.

## 6. Rebuild against the original brief (phase by phase)

| Brief | Built as |
|---|---|
| Phase 1 · palette & type | `--bg-cream #FDFBF7`, `--text-forest #1B4332`, `--accent-sage #D8E2DC`, the gold gradient for icons and badges; Playfair Display + Inter. Hero layout follows the clinic flyer (`sample.jpg`): desk photo washed into parchment, emblem and name centred, headline in forest and gold. |
| Phase 2 · Pancha Mahabhuta | Pinned scroll scene (three.js): ~18,000 particles (8,000 on phones) morph through the five tattva yantras: Akasha (circle/sphere), Vayu (hexagram), Agni (triangle), Jala (crescent), Prithvi (square/cube). Each element has its own motion, Sanskrit name, meaning, dosha, and how it is felt on the site (Lenis scroll, melting hovers, 5 s breath, Homa heat, parallax). |
| 3.1 Hero | Clinic desk photo as a 2.5D depth scene (foreground desk objects move faster than the wall); frosted-glass card: Free Prakriti Assessment + Free Nadi Pareeksha. |
| 3.2 Panchakarma | 3D coverflow carousel (drag / swipe / arrows / keys); the front Kati or Janu Basti photo runs the WebGL oil shader that ripples and catches light under mouse or finger. |
| 3.3 Swarna Bindu Prashana | Slow, endless marquee (also swipeable); hover/tap one tile → others desaturate 60% and blur; a three.js gold-dust (#D4AF37) particle system falls with depth behind the active tile. |
| 3.4 Geriatric care | Draggable glass lens over the knees; the found point unfolds a 3D text node with the pharmacology. |
| 3.5 Clinical yoga & diet | Rotating anatomical figure in forest-green wireframe (one smooth SDF body, marching cubes, contour-line shader); click Gut / Lungs / Joints / Mind → true two-faced 3D flip card with a sample diet chart and clinical asana. |
| Phase 4 · Homa | Heat-shimmer displacement over the bricks and lower third, fire mask, edges burnt to deep green; tagline revealed in stillness. |
| Phase 5 · icons | The eight hand-built gold line icons, drawn on scroll. |
| Phase 6 · conversion | "Book Free Nadi Pareeksha" pinned bottom-right at all times, breathing on a 5 s cycle, WhatsApp with the exact pre-filled message. |
