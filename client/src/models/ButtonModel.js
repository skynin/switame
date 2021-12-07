export default class ButtonModel {
  id
  hoverIndicator = true
  label = ""
  margin = "small"

  actClick

  constructor(id, label, action) {
    this.id = id
    this.label = label
    this.actClick = action || (() => console.log('ButtonModel.click ' + this.label)).bind(this)
  }
}