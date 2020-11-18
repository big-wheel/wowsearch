import ContentNode from "./ContentNode";

/**
 * @file ContentNode
 * @author Cuttle Cong
 * @date 2019/5/29
 *
 */

export default class TextNode extends ContentNode {
  public type = 'text'
  public value: string | null

  constructor(value = null) {
    super()
    this.value = value
  }
}
