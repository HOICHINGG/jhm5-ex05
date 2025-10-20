# Tication (Vanilla)

A simple, accessible Tic-Tac-Toe game built with pure HTML, CSS, and JavaScript.

## Features

- ✅ Classic 3x3 Tic-Tac-Toe gameplay
- ✅ Win detection with animated highlighting
- ✅ Score tracking (session-based)
- ✅ Keyboard accessible (Tab + Enter/Space)
- ✅ Responsive design
- ✅ No dependencies, no build step

## How to Play

1. Open `index.html` in a web browser
2. Click on any empty cell to place your mark
3. Players alternate between X and O
4. First to get 3 in a row (horizontal, vertical, or diagonal) wins
5. Click "New Game" to start a fresh round
6. Click "Reset Scores" to clear all scores

## Files

- `index.html` - Main HTML structure
- `style.css` - Styling and animations
- `app.js` - Game logic and interactivity
- `README.md` - This file

## Testing Locally

Simply open `index.html` in any modern browser. No server required.

```bash
# macOS
open index.html

# Linux
xdg-open index.html

# Or use a simple HTTP server
python3 -m http.server 8000
# Then visit http://localhost:8000
```

## Accessibility

- Semantic HTML with proper ARIA labels
- Keyboard navigation support
- Focus indicators
- Screen reader friendly status updates

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge).
