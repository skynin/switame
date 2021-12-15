import { isString, randomInt, shuffleArray } from "../utils/funcs"
import FastBoard from "./FastBoard"

export class InfoData {
  winner = '?'
  info = ''

  toString() {
    if (this.winner && this.winner != '?')
      return `Итог: ${this.winner} победили ${this.info}`

    return `Итог: ${this.info}`
  }
}

export default class AiTicTac {

  // Люди с тяжелой формой умственной отсталости не поддаются обучению и воспитанию,
  // имеют уровень интеллектуального развития до 20 баллов. Они находятся под опекой других людей,
  // так как не могут о себе позаботиться, и живут в собственном мире. Таких людей в мире 0,2 %.
  botIntellect = 20
  // Уровень IQ от 21 до 50 https://brainapps.ru/blog/2015/08/urovni-znacheniy-iq-i-ikh-rasshifrovka/
  // около 2% людей - слабоумие, способны позаботиться о себе, обычно имеют опекунов
  lowHumanIQ = 45

  maxHumanIQ = 144 // 0,2% людей
  avgHumanIQ = 90 // это средний уровень IQ

  boardEdge = 3
  centerCellID = '22'

  constructor() {
    this._checkDirections = [[0,1],[1,0],[1,1],[-1,-1]] // variedCol=0 variedRow=1, variedCol=1 variedRow=0, variedCol=1 variedRow=1
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

  /**
   * @param {Array} origCells
   * @param {Array} newCells может быть undefined
   * @returns {(Array|boolean)} [winCell, checkedCells] | ['DRAW'] | false
   */
  checkWin(origCells, newCells) {

    // console.group('checkWin');

    // получить итоговое расположение на поле
    let resultCells = newCells ? this.mergeCells(origCells, newCells) : origCells

    let resultBoard = new FastBoard(resultCells, this)

    const checkXO = cell => cell.chip == 'X' || cell.chip == 'O'

    let occupiedCells = (newCells || origCells).filter(checkXO)

    let winCell = false
    let checkedCells = null

/**
по горизонтали:
variedCol=1 variedRow=0
если -1;0
  если 1;0 или -2;0
    НАШЛИ
иначе 1;0 и 2;0
	НАШЛИ

по вертикали
variedCol=0 variedRow=1
если 0;-1
	тогда если 0;1 или 0;-2
		НАШЛИ
иначе 0;1 и 0;2
	НАШЛИ

по диагонали 2 направления
variedCol=1 variedRow=1
если -1;-1 // variedCol*(-1);variedRow*(-1);
	тогда если 1;1 или -2;-2 // variedCol*(+1);variedRow*(+1) variedCol*(-2);variedRow*(-2)
		НАШЛИ
иначе 1;1 и 2;2 // variedCol*(+1);variedRow*(+1) variedCol*(+2);variedRow*(+2)
	НАШЛИ

  особая диагональ, с нижнего левого угла до верхнего правого
если 1;-1
	тогда если -1;1 или 2;-2
		НАШЛИ
иначе -1;1 и -2;2
	НАШЛИ

 * @param {Array} cDir variedCol variedRow
 * @param {Object} cCell
 * @returns {(Array|boolean)} [cCell, winCell1, winCell2]
 */
    const checkCell = (cDir, cCell) => {

      if (cCell) resultBoard.setVerifyCell(cCell, true);

      let [variedCol, variedRow]  = cDir
      // console.log('checkCell cDir', variedCol, variedRow)

      let algCoo = dfCoo[0]
      if (variedCol == -1 && variedRow == -1) {
        variedCol = 1
        variedRow = 1
        algCoo = dfCoo[1]
      }

      let found = false

      if (funcByVaried(variedCol * (algCoo[0][0]), variedRow * (algCoo[0][1]))) {
        if (funcByVaried(variedCol * (algCoo[1][0]), variedRow * (algCoo[1][1])) ||
          funcByVaried(variedCol * (algCoo[2][0]), variedRow * (algCoo[2][1]))) {
          found = true
        }
      }
      else if (funcByVaried(variedCol * (algCoo[3][0]), variedRow * (algCoo[3][1])) &&
        funcByVaried(variedCol * (algCoo[4][0]), variedRow * (algCoo[4][1])) ) {
        found = true
      }

      return found ? resultBoard.lastCheckedCells : false
    }
    var funcByVaried = resultBoard.checkChipByVaried.bind(resultBoard)
    var dfCoo = [ // для checkCell
      [[-1,-1], [1,1], [-2,-2], [1,1], [2,2]],
      [[1,-1], [-1,1], [2,-2], [-1,1], [-2,2]] // особая диагональ, с нижнего левого угла до верхнего правого
    ]

    for(let nCell of occupiedCells) { // перебираем все фмшки этого хода
      if (winCell) break;

      resultBoard.setVerifyCell(nCell)

      for (let ddd of this._checkDirections) { // по всем направлениям
        let found = checkCell(ddd);
        if (found) {
          winCell = nCell
          checkedCells = found
          break
        }

        resultBoard.clearLast()
      }
    }

    // console.groupEnd();

    return winCell ? [winCell, checkedCells] :
    (resultCells.filter(cell => cell.brim != '.').every(cell => cell.chip != 'chip' && cell.chip != '*') ? ['DRAW'] : false)
  }

    /**
   * Эта логика будет продублирована на сервере
   * @param {Object} impact
   * @returns {Object}
   */
  gameState(impact) {
    let result = [{receiver: {kind: 'game'}, wait: false}]

    if (impact.act == 'status-new') {

      result[0].act = impact.act

      switch (impact.actData) {
        case 'ready':
          result[0].actData = 'ready'
          shuffleArray(this._checkDirections)
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
      if (randomInt(this.avgHumanIQ, this.maxHumanIQ) < this.botIntellect) { // шибко умный стал
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
      return true
    }

    if (!impact.impact) {
      dispatcher({error: 'AiTicTacToe: неизвестный impact'})
      return true
    }

    let cell = impact.impact.sender
    let origCells = impact.sender.cells

    const calcMotion = () => {
      const startStep = Date.now() / 1000

      let resultCells = []
      let winnerResult = false;

      let result = {receiver: {kind: 'board'}, cells: [], wait: true}
      let manCell = cell.id
      let canBotStep = true

      if ((cell.chip == 'chip' && cell.brim == 'brim') || (cell.chip == '*' && cell.brim == 'brim')) {
        let tCells = {id: manCell, chip: this.userChip, info: `user походил ${manCell}` }
        result.cells.push(tCells)

        result.cells = this.boardChange(origCells, result.cells)
        resultCells = this.mergeCells(origCells, result.cells)
        winnerResult = this.checkWin(origCells, result.cells)
      }
      else {
        // result.cells.push({id: manCell, chip: (cell.chip == 'X' ? 'O' : 'X')})
        result.cells.push({id: manCell, info: `Клетка ${manCell} уже занята`})
        result.wait = false
        canBotStep = false
      }

      if (manCell==this.centerCellID) this.botIntellect += 4 // бот быстро смекает что центральная клетка выгодная

      dispatcher(result)

      if (winnerResult) {
        setTimeout(() => {
          this.dispatchFinish(winnerResult, dispatcher)
          this.botIntellect += 6 // бот учится на ошибках
        },50)
      }
      else if (canBotStep) setTimeout(() => {
        const fullResult = this.botStep(resultCells)

        const timeOut = Math.max(Math.floor(300 - this.botIntellect - Date.now() / 1000 + startStep), 100)

        setTimeout(() => {
          dispatcher(fullResult);
          setTimeout(() => {
            winnerResult = this.checkWin(resultCells, fullResult[0].cells)
            if (winnerResult) {
              this.dispatchFinish(winnerResult, dispatcher, `; IQ бота ${this.botIntellect}`)
              this.botIntellect -= 2 // головокружение от успеха
            }}, 20)
          }, timeOut)
        })
    }

    setTimeout(calcMotion)

    return true;
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

    const [winCell, checkedCells] = winnerResult

    let infoData = new InfoData()

    if (winCell === 'DRAW') { // ничья
      infoData.winner = '?'
      infoData.info = 'НИЧЬЯ ' + extInfo
      sendImpact.info = infoData
      dispatcher(sendImpact)

      --this.botIntellect // бот дает фору
      return
    }

    console.log('winnerResult',winnerResult)

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

  checkBotIQ(threshold) {
    return threshold < this.botIntellect || randomInt(0, threshold) < this.botIntellect
  }

  botStep(boardCells) {
    let result = {receiver: {kind: 'board'}, cells: false, wait: true}

    let freeCells = boardCells.filter(eachCell => (eachCell.chip == 'chip' || eachCell.chip == '*') && eachCell.brim == 'brim')

    if (freeCells.length > 3) shuffleArray(freeCells)

    // ищем свой выигрышный ход
    if (this.checkBotIQ(this.lowHumanIQ)) {
      for (let nCell of freeCells) {
        let tCells = this.boardChange(boardCells, [{...nCell, chip: this.botChip, info: `bot походил ${nCell.id}`, debug:'win'}])

        if (this.checkWin(boardCells, tCells)) {
          result.cells = tCells
          return [result, {receiver: {kind: 'board'}, wait: false}]
        }
      }
    }

    // ищем чужой выигрышный ход, если интеллекта хватает
    if (this.checkBotIQ(this.avgHumanIQ)) {
      for (let nCell of freeCells) {
        let tCells = this.boardChange(boardCells, [{...nCell, chip: this.userChip, info: `user походил ${nCell.id}`, debug: 'check'}])

        if (this.checkWin(boardCells, tCells)) {
          tCells[0].chip = this.botChip
          tCells[0].info = `bot походил ${nCell.id}`
          tCells[0].debug = 'contra'

          result.cells = this.boardChange(boardCells, [tCells[0]])

          return [result, {receiver: {kind: 'board'}, wait: false}]
        }
      }
    }

    if (freeCells.length) {
      result.cells = this.boardChange(boardCells, this._botStepFreeCells(boardCells, freeCells))
    }

    return [result, {receiver: {kind: 'board'}, wait: false}]
  }

  _botStepFreeCells(boardCells, freeCells) {

    if (freeCells.length > 1) ++this.botIntellect; // интеллект бота растет

    let newCell = null

    // здесь дополнительные проверки

    if (!newCell) {
      let iii = randomInt(0, freeCells.length-1)
      newCell = freeCells[iii]
    }

    if (newCell.id == this.centerCellID) --this.botIntellect // мягко наказываем бота за использование центральной клетки

    return [{id: newCell.id, chip: this.botChip, info: `bot походил ${newCell.id}`}]
  }

  /**
   * Возвращает массив измененных ячеек после применения newCells
   * newCells включен в результат
   * @param {Array} origCells
   * @param {Array} newCells
   * @returns {Array}
   */
  boardChange(origCells, newCells) {
    return newCells
  }
}