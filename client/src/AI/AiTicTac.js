import { isString, randomInt, shuffleArray } from "../utils/funcs"

export class InfoData {
  winner = '?'
  info = ''

  toString() {
    if (this.winner && this.winner != '?')
      return `Итог: ${this.winner} победили ${this.info}`

    return `Итог: ${this.info}`
  }
}

class FastBoard {

  constructor (cells, ai) {
    this.cells = cells

    this._last = this.clearLast()

    this._board = new Array(ai.boardEdge)
    for(let iii = this._board.length-1; iii >= 0; --iii) {
      this._board[iii] = new Array(ai.boardEdge)
    }

    cells.forEach(cell => {
      try {
        this._board[cell.id.charAt(0)-1][cell.id.charAt(1)-1] = cell
      } catch(ex) {
        console.error(cell)
        console.error(ai)
        console.error(this._board)
    }
    })
  }

  setVerifyCell(cell, saveLast = false) {
    if (saveLast) this._last[cell.id] = cell
    else {
      this._last = this.clearLast()
      this._last[cell.id] = cell
    }

    this._verifyCell = cell

    this._verifyCol = Number(cell.id.charAt(0))
    this._verifyRow = Number(cell.id.charAt(1))

    console.log('setVerifyCell', this._verifyCell, this._verifyCol, this._verifyRow)
  }

  /**
   *
   * @param {number} variedCol
   * @param {number} variedRow
   * @returns {boolean}
   */
  checkChipByVaried(variedCol, variedRow) {
    if (variedCol == 0 && variedRow == 0) return true // нет смещения, незачем проверять ту же ячейку

    const cell = this.getValByColRow(this._verifyCol + variedCol, this._verifyRow + variedRow)

    const result = cell ? cell.chip == this._verifyCell.chip : false

    if (result) {
      this._last[this._verifyCell.id] = this._verifyCell
      this._last[cell.id] = cell
    }

    return result
  }

  /**
   *
   * @param {number} column
   * @param {number} row
   * @param {(string|undefined)} attrCell
   * @returns
   */
  getValByColRow(column, row, attrCell) {
    let result = this._board?.[column-1]?.[row-1]
    console.log('getValByColRow', 'cX' + column, 'rY' + row, ' - ' + result?.chip)
    if (result) {
      return attrCell ? result[attrCell] : result
    }

    return result
  }

  clearLast() {
    this._last = Object.create(null)
    return this._last
  }

  /**
   * Проверенные ячейки, каждый вызов getValByColRow добавляет найденную ячейку
   * @returns {Array}
   */
  get lastCheckedCells() {
    return Object.values(this._last)
  }
}

export default class AiTicTac {

  // Люди с тяжелой формой умственной отсталости не поддаются обучению и воспитанию,
  // имеют уровень интеллектуального развития до 20 баллов. Они находятся под опекой других людей,
  // так как не могут о себе позаботиться, и живут в собственном мире. Таких людей в мире 0,2 %.
  botIntellect = 20
  boardEdge = 3

  maxHumanIQ = 144 // 0,2% людей
  avgHumanIQ = 90 // это средний уровень IQ

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

    console.group('checkWin');

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
      console.log('checkCell cDir', variedCol, variedRow)

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

    console.groupEnd();

    return winCell ? [winCell, checkedCells] : (resultCells.every(cell => cell.chip != 'chip') ? ['DRAW'] : false)
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

  botStep(boardCells) {
    console.log('botStep',boardCells)
  }
}