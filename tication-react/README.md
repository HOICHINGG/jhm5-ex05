# Tication (React + localStorage)

An enhanced Tic-Tac-Toe game built with React, featuring move history, undo/redo, and persistent state via localStorage.

## Features

- ✅ Classic Tic-Tac-Toe gameplay
- ✅ Move history with time travel (undo/redo)
- ✅ Persistent state using localStorage
- ✅ Score tracking across sessions
- ✅ Responsive design
- ✅ Keyboard accessible
- ✅ Built with React 18 + Vite

## Getting Started

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

Visit http://localhost:5173

### Build for production

```bash
npm run build
```

Output will be in `dist/` folder.

### Preview production build

```bash
npm run preview
```

## How to Play

1. Click any empty cell to place your mark
2. Players alternate between X and O
3. Use Undo/Redo to navigate through move history
4. Click "New Game" to start fresh while keeping scores
5. Click "Reset All" to clear everything including localStorage

## Project Structure

```
src/
├── components/
│   ├── Game.jsx          # Main game container with state
│   ├── Board.jsx         # 3x3 grid of cells
│   ├── Status.jsx        # Current game status display
│   ├── Controls.jsx      # Game control buttons
│   ├── Scoreboard.jsx    # Win/draw counters
│   └── History.jsx       # Move history timeline
├── utils/
│   ├── storage.js        # localStorage helpers
│   └── gameLogic.js      # Win detection logic
├── App.jsx               # Root component
├── main.jsx              # Entry point
└── index.css             # Global styles
```

## Storage Schema

localStorage key: `tication:state`

```json
{
  "history": [board1, board2, ...],
  "currentStep": 0,
  "scores": { "X": 0, "O": 0, "draws": 0 },
  "playerNames": { "X": "Player X", "O": "Player O" }
}
```

## Technologies

- React 18
- Vite 5
- CSS3 (CSS variables, Grid, Flexbox)
- localStorage API

## Browser Support

Modern browsers with ES2020+ support.
