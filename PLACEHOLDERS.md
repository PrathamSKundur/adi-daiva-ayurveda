# To confirm with the clinic before launch

Resolved: **clinic hours** (now in `src/data/site.js`, shown with a live open/closed status) and **Pushya Nakshatra dates** (calculated live in `src/lib/pushya.js`; verified against the published 2026 panchanga to within a minute).

1. **Kannada text**: have a native speaker confirm the clinic name «ಆದಿ ದೈವ ಆಯುರ್ವೇದ ಚಿಕಿತ್ಸಾಲಯ» (hero, footer) and the tagline «ನಿಮ್ಮೊಳಗಿನ ದೈವಿಕ ಮೂಲವನ್ನು ಜಾಗೃತಗೊಳಿಸಿ» (Homa section). After editing any Kannada or Sanskrit text, run `npm run fonts`.
2. **Swarna Prashana day rule**: the planner recommends, for each Pushya Nakshatra, the day whose clinic hours overlap it the most. Confirm this matches how the clinic schedules sessions.
3. **WhatsApp number** `+91 93807 36394`. The brief's link `wa.me/9380736394` lacks the 91 country code and would not open; the site uses `wa.me/919380736394` (`src/data/site.js`).
4. **Intro copy** (`src/components/Intro.jsx`), adapted from the clinic flyer.
5. **The headshot is Dr. Sree Skanda**: assumed; please confirm. His online-consultation details are at the end of the page and in the footer.
6. **Swarna Prashana details**: ages 0–16, monthly on Pushya Nakshatra, Swarna Bhasma with Brahmi ghee and honey (taken from the flyer).
7. **Therapies in the carousel** (Kati Basti, Janu Basti, Shirodhara, Abhyanga, Nasya, Virechana): confirm each is offered.
8. **The eight condition categories**, including Kshara Sutra care for piles, fissure and fistula: confirm each is offered.
9. **Sample diet charts and asanas** (`src/components/YogaDiet.jsx`): Dr. Rohit should review the wording.
10. **Google Maps link**: currently a search for the clinic name and address; replace it with the exact Google Business Profile link (from the QR code on the card).
