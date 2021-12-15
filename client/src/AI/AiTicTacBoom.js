import { randomInt, shuffleArray } from "../utils/funcs"
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

  _corners = ['11','55','15','51']
  _DDDrelaionCells = {
    22: ['54', '45'],
    24: ['41', '52'],
    44: ['21', '12'],
    42: ['14', '25'],
    23: ['53'],
    34: ['31'],
    43: ['13'],
    32: ['35'],
  }

  _relaionCells = {
    22: ['21', '12'],
    24: ['14', '25'],
    44: ['54', '45'],
    42: ['41', '52'],
    23: ['13'],
    34: ['35'],
    43: ['53'],
    32: ['31'],
  }

  _DDDinvertRelaionCells = null

  _invertRelaionCells = {
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

  _clearedCells = {
    12: ['23'],
    14: ['23'],

    25: ['34'],
    45: ['34'],

    54: ['43'],
    52: ['43'],

    21: ['32'],
    41: ['32'],

    31: ['22', '42'],
    53: ['42', '44'],
    35: ['24', '44'],
    13: ['22', '24'],
  }

  /* _clearedCells = {
    12: [22, 23],
    14: [23, 24],

    25: [24, 34],
    45: [34, 44],

    54: [43, 44],
    52: [42, 43],

    21: [22, 32],
    41: [32, 42],

    31: [22, 32, 42],
    53: [42, 43, 44],
    35: [24, 34, 44],
    13: [22, 23, 24],
  } */

  boardChange(origCells, newCells) {
    newCells = [...newCells]

    const newCell = newCells[0]

    const getCellById = function (sId) {
      if (this.cells[sId]) return this.cells[sId];

      let result = origCells.find(cell => cell.id == sId)
      // if (!result) result = {...newCell, id: sId, chip: '?', brim: '?', info: 'getCellById'}
      this.cells[result.id] = result
      return result
    }.bind({cells: Object.create(null)})

    // проверяем центральную клетку, пустая - открываем углы
    // const centerCell = origCells.find(c => c.id == this.centerCellID)
    if (newCell.id == this.centerCellID) {
      for(let corner of this._corners) {
        newCells.push({...newCell, id: corner, chip: 'chip', brim: 'brim', info: `открылась ${newCell.id}`})
      }
    }
    // проверяем центральную клетку, если надо - закрываем
    /*else if (this._corners.includes(newCell.id) && centerCell.brim != '.') {
      newCells.push({...centerCell, chip: 'chip', brim: '.', info: `закрылась ${centerCell.id}`})
      for(let corner of this._corners) {
        if (newCell.id == corner) continue;

        newCells.push({...newCell, id: corner, chip: 'chip', brim: 'brim', info: `обычная ${corner}`})
      }
    }*
    /*else if (this._corners.includes(newCell.id) && centerCell?.chip == newCell.chip) { // проверяем центральную клетку, если надо - закрываем
      newCells.push({...centerCell, chip: 'chip', brim: '.', info: `закрылась ${centerCell.id}`})
    }*/
    else {
      let invId = this._invertRelaionCells[newCell.id]
      if (invId && getCellById(invId).chip != newCell.chip) {
        newCells.push({...newCell, id: invId, chip: 'chip', brim: (getCellById(invId).chip == 'chip' ? '.' : 'brim'), info: `стерта ${invId}`})
        // newCells.push({...newCell, id: invId, chip: 'chip', brim: '.', info: `стерта ${invId}`})
      }
      // вторая, если есть, становится обычной, первая уже стерла
      // 54: 22, 45: 22
      /*Object.entries(this._invertRelaionCells)
        .filter(([masterCell, slaveCell]) => slaveCell == invId)
        .forEach(([masterCell, slaveCell])=> {
          if (masterCell != newCell.id && getCellById(masterCell).chip == '*')
          newCells.push({...newCell, id: masterCell, chip: 'chip', brim: 'brim', info: `обычная ${masterCell}`})
        })*/

      const checkCells = this._relaionCells[newCell.id] || []

      for (let cheC of checkCells) {
        const sCell = getCellById(cheC)

        // console.log('boardChange', newCell, origCells)

        if (sCell.brim == '.') {
          newCells.push({...sCell, chip: '*', brim: 'brim', info: `открылась ${sCell.id}`})
        }
      }
    }

    // стрираем при открытии
    /*newCells.filter(c => c.chip == '*').forEach(el => {
      const checkCells = this._clearedCells[el.id] || []

      for (let cheC of checkCells) {

        // сносим чужие и камни
        // const sCell = origCells.find(oc => oc.id == cheC && oc.chip != newCell.chip)

        // сносим только чужие, камни сохраняем
        const sCell = origCells.find(oc => oc.id == cheC && oc.brim != '.' && oc.chip != newCell.chip)

        // сносим всех
        // const sCell = origCells.find(oc => oc.id == cheC && oc.brim != '.')
        if (sCell) newCells.push({...sCell, chip: 'chip', brim: 'brim', info: `стерта ${sCell.id}`})
      }
    })*/

    return newCells
  }

  _botStepFreeCells(boardCells, freeCells) {

    let newCell = null

    // пробуем закрыть фишки противника
    if (this.checkBotIQ(this.lowHumanIQ)) {
      const reducer = (cou, el) => (el.chip == this.userChip ? 1 : 0) + cou
      let countOppo = boardCells.reduce(reducer, 0)

      for (let nCell of freeCells) {
        let candidatCell = {...nCell, chip: this.botChip, info: `bot походил ${nCell.id}`, debug:'beat'}
        const tCount = this.mergeCells(boardCells, this.boardChange(boardCells, [candidatCell])).reduce(reducer, 0)
        if (tCount < countOppo) {
          return [candidatCell]
        }
      }
    }

    if (!newCell) {
      let iii = randomInt(0, freeCells.length-1)
      newCell = freeCells[iii]
    }

    return [{id: newCell.id, chip: this.botChip, info: `bot походил ${newCell.id}`, debug: 'rand'}]
  }

  DEBUGboardChange(origCells, newCells) {

    newCells = [...newCells]

    if (newCells[0].chip != 'X') return newCells

    origCells = shuffleArray(origCells, true) // DEBUG

    let chCell = origCells.find(c => c.brim == '.' && !newCells.some(nc => nc.id == c.id))

    if (chCell) newCells.push({...chCell, brim: 'brim', info: `Измененная ${chCell.id}`})

    console.log('boardChange', newCells)

    return newCells
  }
}