/**
 * @file match
 * @author Cuttle Cong
 * @date 2018/6/10
 * @description
 */
import * as mm from 'minimatch'
import * as w from "walli";
import * as isObj from "is-plain-object";

export type StrictRule = RegExp | Function | string
export type Rule = StrictRule | {test: Rule, [key: string]: any}
export const walliStrictRule = w.oneOf([w.instanceOf(RegExp), w.function_, w.string])
export const walliRule = w.oneOf([
  walliStrictRule,
  w.leq({
    test: walliStrictRule
  })
])

export function isRule(rule) {
  return walliRule.ok(rule)
}

export function matchStrictRule(rule: StrictRule, value: string) {
  if (rule instanceof RegExp) {
    return rule.test(value)
  }
  if (typeof rule === 'function') {
    return rule(value)
  }
  return mm(value, rule, { matchBase: true })
}


export default function matchRule(rule: any, value: string) {
  // @ts-ignore
  if (rule && rule.test && isObj(rule)) {
    return matchStrictRule(rule.test as StrictRule, value) && rule
  }

  return matchStrictRule(rule as StrictRule, value) && rule
}
