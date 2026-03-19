# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**"Lern die Uhr"** is a Node.js/Express web app for teaching children (grades 1–3) to read analog clocks, designed for tablet use in classrooms.

## Commands

All commands run from `mokikz-express/`:

```bash
npm start          # Start server on port 3000
npm test           # Run mocha tests (TDD, recursive)
```

Single test file:
```bash
node ./node_modules/mocha/bin/mocha -u tdd ./test/integrationTest.js
```

Docker build and run:
```bash
docker build -t ldu .
docker run -p 3000:3000 ldu
```

## Architecture

### Server (`mokikz-express/`)

- **`app.js`** — Express app. A middleware on `/:klasse` reads the `?klasse=` query param and writes it into a cookie, then passes through to static/routes. This is how the classroom assignment is set.
- **`routes/data.js`** — Serves `/scripts/data.js` dynamically: reads the `klasse` cookie and returns `public/data/<klasse>.js` if it exists, otherwise falls back to `public/data/data.js`. This is how per-class exercise content is injected into the frontend.
- Entry point: `bin/www`, serves `mainframe.html` as the directory index.

### Frontend (`mokikz-express/public/`)

The game runs entirely in-browser using Canvas. Scripts use the `LernDieUhr` namespace (module pattern in `scripts/module-pattern.js`):

| Script | Role |
|---|---|
| `model.js` | Central game state; stores/retrieves values, wraps `persistence.js` |
| `clock.js` | Renders the analog clock on `<canvas id="mainarea">` |
| `game.js` | Game loop, dialog management, level logic |
| `persistence.js` | localStorage save/restore of game state |
| `score.js` | Tracks and displays score |
| `movie.js` | Intro animation scenes (Ken Burns / pan / fade) on `<canvas id="moviearea">` |
| `character.js` | Animated character/eyes overlay |
| `timewords.js` | Converts hours/minutes to German/English text (e.g. "halb drei") |
| `data.js` | Loaded dynamically by the server; defines the exercise questions per class |
| `loader.js` | Preloads images, fires callback when done |
| `cache.js` | App cache / offline manifest helper |

### Class Data (`public/data/`)

Each file (e.g. `eltmann.js`, `ritter.js`) defines the exercise set for a specific class. `data.js` is the default fallback. Add a new file here to support a new class; the server will serve it automatically when `?klasse=<filename-without-extension>` is used.

### Deployment (`deploy/`)

Uses Docker + Traefik (see `acme.json` for Let's Encrypt config). The Dockerfile copies only `mokikz-express/` into the image.
