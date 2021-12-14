export default class FastBoard {

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
