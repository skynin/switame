import { randomInt } from "../utils/funcs"
import AiTicTacBoom from './AiTicTacBoom'

export default class AiTicTacMoob extends AiTicTacBoom {

  constructor() {
    super()

    this.checkDirections = [[1,1],[-1,-1]] // только диагонали
    // this.botIntellect = 200

    this._relaionCells = {
      // 21: ['55'],
      31: ['34'],
      41: ['24'],

      12: ['44'],
      13: ['43'],
      // 14: ['51'],

      // 52: ['15'],
      53: ['23'],
      54: ['22'],

      25: ['42'],
      35: ['32'],
      // 45: ['11'],
    }

    this._clearedCells = {
      22: ['21','12'],
      23: ['13','33'],

      24: ['14','25'],
      34: ['35','33'],

      44: ['45','54'],
      43: ['53','33'],

      42: ['52','41'],
      32: ['31','33'],
    }
  }

  _opened = ['22','23','24','34','44','43','42','32']

  _botSquareStepFreeCells(freeCells) {
    let newCell = null

    if (this.checkBotIQ(this.maxHumanIQ)) { // умный бот ходит в открытые поля
      let cornerCells = freeCells.filter(fCell => this._opened.includes(fCell.id))
      let iii = randomInt(0, cornerCells.length-1)
      newCell = cornerCells[iii]
    }

    return newCell
  }
}