'use strict';

const wowsearchCrypto = require('..');
const nps = require('path')

describe('wowsearch-crypto', () => {
    it('spec tests', () => {
      const cry = wowsearchCrypto({
        publicKeyPath: nps.join(__dirname, 'public.crt'),
        privateKeyPath: nps.join(__dirname, 'private.pem'),
      })

      expect(cry.decrypt(
        cry.encrypt('abc')
      )).toBe('abc')
    });
});
