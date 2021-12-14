import { isString, randomInt, shuffleArray } from "../utils/funcs"
import AiTicTac from './AiTicTac'

export default class AiTicTacBoom extends AiTicTac {

  constructor() {
    super()
    this.centerCellID = '33'
    this.boardEdge = 5
  }

  boardChange(origCells, newCells) {
    newCells = [...newCells]

    origCells = shuffleArray(origCells, true) // DEBUG

    let chCell = origCells.find(c => c.chip == 'chip' && !newCells.some(nc => nc.id == c.id))

    if (chCell) newCells.push({...chCell, chip: '.', info: `Измененная ${chCell.id}`})

    console.log('boardChange', newCells)

    return newCells
  }
}