import { describe, expect, it } from 'vitest';

import { hashToken } from '../../src/utils/utils.js';

describe('hashToken', () => {
  it('should generate a SHA-256 hash for a token', () => {
    const token = 'hello';

    const result = hashToken(token);

    expect(result).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
  });

  it('should return the same hash for the same token', () => {
    const token = 'adminsphere';

    expect(hashToken(token)).toBe(hashToken(token));
  });

  it('should return different hashes for different tokens', () => {
    expect(hashToken('token-one')).not.toBe(hashToken('token-two'));
  });
});
