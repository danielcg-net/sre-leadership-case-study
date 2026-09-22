// Adapted from danielcg-net/bizyeet-ai-tools; scoped to the SRE project.
import { marked } from 'marked';

const branchPattern = /^(sre-\d+)\/[a-z0-9][a-z0-9-]*$/u;
export const isTrustedDependabotAuthor = login => login === 'dependabot[bot]';

function linkDestinations(value) {
  if (Array.isArray(value)) return value.flatMap(linkDestinations);
  if (typeof value !== 'object' || value === null) return [];
  if (value.type === 'link') return typeof value.href === 'string' ? [value.href] : [];
  if (['html', 'code', 'codespan', 'image'].includes(value.type)) return [];
  return Object.values(value).flatMap(linkDestinations);
}

export function validatePullRequestBody(issueId, body) {
  const links = typeof body === 'string' && body.length <= 65_536
    ? linkDestinations(marked.lexer(body, { gfm: true })) : [];
  const matches = /^sre-\d+$/u.test(issueId) && links.some(candidate => {
    if (!/^https:\/\/[^/\\\s]+(?:\/|$)/iu.test(candidate) || /[\s\\]/u.test(candidate) || !URL.canParse(candidate)) return false;
    const url = new URL(candidate);
    return url.protocol === 'https:' && url.hostname === 'bizyeet.youtrack.cloud'
      && url.port === '' && url.username === '' && url.password === ''
      && url.pathname.replace(/\/$/u, '').toLowerCase() === `/issue/${issueId}`;
  });
  return matches ? [] : [`PR body must include https://bizyeet.youtrack.cloud/issue/${issueId.toUpperCase()}.`];
}

export function validatePullRequestMetadata({ branch, title }) {
  if (typeof branch !== 'string') return { errors: ['Branch name is required.'], issueId: null };
  const match = branchPattern.exec(branch);
  if (!match) return { errors: [`Branch '${branch}' must use 'sre-123/concise-description'.`], issueId: null };
  const issueId = match[1];
  const titlePattern = new RegExp(`^${issueId.toUpperCase()}:\\s\\S`, 'u');
  return typeof title === 'string' && titlePattern.test(title)
    ? { errors: [], issueId }
    : { errors: [`PR title must start with '${issueId.toUpperCase()}: '.`], issueId };
}

export function validateCommitMessages(issueId, commits) {
  if (commits.length === 0) return ['PR must contain at least one commit.'];
  const pattern = new RegExp(`^${issueId}:\\s\\S`, 'u');
  const invalid = commits.map(({ sha, commit, parents }) => ({
    sha: sha.slice(0, 7),
    subject: typeof commit.message === 'string' ? commit.message.trim().split('\n', 1)[0] || '(empty message)' : '(empty message)',
    merge: Array.isArray(parents) && parents.length > 1
  })).filter(({ subject, merge }) => !merge && !pattern.test(subject));
  return invalid.length === 0 ? [] : [
    `Every non-merge PR commit must start with '${issueId}: '. Invalid commits: `
    + invalid.slice(0, 10).map(({ sha, subject }) => `${sha} (${subject})`).join(', ')
    + (invalid.length > 10 ? `, and ${invalid.length - 10} more.` : '')
  ];
}
