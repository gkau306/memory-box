# Memory Box 🎁

A small, shareable “memory box” built with React (Vite), Framer Motion, and URL-encoded state—no backend.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Create a box on the landing page, add items on the canvas, then **Seal & Send** to get a shareable link. Recipients open the link to see the box and can **Write back** (reply is encoded into a new link).

## Assets

Place your images in `public/images/`:

| Item   | File             | Notes                          |
|--------|------------------|--------------------------------|
| Song   | `cassette.png`   | Replace `cassette.svg` if desired |
| Letter | `envelope.png`   | Replace `envelope.svg` if desired  |
| Polaroid | `polaroid.png` | Or keep `polaroid.svg`          |
| Gift   | `giftcard.png`   | Or keep `giftcard.svg`         |
| Trinket | `trinket-tag.png` | Or keep `trinket-tag.svg`   |
| Box    | `box-closed.svg`, `box-open.svg` | For recipient reveal |

SVG placeholders are included so the app works without PNGs. To use PNGs for song/letter, update `src/utils/itemTypes.js` asset paths to `.png`.

## Tech

- **React (Vite)** — UI
- **Three.js + @react-three/fiber + @react-three/drei** — 3D box, items, lights, camera
- **Zustand** — global state (box meta, items, lid, confetti)
- **GSAP** — (optional) animations; lid uses `useFrame` lerp
- **Framer Motion** — 2D modals/landing
- **React Router** — `/` (landing), `/create` (3D creator)
- **URL hash** — box state encoded with `btoa(JSON)` for sharing
- **LocalStorage** — autosave draft via Zustand (`memory-box-draft`)

Fonts: **Caveat** (headings, labels), **Kalam** (body, inputs) from Google Fonts.

### 3D structure

- **Scene** — Canvas, camera (top-down angle), ambient + directional + fairy lights
- **Box3D** — Floor (floral texture), walls (cardboard), lid (hinged at back, opens on click)
- **MemoryItem3D** — Plane meshes with item PNGs; draggable on floor via raycast
- **FairyLights** — 8 twinkling point lights
- **Confetti** — particle burst when recipient opens the box
- **CreatorUI / RecipientUI** — HTML overlays (add items, seal & send, open, write back)
