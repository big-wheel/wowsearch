/**
 * @file ContentNode
 * @author Cuttle Cong
 * @date 2019/5/29
 *
 */

export default class ContentNode {
  public type: string
  public value: string
  public domNode?: Node

  constructor(value = null) {
    this.value = value
  }


}
