# nbd-sites — Session Progress Summary
## Date: 2026-07-21

### Sites built
- **Landing page** (`tld/`) — deployed to https://nbd.sh
  - Vite + React + TypeScript
  - Dark theme, purple accent (#6c5ce7)
  - Hero, feature cards, one-command install blocks
  - Build: ~198KB JS, ~4KB CSS
- **Docs site** (`docs/`) — deployed to https://docs.nbd.sh
  - Vite + React + TypeScript + react-router-dom
  - Sidebar nav with 6 pages: Home, Setup, Master, Node, API, Architecture
  - API reference tables, architecture diagram, code examples
  - Build: ~242KB JS, ~4KB CSS

### Deploy
- `npm run build && npm run deploy` for each site
- `webhost` at 10.0.180.131 (added to /etc/hosts)
- SSH key auth configured for passwordless deploy
- Deploy target: `tcon@webhost:/var/www/nbd.sh/html/` and `tcon@webhost:/var/www/docs.nbd.sh/html/`

### GitHub repo
- `github.com/tconn93/nbd-sites`
- Monorepo with both sites
