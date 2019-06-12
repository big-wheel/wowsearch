/**
 * @file match
 * @author Cuttle Cong
 * @date 2018/6/10
 * @description
 */
import * as mm from 'minimatch'
import * as w from "walli";

export type Rule = RegExp | Function | string
export const walliRule = w.oneOf([w.instanceOf(RegExp), w.function_, w.string])

export function isRule(rule) {
  return walliRule.ok(rule)
}

function match(rule: Rule, value: string) {
  if (rule instanceof RegExp) {
    return rule.test(value)
  }
  if (typeof rule === 'function') {
    return rule(value)
  }
  return mm(value, rule, { matchBase: true })
}

export default match
