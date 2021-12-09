import { isString, randomInt, shuffleArray } from "../utils/funcs"

class InfoData {
  winner = '?'
  info = ''

  toString() {
    if (this.winner && this.winner != '?')
      return `Итог: ${this.winner} победили ${this.info}`

    return `Итог: ${this.info}`
  }
}

export default class AiTicTacToe {

  winnerLines

  // Люди с тяжелой формой умственной отсталости не поддаются обучению и воспитанию,
  // имеют уровень интеллектуального развития до 20 баллов. Они находятся под опекой других людей,
  // так как не могут о себе позаботиться, и живут в собственном мире. Таких людей в мире 0,2 %.
  botIntellect = 20
  boardSize = 9

  maxHumanIQ = 144 // 0,2% людей
  avgHumanIQ = 110 // это средний уровень IQ

  winnerCellID = '22'

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
          this.botChip = 'O'
          result[0].actData = 'play'
          break;
        case 'finish':
          result[0].actData = 'finish'
          break;
        default:
          console.log('TODO status-new', impact.sender.status, impact)
          result[0].status = impact.act
        }
      }
    else if (impact.act == 'step') {
      if (this.botIntellect > this.avgHumanIQ) { // шибко умный, для первого хода
        let extraIQ = Math.floor(Math.log(3 + this.botIntellect - this.avgHumanIQ) / Math.log(1.2))
        this.botIntellect = this.avgHumanIQ + extraIQ
      }

      this.botChip = 'X'
      result = this.botStep(impact.sender.cells)
    }
    else {
      console.log('TODO act', impact.act, impact)
      result[0].status = impact.act
    }

    return result
  }

  get userChip() {
    return this.botChip == 'X' ? 'O' : 'X'
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
        let tCells = {id: manCell, chip: this.userChip, info: `user походил ${manCell}` }
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

      if (manCell==this.winnerCellID) this.botIntellect += 6 // бот быстро смекает что центральная клетка выгодная

      dispatcher(result)

      if (winnerResult) {
        this.dispatchFinish(winnerResult, dispatcher)
        this.botIntellect += 4 // бот учится на ошибках
      }
      else if (canBotStep) setTimeout(() => {
        let fullResult = this.botStep(resultCells)
        dispatcher(fullResult);
        winnerResult = this.checkWin(resultCells, fullResult[0].cells)
        if (winnerResult) {
          this.dispatchFinish(winnerResult, dispatcher, `; IQ бота ${this.botIntellect}`)
          this.botIntellect -= 2 // головокружение от успеха
        }
      })
    }

    setTimeout(calcMotion)
  }

  // создаем новое расположение фишек на поле
  mergeCells(origCells, newCells) {
    // console.log('mergeCells <=',origCells, newCells)
    let resultCells = origCells.map(cell =>
      newCells.find(c => c.id == cell.id) || cell
    )
    // console.log('mergeCells =>',origCells, resultCells)
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
        return ['ничья']
      }
    }

    return false
  }

  // проверка победы или ничьи
  dispatchFinish(winnerResult, dispatcher, extInfo='') {

    let sendImpact = {
      act: 'status-new',
      actData: 'finish',
      info: '',
      receiver: {
        kind: 'game'
      },
    wait: true}

    const [oneWinLine, winCell, checkedCells] = winnerResult

    let infoData = new InfoData()

    if (isString(oneWinLine)) { // ничья
      infoData.winner = '?'
      infoData.info = oneWinLine + extInfo
      sendImpact.info = infoData
      dispatcher(sendImpact)

      --this.botIntellect // бот дает фору
      return
    }

    // отметить ячейки которые выиграли
    checkedCells.forEach(cell => {
      cell.effect = 'WIN'
    });

    // отослать
    let result = {receiver: {kind: 'board'}, cells: checkedCells}
    dispatcher(result)

    // завершить игру
    infoData.winner = winCell.chip
    infoData.info = extInfo
    sendImpact.info = infoData

    dispatcher(sendImpact)
  }

  // ход бота
  botStep(boardCells) {

    let result = {receiver: {kind: 'board'}, cells: false, wait: true}

    // console.log('botStep',boardCells)

    let freeCells = boardCells.filter(eachCell => eachCell.chip == 'chip')

    if (freeCells.length > 3) shuffleArray(freeCells)

    // ищем свой выигрышный ход
    // Уровень IQ от 21 до 50 https://brainapps.ru/blog/2015/08/urovni-znacheniy-iq-i-ikh-rasshifrovka/
    // около 2% людей - слабоумие, способны позаботиться о себе, обычно имеют опекунов
    if (this.botIntellect > 50 || randomInt(0,50) < this.botIntellect) {
      for (let nCell of freeCells) {
        let tCells = [{...nCell, chip: this.botChip, info: `bot походил ${nCell.id}`}]

        if (this.checkWin(boardCells, tCells)) {
          result.cells = tCells
          return [result, {receiver: {kind: 'board'}, wait: false}]
        }
      }
    }

    // ищем чужой выигрышный ход, если интеллекта хватает
    if (randomInt(51,this.avgHumanIQ) < this.botIntellect) {
      for (let nCell of freeCells) {
        let tCells = [{...nCell, chip: this.userChip, info: `user походил ${nCell.id}`}]

        if (this.checkWin(boardCells, tCells)) {
          result.cells = [{...nCell, chip: this.botChip, info: `bot походил ${nCell.id}`}]
          return [result, {receiver: {kind: 'board'}, wait: false}]
        }
      }
    }

    // случайный выбор
    if (freeCells.length) {
      if (freeCells.length < (this.boardSize-2) && freeCells.length > 1) ++this.botIntellect; // интеллект бота растет

      let newCell = null
      let winnerCell = freeCells.find(cell => cell.id == this.winnerCellID)

      if (winnerCell && randomInt(0,this.avgHumanIQ) < this.botIntellect) { // смышленый бот пробует использовать центр
        newCell = winnerCell
      }
      else if (randomInt(51,this.maxHumanIQ) < this.botIntellect) { // умный бот ходит в угол или в центр
        let cornerCells = freeCells.filter(fCell => ['11','13','31','33',this.winnerCellID].includes(fCell.id))
        let iii = randomInt(0, cornerCells.length-1)
        newCell = cornerCells[iii]
      }

      if (!newCell) {
        let iii = randomInt(0, freeCells.length-1)
        newCell = freeCells[iii]
      }

      if (newCell.id == this.winnerCellID) --this.botIntellect // мягко наказываем бота за использование центральной клетки

      result.cells = [{id: newCell.id, chip: this.botChip, info: `bot походил ${newCell.id}`}]
    }

    return [result, {receiver: {kind: 'board'}, wait: false}]
  }
}