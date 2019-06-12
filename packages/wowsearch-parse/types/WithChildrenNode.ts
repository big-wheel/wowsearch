import ContentNode from "./ContentNode";

/**
 * @file ContentNode
 * @author Cuttle Cong
 * @date 2019/5/29
 *
 */

export default class WithChildrenNode extends ContentNode {
  public children: ContentNode[]

  constructor(value = null, children = []) {
    super(value)
    this.children = children
  }
}
