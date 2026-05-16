# CampusConnect AR — Sri Sairam Institute of Technology

A Vue 3 Augmented Reality Campus Navigation Simulator

## 🚀 Quick Start

### Option A — Zero setup (standalone HTML)
Open `dist/index.html` directly in your browser. No server required.

### Option B — Development server
```bash
npm install
npm run dev
# → http://localhost:5173
```

### Option C — Production build
```bash
npm run build
# Serves from dist/
```

## 📁 Project Structure

```
src/
├── App.vue                      # Root component + view router
├── main.js                      # Entry point
├── style.css                    # Global design tokens & animations
├── components/
│   ├── HomeView.vue             # Landing / login screen
│   ├── SelectView.vue           # Destination selector + mini-map
│   ├── CameraView.vue           # Main AR navigation screen
│   ├── NavigationOverlay.vue    # Animated AR arrows (straight/left/right/arrived)
│   ├── MarkerSimulator.vue      # Clickable AR hotspot markers
│   └── LocationCard.vue        # Destination card UI
├── composables/
│   ├── useNavigation.js         # Global navigation state & logic
│   └── useCamera.js             # Camera access / simulation fallback
└── data/
    └── locations.json           # 8 campus locations with step-by-step routes
```

## 🎯 Features

- **AR Simulation** — Camera overlay with perspective grid, animated arrows & path viz
- **8 Campus Locations** — Entrance, Block A/B, CC2 Lab, Library, Canteen, Sigma Hall, Reception
- **Step-by-step Navigation** — Up to 6 steps per route with directional arrows
- **Voice Guidance** — Browser SpeechSynthesis API (Web Speech)
- **Live Camera** — Uses device rear camera if available; falls back to simulation
- **Interactive Mini-map** — SVG campus map with clickable location markers
- **AR Markers** — Floating HUD hotspots with scan box animation
- **Fully Offline** — No backend, no APIs, all data in local JSON
- **Mobile Responsive** — Optimized for phones in portrait mode

## 🗺️ Campus Locations

| ID | Name | Category | Steps |
|----|------|----------|-------|
| entrance | Main Entrance Gate | Gateway | 4 |
| blockA | A Block (IT/CS Dept) | Academic | 5 |
| blockB | B Block (ECE Dept) | Academic | 4 |
| lab | Computer Lab CC2 | Lab | 6 |
| library | Central Library | Resource | 3 |
| canteen | Main Canteen | Food | 4 |
| sigma | Sigma Auditorium | Event | 4 |
| reception | Reception/Admin | Admin | 3 |

## 🔧 Tech Stack
- Vue 3 + Composition API
- Vite 5
- Pure CSS (no Tailwind — custom design system)
- Web Speech API (voice)
- getUserMedia API (camera)
- SVG animations (AR effects)

## 📱 Mobile Notes
- Grant camera permission for live AR view
- If camera denied → simulation mode auto-activates
- Toggle camera icon in top-right of AR view
