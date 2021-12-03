import { randomInt } from "../utils/funcs"

export default class AiTicTacToe {

  gameState(impact) {
    let result = [{receiver: {kind: 'game'}, wait: false}]

    if (impact.act == 'play') {
      switch (impact.sender.status) {
        case 'none':
          result[0].status = 'play'
          result = result.concat(this.botStep(impact))
          break;
        default:
          console.log('TODO', impact.sender.status, impact)
          result[0].status = impact.act
        }
      }
    else {
      console.log('TODO', impact.act, impact)
      result[0].status = impact.act
    }

    return result
  }

  thinkIt(impact, dispatcher) {

    if (impact.sender.kind == 'game' && impact.act) {
      let result = {receiver: {kind: 'game'}, info: 'Ожидание ответа противника', wait: true}
      dispatcher(result)

      dispatcher(this.gameState(impact))
      return
    }

    if (!impact.impact) {
      dispatcher({error: 'AiTicTacToe: неизвестный impact'})
      return
    }

    let cell = impact.impact.sender
    let funcBotStep = this.botStep;

    function calcMotion() {
      let result = {receiver: {kind: 'board'}, cells: [], wait: true}
      let manCell = cell.id
      let canBotStep = true

      if (cell.chip == 'chip') {
        result.cells.push({id: manCell, chip: 'O', info: `user походил ${manCell}` })
      }
      else {
        // result.cells.push({id: manCell, chip: (cell.chip == 'X' ? 'O' : 'X')})
        result.cells.push({id: manCell, info: `Клетка ${manCell} уже занята`})
        result.wait = false
        canBotStep = false
      }

      dispatcher(result)
      if (canBotStep) setTimeout(() => dispatcher(funcBotStep(impact, manCell)), 30)
    }

    setTimeout(calcMotion, 30)
  }

  // ход бота
  botStep(impact, manCell) {
    let result = {receiver: {kind: 'board'}, cells: [], wait: true}

    let board = impact.sender.cells
    let freeCells = board.filter(eachCell => eachCell.chip == 'chip' && eachCell.id != manCell)

    if (freeCells.length) {
      let iii = randomInt(0, freeCells.length-1)
      let newCell = freeCells[iii]
      result.cells = [{id: newCell.id, chip: 'X', info: `bot походил ${newCell.id}`}]
    }

    return [result, {receiver: {kind: 'board'}, wait: false}]
  }
}