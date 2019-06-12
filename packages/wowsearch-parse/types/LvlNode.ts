import WithChildrenNode from "./WithChildrenNode";

/**
 * @file ContentNode
 * @author Cuttle Cong
 * @date 2019/5/29
 *
 */

export default class LvlNode extends WithChildrenNode {
  public readonly type = 'lvl'
  public level: number
  public anchor: string

  constructor(level = 0, value = null, children?) {
    super(value, children)
    this.level = level
  }
}
