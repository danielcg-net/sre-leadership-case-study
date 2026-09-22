import assert from 'node:assert/strict';
import test from 'node:test';
import { isTrustedDependabotAuthor, validatePullRequestBody, validatePullRequestMetadata, validateCommitMessages } from './validate-youtrack-delivery-policy.mjs';

const commit = (message, parents = [{}]) => ({ sha: 'abc123456', commit: { message }, parents });

test('accepts matching branch, title, and authored commits', () => {
  assert.deepEqual(validatePullRequestMetadata({ branch: 'sre-101/protect-main', title: 'SRE-101: Protect main' }), { errors: [], issueId: 'sre-101' });
  assert.deepEqual(validateCommitMessages('sre-101', [commit('sre-101: protect main\n\nDetails')]), []);
});

test('rejects malformed branches and mismatched or empty title subjects', () => {
  for (const branch of [null, 'feature/protection', 'SRE-101/protection', 'sre-101', 'sre-101/', 'sre-101/a/b', 'sre-101/Bad']) {
    assert.equal(validatePullRequestMetadata({ branch, title: 'SRE-101: Protection' }).errors.length, 1);
  }
  for (const title of [null, 'SRE-102: Wrong issue', 'SRE-1010: Wrong issue', 'sre-101: Wrong case', 'SRE-101:   ']) {
    assert.equal(validatePullRequestMetadata({ branch: 'sre-101/protection', title }).errors.length, 1);
  }
});

test('rejects empty, unprefixed and mismatched commits but permits generated merge commits', () => {
  assert.equal(validateCommitMessages('sre-101', []).length, 1);
  for (const subject of [null, '', ' ', 'update', 'sre-102: wrong', 'SRE-101: wrong case', 'sre-101: ']) {
    assert.equal(validateCommitMessages('sre-101', [commit(subject)]).length, 1);
  }
  assert.deepEqual(validateCommitMessages('sre-101', [commit('Merge main', [{}, {}]), commit('sre-101: update')]), []);
  assert.equal(validateCommitMessages('sre-101', [commit('Merge main', [{}, {}]), commit('wrong')]).length, 1);
});

test('only the authenticated Dependabot author is exempt', () => {
  assert.equal(isTrustedDependabotAuthor('dependabot[bot]'), true);
  for (const author of [null, 'dependabot', 'dependabot[bot] ', 'other[bot]']) assert.equal(isTrustedDependabotAuthor(author), false);
});

test('accepts actual canonical Markdown, reference and plain links', () => {
  for (const body of [
    'https://bizyeet.youtrack.cloud/issue/SRE-101',
    '[Issue](https://bizyeet.youtrack.cloud/issue/sre-101)',
    '<https://bizyeet.youtrack.cloud/issue/SRE-101>',
    'https://bizyeet.youtrack.cloud/issue/SRE-101/#focus=Comments',
    'Tracked at https://bizyeet.youtrack.cloud/issue/SRE-101.',
    '[Work][issue]\n\n[issue]: https://bizyeet.youtrack.cloud/issue/SRE-101'
  ]) assert.deepEqual(validatePullRequestBody('sre-101', body), [], body);
});

test('rejects missing, misleading, concealed and wrong-issue links', () => {
  for (const body of [
    null, {}, '', 'SRE-101', 'a'.repeat(65_537),
    'https://bizyeet.youtrack.cloud/issue/SRE-102',
    'https://bizyeet.youtrack.cloud/issue/SRE-1010',
    'https://bizyeet.youtrack.cloud/issue/SRE-101/other',
    'http://bizyeet.youtrack.cloud/issue/SRE-101',
    '[issue](https:bizyeet.youtrack.cloud/issue/SRE-101)',
    '[issue](https:/bizyeet.youtrack.cloud/issue/SRE-101)',
    '[issue](https:///bizyeet.youtrack.cloud/issue/SRE-101)',
    '[issue](//bizyeet.youtrack.cloud/issue/SRE-101)',
    'https://bizyeet.youtrack.cloud.evil.example/issue/SRE-101',
    'https://bizyeet.youtrack.cloud@evil.example/issue/SRE-101',
    'https://user@bizyeet.youtrack.cloud/issue/SRE-101',
    'https://bizyeet.youtrack.cloud:8443/issue/SRE-101',
    'https://example.com/?next=https://bizyeet.youtrack.cloud/issue/SRE-101',
    '[https://bizyeet.youtrack.cloud/issue/SRE-101](https://example.com)',
    '[ https://bizyeet.youtrack.cloud/issue/SRE-101 ][bad]\n\n[bad]: https://evil.example',
    '`https://bizyeet.youtrack.cloud/issue/SRE-101`',
    '```\nhttps://bizyeet.youtrack.cloud/issue/SRE-101\n```',
    '<!-- https://bizyeet.youtrack.cloud/issue/SRE-101 -->',
    '![image](https://bizyeet.youtrack.cloud/issue/SRE-101)',
    '[unused]: https://bizyeet.youtrack.cloud/issue/SRE-101',
    'https://[invalid/issue/SRE-101'
  ]) assert.equal(validatePullRequestBody('sre-101', body).length, 1, String(body).slice(0, 150));
});
