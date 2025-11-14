# TryOn

Modern premium fashion homepage concept built with React (Vite) and a lightweight Node/Express API layer.

## Getting Started

```bash
# install deps
cd client && npm install
cd ../server && npm install

# run dev servers
npm run dev        # inside client (Vite on 5173)
npm run dev        # inside server (Express on 4000)
```

Update `client/src/data/content.js` to experiment with new hero slides, categories, and featured or trending products. Switch to live data by pointing the React app to the Node endpoints in `server/src/index.js`.