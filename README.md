# SRE Leadership Case Study

A case study in improving reliability for a multi-tenant webhook delivery platform: prioritizing failure modes, leading incidents, and driving improvements across service-owning teams.

The [diagram site](https://danielcg-net.github.io/sre-leadership-case-study/) presents the current architecture, proposed architecture, and delivery/retry sequence. Proposals and assumptions are labeled; no infrastructure provider is assumed.

The sidebar groups the pages by numbered domain:

- **1 - Current Architecture:** 1.1 Current Flow (`index.html`), 1.2 Architecture Patterns (`patterns.html`), 1.3 Failure Priorities (`failures.html`).
- **2 - Improvement Plan:** 2.1 Proposed Design (`proposed.html`), 2.2 Delivery Sequence (`sequence.html`), 2.3 Future Scope (`future.html`).
- **3 - Leadership and Adoption:** 3.1 Domains and Ownership (`ownership.html`).
- **4 - Reliability Evidence:** 4.1 KPIs and Business Outcomes (`metrics.html`), 4.2 Infrastructure Reliability (`infrastructure.html`).
- **5 - Running an Incident:** 5.1 Runbook-Led Response (`incident-runbook.html`), 5.2 AI-Assisted Response (`incident-ai.html`), 5.3 Automation Maturity (`incident-maturity.html`).

The proposed design and delivery sequence are limited to the three ranked reliability priorities. The pattern reference maps current challenges to candidate patterns, their fit, limits, and primary sources. Diagram frames scroll independently; full SVGs remain available. Previously shared section hash links still work.

## Build diagrams and site

Use Node.js 24 (`.nvmrc`). Install locked dependencies with `npm ci`, then run `npm run check` to test the delivery policy and build the site. `npm run build` builds only the site. The build uses Mermaid CLI and its headless browser to generate accessible SVGs in `dist/diagrams/` and copies the static site into `dist/`.

Edit `diagrams/*.mmd` and use `diagrams/theme.json` for shared styling. Each diagram needs `accTitle` and `accDescr`. The build also publishes editable sources alongside the SVGs. Generated output is not committed.

To preview locally, run `python3 -m http.server 8080 --directory dist` and open `http://localhost:8080`.

Pull requests build the site for validation. Changes merged into `main` build and deploy to GitHub Pages using GitHub Actions. Visitors receive static HTML, CSS, and SVG; no client-side diagram renderer is needed.

Work is tracked in the [SRE project](https://bizyeet.youtrack.cloud/projects/SRE).

See [CONTRIBUTING.md](CONTRIBUTING.md) for required PR identifiers, checks, and branch protections.

Artifact quality is governed by [AGENTS.md](AGENTS.md).
