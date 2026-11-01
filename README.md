# Arjun P portfolio refresh

Open `index.html` directly, or run `python3 -m http.server 8000` and visit `http://localhost:8000`.

## Before publishing
- Add the latest public-facing resume PDF here as `Resume.pdf` (the hero link expects that exact filename).
- Confirm project URLs. Lakehouse and MedTech currently link to your GitHub profile because verified repository URLs were not provided.
- Verify claims, benchmark metrics, education, certification and dates against your final resume/project evidence.
- The visual project illustrations are CSS artwork, not captures of running software.
- Test mobile/desktop and deployed links.

This is a static site; no build step is required.


## Add your professional photo
1. Add a cropped portrait (preferably JPG/WebP, vertical 4:5) to `assets/`, e.g. `assets/profile.png`.
2. In `index.html`, find `<img src="assets/profile.png" ...>` and change the source to `assets/profile.png`.
3. Commit and push the changes; Vercel will redeploy. Keep the photo reasonably optimized (ideally under 500 KB).

This edition uses a light palette with white surfaces, cool-gray section backgrounds, and blue accents.
