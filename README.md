# Jesús murió por… / Jesus died for…

A minimal, mobile-first web experience. A fixed phrase sits at the center of the screen — **"Jesus died for"** — and the person scrolls through a wheel of options to complete it: from the closest people in their life, to those who are hard to love, to the whole world, ending with **"me"**. Each option comes with a Bible verse that fades in softly.

Built with plain HTML, CSS and JavaScript. No frameworks, no build step, no dependencies.

## Features

- **Scroll wheel selector**: works with touch, mouse wheel, touchpad and keyboard arrows. Options snap into the center; the selected one is larger and fully opaque, the neighbors fade out.
- **33 options** that move from the intimate to the universal, including some that confront (the one who betrayed me, my worst enemy, those who hate him…). The wheel has a start and an end, and the last option is always **"me"**.
- **Related Bible verse** for each option, with a slow, gentle fade-in. It appears only after scrolling settles, so it never flickers.
- **Haptic feedback**: a subtle vibration on every change of option (Android browsers only; iOS does not support the Vibration API).
- **Swipe hint**: an animated arrow that disappears on the first scroll.
- **Share button**: generates a vertical image (1080×1920, ready for stories) with the phrase and the verse, then opens the native share sheet. If sharing files isn't supported, it falls back to text sharing, and finally to a WhatsApp link.
- **Bilingual (ES / EN)**: toggle at the top right. The initial language follows the browser, and the choice is remembered.
- **Dark and light themes**: basil green with white text, or soft light green with black text. The toggle is at the top right and the choice is remembered.
- **Responsive**: phrase and wheel side by side on desktop; phrase above the wheel on phones. Uses dynamic viewport units and safe-area insets so mobile browser bars don't break the centering.
- **Accessibility**: visible keyboard focus, ARIA roles on the wheel, and `prefers-reduced-motion` respected.
- **Footer**: "Made with ❤️ by Moisé" with a link to this repository.

## Project structure

```
.
├── index.html      # Page structure, meta tags, font loading
├── css/
│   └── style.css   # Layout, themes, wheel, animations
└── js/
    ├── data.js     # Options, verses and UI texts (ES/EN)
    └── app.js      # Wheel logic, vibration, theme, language, sharing
```

## Run locally

Open `index.html` in any browser, or serve the folder with any static server:

```bash
npx serve .
```

(Verses use the **Reina-Valera 1909** (Spanish) and the **King James Version** (English), both in the public domain. Please double-check the texts before publishing, and avoid copyrighted translations such as RVR1960 unless you have permission.)

Created with ❤️ by Moisé.
