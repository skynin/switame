import { randomInt, shuffleArray, logBase } from "../utils/funcs"
import AiTicTac from './AiTicTac'

export default class AiTicTacBoom extends AiTicTac {

  constructor() {
    super()
    this.centerCellID = '33'
    this.boardEdge = 5
    // this.botIntellect = 200

    // this._checkDirections = [[1,1],[-1,-1]] // только диагонали
    this._checkDirections = [[0,1],[1,0]] // только прямые

    if (!this._invertRelaionCells) {
      this._invertRelaionCells = Object.create(null)

      Object.entries(this._relaionCells).forEach(([id, rels]) => {
        for (let rr of rels) {
          this._invertRelaionCells[rr] = id
        }
      })
    }
  }

  _oneLevelFreeCells = {board: [], idx: {}}
  _deepMind(boardCells, freeCells, deepLimit = 1) {

    if (deepLimit && deepLimit > logBase(this.botIntellect, 8)) return null; // 8 для 20 1.441

    // восстанавливаем/сохраняем начальные пустые
    if (deepLimit <= 1) {
        this._oneLevelFreeCells.board = boardCells
        this._oneLevelFreeCells.idx = {}
        for (let fCell of freeCells) {
          this._oneLevelFreeCells.idx[fCell.id] = fCell
        }
    }

    let savedVarSteps = []

    for (let nCell of freeCells) {
      let userC = {...nCell, chip: this.userChip, info: `user походил ${nCell.id}`, debug: `check ${deepLimit}`}
      let tCells = this.boardChange(boardCells, userC)
      savedVarSteps.push(tCells)

      const winStep = this.checkWin(boardCells, tCells)

      if (deepLimit <= 1) { // глубже проверяем реальный ход юзера см TODO: ниже
        userC.chip = this.botChip
        userC.info = `bot походил ${nCell.id}`
        userC.debug = 'contra'
      }

      if (winStep) return tCells
    }

    // console.log('_deepMind', deepLimit)

    // запускаем поиск глубже
    for (let botVarStep of savedVarSteps) {
      let deepBoard = this.mergeCells(boardCells, botVarStep)
      let botDeepFree = this.filterFreeCells(deepBoard)

      let botCell = botVarStep[0]

      let userWin = this._deepMind(deepBoard, botDeepFree, deepLimit+1)
      if (userWin) continue;

      // можно ходить, но проверяем на возможность
      if (!this._oneLevelFreeCells.idx[botCell.id]) continue;

      // TODO: для полноценного спуска вглубь надо вызвать _deepMind() с новым параметром - whichStep
      // Сейчас, по реализации, только проверка на безопасный ход
      // чтобы не открыть клетку, которая станет победой противника

      botCell.chip = this.botChip
      botCell.info = `bot походил ${botCell.id}`
      botCell.debug = 'deep'+deepLimit

      // console.log(this._oneLevelFreeCells.orig, botVarStep)

      return this.boardChange(this._oneLevelFreeCells.board, botCell)
    }

    return null
  }

  _corners = ['11','55','15','51']

  _relaionCells = {
    22: ['35'],
    24: ['53'],
    44: ['31'],
    42: ['13'],

    23: ['52','54'],
    34: ['21','41'],
    43: ['12','14'],
    32: ['25','45'],
  }

  _clearedCells = {
    25: '24',
    35: '34',
    45: '55',

    12: '22',
    13: '23',
    14: '15',

    21: '11',
    31: '32',
    41: '42',

    52: '51',
    53: '43',
    54: '44',
  }

  boardChange(origCells, newCells) {

    newCells = Array.isArray(newCells) ? [...newCells] : [newCells]

    const newCell = newCells[0]

    const getCellById = function (sId) {
      if (this.cells[sId]) return this.cells[sId];

      let result = origCells.find(cell => cell.id == sId)
      // if (!result) result = {...newCell, id: sId, chip: '?', brim: '?', info: 'getCellById'}
      this.cells[result.id] = result
      return result
    }.bind({cells: Object.create(null)})

    let invId = this._clearedCells[newCell.id]
    if (invId && getCellById(invId).chip != newCell.chip) {
      // let ccc = {...newCell, id: invId, chip: 'chip', brim: (getCellById(invId).chip == 'chip' ? '.' : 'brim'), info: `стерта ${invId}`}
      let ccc = {...newCell, id: invId, chip: 'chip', brim: 'brim', info: `стерта ${invId}`}
      newCells.push(ccc)
      if (this._corners.includes(ccc.id) && getCellById(ccc.id).brim == '.') {
        ccc.brim = 'brim'
        ccc.info = `открыта ${ccc.id}`
      }
    }

    const checkCells = this._relaionCells[newCell.id] || []

    for (let cheC of checkCells) {
      const sCell = getCellById(cheC)

      // console.log('boardChange', newCell, origCells)

      if (sCell.brim == '.') {
        newCells.push({...sCell, chip: '*', brim: 'brim', info: `открылась ${sCell.id}`})
      }
    }

    return newCells
  }

  _botStepFreeCells(boardCells, freeCells) {

    let newCell = null

    // пробуем закрыть фишки противника
    if (this.checkBotIQ(this.avgHumanIQ)) {
      const reducer = (cou, el) => (el.chip == this.userChip ? 1 : 0) + cou
      let countOppo = boardCells.reduce(reducer, 0)

      for (let nCell of freeCells) {
        let candidatCell = {...nCell, chip: this.botChip, info: `bot походил ${nCell.id}`, debug:'beat'}
        const tCount = this.mergeCells(boardCells, this.boardChange(boardCells, candidatCell)).reduce(reducer, 0)
        if (tCount < countOppo) {
          return [candidatCell]
        }
      }
    }

    if (this.checkBotIQ(this.maxHumanIQ)) { // умный бот ходит в угол или в центр
      let cornerCells = freeCells.filter(fCell => this._corners.includes(fCell.id))
      let iii = randomInt(0, cornerCells.length-1)
      newCell = cornerCells[iii]
    }

    if (!newCell) {
      let iii = randomInt(0, freeCells.length-1)
      newCell = freeCells[iii]
    }

    return [{id: newCell.id, chip: this.botChip, info: `bot походил ${newCell.id}`, debug: 'rand'}]
  }
}