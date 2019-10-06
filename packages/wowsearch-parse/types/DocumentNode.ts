/**
 * @file ContentNode
 * @author Cuttle Cong
 * @date 2019/5/29
 *
 */

import WithChildrenNode from './WithChildrenNode'
import { Rule } from '../match'

export default class DocumentNode extends WithChildrenNode {
  public urlRule: Rule
  public global = new Map<string, string | string[]>()
  public readonly type = 'document'

  public href: string
}
