# SRE Leadership Case Study

A case study in improving reliability for a multi-tenant webhook delivery platform: prioritizing failure modes, leading incidents, and driving improvements across service-owning teams.

The [diagram site](https://danielcg-net.github.io/sre-leadership-case-study/) presents the current architecture, proposed architecture, and delivery/retry sequence. Proposals and assumptions are labeled; no infrastructure provider is assumed.

## Build diagrams and site

Requires Node.js 22 or newer. Install locked dependencies with `npm ci`, then run `npm run build`. The build uses Mermaid CLI and its headless browser to generate accessible SVGs in `dist/diagrams/` and copies the static site into `dist/`.

Edit `diagrams/*.mmd` and use `diagrams/theme.json` for shared styling. Each diagram needs `accTitle` and `accDescr`. The build also publishes editable sources alongside the SVGs. Generated output is not committed.

To preview locally, run `python3 -m http.server 8080 --directory dist` and open `http://localhost:8080`.

Pull requests build the site for validation. Changes merged into `main` build and deploy to GitHub Pages using GitHub Actions. Visitors receive static HTML, CSS, and SVG; no client-side diagram renderer is needed.

Work is tracked in the [SRE project](https://bizyeet.youtrack.cloud/projects/SRE).

Artifact quality is governed by [AGENTS.md](AGENTS.md).
