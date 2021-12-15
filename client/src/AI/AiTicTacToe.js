import { isString, randomInt, shuffleArray } from "../utils/funcs"
import AiTicTac, {InfoData} from "./AiTicTac"

export default class AiTicTacToe extends AiTicTac {

  // winnerLines

  constructor() {
    super()
  }

  DELETEcheckWin(origCells, newCells) {
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

  // ход бота, случайный выбор
  _botStepFreeCells(boardCells, freeCells) {

    if (freeCells.length > 1) ++this.botIntellect; // интеллект бота растет

    let newCell = null
    let winnerCell = freeCells.find(cell => cell.id == this.centerCellID)

    if (winnerCell && this.checkBotIQ(this.avgHumanIQ)) { // смышленый бот пробует использовать центр
      newCell = winnerCell
    }
    else if (this.checkBotIQ(this.maxHumanIQ)) { // умный бот ходит в угол или в центр
      let cornerCells = freeCells.filter(fCell => ['11','13','31','33',this.centerCellID].includes(fCell.id))
      let iii = randomInt(0, cornerCells.length-1)
      newCell = cornerCells[iii]
    }

    if (!newCell) {
      let iii = randomInt(0, freeCells.length-1)
      newCell = freeCells[iii]
    }

    if (newCell.id == this.centerCellID) --this.botIntellect // мягко наказываем бота за использование центральной клетки

    return [{id: newCell.id, chip: this.botChip, info: `bot походил ${newCell.id}`}]
  }
}