# To confirm with the clinic before launch

Shown on the site as `[PLACEHOLDER]`:
1. **Clinic hours**: Contact section (`src/components/Contact.jsx`).
2. **Next Pushya Nakshatra date** for Swarna Bindu Prashana (`src/components/Swarna.jsx`).

Needing approval (not bracketed on the page):
3. **WhatsApp number** `+91 93807 36394`. The brief's link `wa.me/9380736394` lacks the 91 country code and would not open; the site uses `wa.me/919380736394` (`src/data/site.js`).
4. **Intro copy** (`src/components/Intro.jsx`), adapted from the clinic flyer.
5. **The headshot is Dr. Sree Skanda**: assumed; please confirm. He is shown for information only (name and degree), with no contact details, as requested.
6. **More Swarna Prashana photos**: the brief asks for a marquee of Dr. Rohit with *various* children; only one photo exists, so it appears in three crops. Add more (with parents' consent) to `TILES` in `src/components/Swarna.jsx`.
7. **Swarna Prashana details**: ages 0–16, monthly on Pushya Nakshatra, Swarna Bhasma with Brahmi ghee and honey (taken from the flyer).
8. **Therapies in the carousel** (Kati Basti, Janu Basti, Shirodhara, Abhyanga, Nasya, Virechana): confirm each is offered.
9. **The eight condition categories**, including Kshara Sutra care for piles, fissure and fistula: confirm each is offered.
10. **Sample diet charts and asanas** (`src/components/YogaDiet.jsx`): Dr. Rohit should review the wording.
11. **Google Maps link**: currently a search for the clinic name and address; replace it with the exact Google Business Profile link (from the QR code on the card).
