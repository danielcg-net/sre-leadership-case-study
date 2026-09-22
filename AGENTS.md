# SRE leadership case study

## Work tracking

Use the [SRE YouTrack project](https://bizyeet.youtrack.cloud/projects/SRE), with project key `SRE`, for all case-study work. Use the YouTrack MCP to manage issues. Keep case-study issues out of other projects. The associated repository is `danielcg-net/sre-leadership-case-study`.

Follow [CONTRIBUTING.md](CONTRIBUTING.md): branch `sre-123/description`, PR title `SRE-123: Summary`, authored commit subject `sre-123: summary`, and matching canonical YouTrack URL in the PR body. Deliver through a PR; never bypass protections or push directly to `main`. Resolve an issue only after merge and passing checks.

## Neutral identity

Never mention the source company's name in any output for this case. This includes prose, artifacts, diagrams, filenames, metadata, GitHub content, YouTrack content, and published pages. Use neutral terms such as "the platform" or "the webhook delivery platform". Do not copy source branding or publish the original exercise document.

## Artifact quality

Keep all case-study artifacts direct, carefully curated, and free of filler. Include only material that supports the case's reasoning, decisions, tradeoffs, or operational outcomes. Use precise language, avoid repetition and decorative content, and keep each artifact focused on a clear purpose. Prefer a small set of useful artifacts over exhaustive coverage.

## Technology neutrality and diagrams

Describe required behavior without assuming a cloud provider, broker, database, runtime, or monitoring product. Label proposals and assumptions explicitly. Maintain diagram sources in `diagrams/*.mmd`; generate SVGs with `npm run build`. Use the shared Mermaid theme and accessible titles/descriptions. Publish static SVG assets, not a browser-side Mermaid dependency.
