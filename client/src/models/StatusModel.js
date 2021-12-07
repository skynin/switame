export default class StatusModel {
  id = 'play'
  statusName = 'Старт'
  nextStatus = 'finish'
  statusLine = 'Идет игра'
  impactData
  activateStatus

  // 'ready', 'play', 'Готова', 'Игра в ожидании начала'
  constructor(id, nextStatus, name, statusLine, impactData) {
    this.id = id
    this.statusName = name
    this.nextStatus = nextStatus
    this.statusLine = statusLine
    this.impactData = impactData
  }
}