/**
 * @file help
 * @author Cuttle Cong
 * @date 2018/6/10
 * @description
 */
import * as nps from 'path'

export function makeFixture(...args): string {
  return nps.join.apply(null, [__dirname, 'fixture'].concat(args))
}
