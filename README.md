# 🪢 Bound by the Rope 🏔️

> *Two climbers. One rope. One fate.*

**Bound by the Rope** is a 3D cooperative climbing game where two players must work together to reach the mountain summit while connected by a single frayed rope.

## 🎮 Play Now
**[▶️ PLAY THE GAME](https://ranolaangel.github.io/bound-by-rope/)**

## 📖 The Story

A storm destroyed your gear. All you have left is a single frayed rope tied between you and your partner. The only way out is up. Reach the Summit Flag together, or plummet together.

The cliffs are crumbling. The winds are cruel. Your rope is your only lifeline — and your biggest liability. If one of you falls, you both fall. If you fight, you fail. If you trust, you might just reach the sun.

## ✨ Features

- **Real-time Cooperative Gameplay** — Two players on one keyboard
- **Rope Physics** — Stay connected or the rope breaks (max 20 meters apart)
- **3D Mountain Climbing** — Scale 11 platforms to reach the summit
- **Dynamic Camera** — Follows both players for the best view
- **Rope Status Indicator** — Monitor rope tension: 🟢 Strong → 🟠 Stressed → 🟡 Fraying
- **100% Browser-Based** — No installation needed, play instantly
- **Fully Responsive** — Works on desktop, tablet, and mobile browsers

## 🕹️ Controls

### Player 1 (Red)
- **← →** Arrow Keys — Move left/right
- **↑ ↓** Arrow Keys — Climb up/down
- **Space** — Jump

### Player 2 (Cyan)
- **A D** Keys — Move left/right
- **W S** Keys — Climb up/down
- **E** Key — Jump

## 🎯 Objective

1. Guide both players up the mountain
2. Keep the distance between players ≤ 20 meters (or rope breaks!)
3. Reach the **golden summit flag** at the top together
4. Plant the flag and claim victory!

## 🛠️ Built With

- **Three.js** — 3D graphics rendering
- **Vanilla JavaScript** — Game logic and physics
- **HTML5 Canvas** — Real-time rendering
- **GitHub Pages** — Free hosting

## 🚀 Quick Start

1. Visit: **https://ranolaangel.github.io/bound-by-rope/**
2. Click **"Start Climbing"**
3. Use the controls above to move both players
4. Reach the top together to win!

## 📊 Game Mechanics

### Rope System
- Players are connected by a rope with a maximum length of 20 meters
- If the distance exceeds this, the rope breaks and game ends
- The rope tension increases as players move apart
- Rope status updates in real-time

### Climbing
- Use climb controls (↑/↓ or W/S) to move up platforms
- Jumping helps you reach higher platforms faster
- Careful coordination between players is essential
- Both must stay connected

### Physics
- Gravity pulls players down
- Landing on platforms stops the fall
- Jumping gives an upward boost
- Both players must reach the summit together

## 🎨 Game Features

- **11 Platforms** — Progressively higher platforms to climb
- **Gold Summit Flag** — The final objective at 50 meters height
- **Real-time HUD** — Shows player heights, distance apart, and rope status
- **Victory & Defeat Screens** — Beautiful modals for game end states
- **Smooth Camera** — Follows the midpoint between both players

## 📱 Platform Support

- ✅ Desktop (Recommended)
- ✅ Tablet with keyboard
- ⚠️ Mobile (keyboard input required)

## 🎓 How to Customize

Want to modify the game? Edit `game.js`:

```javascript
const GAME_CONFIG = {
    ROPE_MAX_LENGTH: 15,      // Max rope extension
    ROPE_BREAK_LENGTH: 20,    // Distance before rope breaks
    GRAVITY: 0.2,             // Gravity strength
    PLAYER_SPEED: 0.3,        // Movement speed
    PLAYER_CLIMB_SPEED: 0.2,  // Climbing speed
    SUMMIT_HEIGHT: 50,        // Summit height in meters
};
```

## 🐛 Known Issues

- Works best on desktop with keyboard input
- Mobile touch controls are limited
- Rope physics may vary on slower devices

## 🤝 Contributing

Found a bug or have an idea? Feel free to:
1. Open an Issue
2. Fork and submit a Pull Request
3. Report bugs via GitHub Issues

## 📜 License

MIT License - Free to use, modify, and distribute.

## 👤 Creator

Made with ❤️ by **Ranolaangel**

Email: ranolaangel3@gmail.com

---

**Made for climbers, best friends, and those who believe bonds can withstand anything.**

*Will your rope hold, or will it snap?* 🪢
