import { isString, randomInt, shuffleArray } from "../utils/funcs"
import AiTicTac, {InfoData} from "./AiTicTac"

export default class AiTicTacToe extends AiTicTac {

  // winnerLines

  constructor() {
    super()
  }

  thinkIt(impact, dispatcher) {

    if (super.thinkIt(impact, dispatcher)) return true;

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

      if (manCell==this.centerCellID) this.botIntellect += 4 // бот быстро смекает что центральная клетка выгодная

      dispatcher(result)

      if (winnerResult) {
        this.dispatchFinish(winnerResult, dispatcher)
        this.botIntellect += 6 // бот учится на ошибках
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

    return true;
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
    if (this.botIntellect > this.avgHumanIQ || randomInt(51,this.avgHumanIQ) < this.botIntellect) {
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
      if (freeCells.length > 1) ++this.botIntellect; // интеллект бота растет

      let newCell = null
      let winnerCell = freeCells.find(cell => cell.id == this.centerCellID)

      if (winnerCell && randomInt(0,this.avgHumanIQ) < this.botIntellect) { // смышленый бот пробует использовать центр
        newCell = winnerCell
      }
      else if (randomInt(0,this.maxHumanIQ) < this.botIntellect) { // умный бот ходит в угол или в центр
        let cornerCells = freeCells.filter(fCell => ['11','13','31','33',this.centerCellID].includes(fCell.id))
        let iii = randomInt(0, cornerCells.length-1)
        newCell = cornerCells[iii]
      }

      if (!newCell) {
        let iii = randomInt(0, freeCells.length-1)
        newCell = freeCells[iii]
      }

      if (newCell.id == this.centerCellID) --this.botIntellect // мягко наказываем бота за использование центральной клетки

      result.cells = [{id: newCell.id, chip: this.botChip, info: `bot походил ${newCell.id}`}]
    }

    return [result, {receiver: {kind: 'board'}, wait: false}]
  }
}