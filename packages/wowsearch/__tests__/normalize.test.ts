/**
 * @file main.test
 * @author Cuttle Cong
 * @date 2018/6/10
 * @description
 */
import { readFileSync } from 'fs'
import { makeFixture } from './help'
import { normalize } from '../src/types/Config'

describe('normalize', function() {
  it('normalize throw error', function() {
    expect(() => normalize({})).toThrowErrorMatchingSnapshot()
    expect(() =>
      normalize({ strip_chars: null, start_urls: 'abc' })
    ).toThrowErrorMatchingSnapshot()
  })
  it('should normalized', function() {
    let c = { selectors: {} }
    let normalized = normalize(c)
    expect(normalized).toMatchSnapshot()
    expect(normalized).not.toBe(c)
  })
})
