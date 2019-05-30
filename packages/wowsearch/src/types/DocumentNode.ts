/**
 * @file ContentNode
 * @author Cuttle Cong
 * @date 2019/5/29
 *
 */

import WithChildrenNode from "./WithChildrenNode";

export default class DocumentNode extends WithChildrenNode {
  public global = new Map<string, string>()
  public readonly type = 'document'
}
