import { isString, randomInt } from "../utils/funcs"

export default class AiTicTacToe {

  winnerLines

  constructor() {
    this.winnerLines = this._initWinnerLines()
  }

  _initWinnerLines() {
    let result = []

    for (let ccc = 1; ccc < 4; ++ccc) {
      let lineR = [], lineC = []
      for (let rrr = 1; rrr < 4; ++rrr) {
        lineR = lineR.concat("" + ccc + rrr)
        lineC = lineC.concat("" + rrr + ccc)
      }
      result = result.concat([lineR], [lineC])
    }

    result = result.concat([['11','22','33']], [['13','22','31']])

    return result
  }

  /**
   * Эта логика будет продублирована на сервере, поэтому нельзя брать GameStatuses
   * @param {*} impact
   * @returns
   */
  gameState(impact) {
    let result = [{receiver: {kind: 'game'}, wait: false}]

    if (impact.act == 'status-new') {

      result[0].act = impact.act

      switch (impact.actData) {
        case 'ready':
          result[0].actData = 'ready'
          break;
        case 'play':
          result[0].actData = 'play'
          result = result.concat(this.botStep(impact))
          break;
        case 'finish':
          result[0].actData = 'finish'
          break;
        default:
          console.log('TODO status-new', impact.sender.status, impact)
          result[0].status = impact.act
        }
      }
    else {
      console.log('TODO act', impact.act, impact)
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
    let origCells = impact.sender.cells

    const calcMotion = () => {
      let resultCells = []
      let winnerResult = false;

      let result = {receiver: {kind: 'board'}, cells: [], wait: true}
      let manCell = cell.id
      let canBotStep = true

      if (cell.chip == 'chip') {
        let tCells = {id: manCell, chip: 'O', info: `user походил ${manCell}` }
        result.cells.push(tCells)
        resultCells = this.mergeCells(origCells, result.cells)
        winnerResult = this.checkWin(origCells, result.cells)
      }
      else {
        // result.cells.push({id: manCell, chip: (cell.chip == 'X' ? 'O' : 'X')})
        result.cells.push({id: manCell, info: `Клетка ${manCell} уже занята`})
        result.wait = false
        canBotStep = false
      }

      dispatcher(result)

      if (winnerResult) {
        this.dispatchFinish(winnerResult, dispatcher)
      }
      else if (canBotStep) setTimeout(() => {
        let fullResult = this.botStep(impact, manCell)
        dispatcher(fullResult);
        winnerResult = this.checkWin(resultCells, fullResult[0].cells)
        if (winnerResult) this.dispatchFinish(winnerResult, dispatcher)
      })
    }

    setTimeout(calcMotion, 100)
  }

  // создаем новое расположение фишек на поле
  mergeCells(origCells, newCells) {

    console.log('mergeCells <=',origCells, newCells)

    let resultCells = origCells.map(cell =>
      newCells.find(c => c.id == cell.id) || cell
    )
    console.log('mergeCells =>',origCells, resultCells)
    return resultCells
  }

  checkWin(origCells, newCells) {
    // получить итоговое расположение на поле
    let resultCells = this.mergeCells(origCells, newCells)

    // проверить выигрышную позицию
    // для каждой клетки выбираем выигрышные прямые
    let winLines = this.winnerLines.filter(wL =>
      wL.some(cellID => newCells.some(nC => cellID == nC.id))
    )

    // console.log('winLines', winLines, newCells)

    let winCell = null
    let checkedCells = null
    // проверяем нахождение на прямой одинаковых фишек
    let oneWinLine = winLines.find(wL => {
      let result = false;

      for(let nCell of newCells) { // перебираем все фмшки этого хода
        let {id: cellID, chip} = nCell

        // console.log('oneWinLine for',cellID, chip)

        if (!wL.includes(cellID)) continue;

        checkedCells = resultCells.filter(cL => wL.includes(cL.id)) // из конечного поля выбираем по победной линии

        result = checkedCells.every(cL => cL.chip == chip) // на линии все фишки как nCell
        if (result) {
          winCell = nCell
          break;
        }
      }

      return result
    })

    if (oneWinLine) {
      // console.log('WINNER', oneWinLine, winCell, checkedCells)
      return [oneWinLine, winCell, checkedCells]
    }
    else {  // проверяем на ничью
      if (resultCells.every(cell => cell.chip != 'chip')) {
        return ['FINAL ничья']
      }
    }

    return false
  }

  // проверка победы или ничьи
  dispatchFinish(winnerResult, dispatcher) {

    let sendImpact = {
      act: 'status-new',
      actData: 'finish',
      info: '',
      receiver: {
        kind: 'game'
      },
    wait: true}

    const [oneWinLine, winCell, checkedCells] = winnerResult

    if (isString(oneWinLine)) {
      sendImpact.info = oneWinLine
      dispatcher(sendImpact)
      return
    }

    // отметить ячейки которые выиграли
    checkedCells.forEach(cell => {
      cell.effect = 'WIN'
    });

    // winCell.effect =

    // отослать
    let result = {receiver: {kind: 'board'}, cells: checkedCells}
    dispatcher(result)

    // завершить игру
    sendImpact.info = 'FINAL Победили ' + winCell.chip
    dispatcher(sendImpact)
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