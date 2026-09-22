# Contributing

Track work in the [SRE YouTrack project](https://bizyeet.youtrack.cloud/projects/SRE). Ask a maintainer for an issue identifier if you do not have tracker access.

- Branch: `sre-123/short-description`.
- PR title: `SRE-123: Describe the change`.
- Every authored commit: `sre-123: describe the change`.
- PR body: include the matching HTTPS issue link, such as `[SRE-123](https://bizyeet.youtrack.cloud/issue/SRE-123)`.

The delivery check parses actual Markdown link destinations and checks that identifiers match. It does not contact YouTrack, confirm issue existence, or require tracker credentials. Generated merge commits are exempt from the commit-subject convention. Only the authenticated `dependabot[bot]` author is exempt from the delivery identifiers; its PRs still need the other required checks.

Use Node.js 24 (`.nvmrc`), install with `npm ci`, and run `npm run check`. Inspect changed diagram renders. Follow [AGENTS.md](AGENTS.md) for artifact quality and neutral wording.

## Merging

Changes reach `main` through squash-merged PRs. Branches must be up to date and all review threads resolved. Required checks are the site `build`, `Analyze JavaScript`, `Review dependency changes`, and `Validate YouTrack delivery`. The policy applies to administrators; force pushes and branch deletion are blocked, and commits on `main` must be signed. GitHub's squash merge produces the signed commit. Match the baseline's zero required approval reviews; CODEOWNERS requests review without making sole-maintainer work impossible.

The YouTrack workflow loads its parser from the trusted base commit, not the PR's proposed parser. Parser changes are tested by the ordinary PR build and take effect after merge. PR jobs have no deployment permissions; deployment runs only from `main`. Workflow actions are pinned to commit SHAs and dependencies are maintained with Dependabot.

The intended repository settings are recorded in [.github/repository-settings.json](.github/repository-settings.json). GitHub settings require an administrator to apply; editing that file alone does not change live protections.
