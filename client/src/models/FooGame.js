import { randomInt } from '../utils/funcs';
import GameModel from './GameModel'
import GameCell from './GameCell';
import { runInAction } from 'mobx';
import { observer } from "mobx-react-lite"
import { Box } from "grommet"

export default class FooGame extends GameModel {

  constructor(id) {
    super(id)
  }

  initEmpty() {

    const arrBrim = [0x229E, 0x22A1].map(ch => String.fromCharCode(ch))
    const prefixCell = String.fromCharCode(0x25CC)
    const chip = String.fromCharCode(0x22C7)
    let bI = 0

    for (let iii=7; iii>0; --iii) {
      let tCell = new GameCell(prefixCell+iii, this, {
        chip,
        brim: arrBrim[bI]})
      this.cells[tCell.id] = tCell

      bI = bI ^ 1
    }

    return this
  }

  startAutoPlay() {
    const game = this;

    runInAction(() => {game.status = '...'})

    let gameCells = Object.values(game.cells);
    const sizeBoard = gameCells.length

    let currBot = 'F' // другой B, Foo vs Bar

    const arrStars = [0x2605, 0x2726, 0x2735, 0x2738, 0x2749].map(ch => String.fromCharCode(ch))
    const arrBrim = [0x2295, 0x2296, 0x2297, 0x2298, 0x2299].map(ch => String.fromCharCode(ch))
    const joker = String.fromCharCode(0x229B)

    let starLength = arrStars.length-1, count = 1

    let lastCell = gameCells[0];

    function isFillArea() {
      return gameCells.filter(b => b.brim.length < 3).length == 0
    }

    function oneStep() {

      lastCell.receive({id: lastCell.id, effect: '' })

      let cellRand = gameCells[randomInt(0, sizeBoard-1)]
      lastCell = cellRand

      let chip = '???'
      do {
        chip = currBot + ' ' + arrStars[randomInt(0, starLength)]
      } while (chip == cellRand.chip)

      let newCell = {id: cellRand.id, chip, effect: 'last' }
      if (randomInt(1,sizeBoard) == 1) newCell.brim = currBot + ' ' + arrBrim[randomInt(0, arrBrim.length-1)]
      else if (cellRand.brim.charAt(0) == currBot // свое поле
        && cellRand.chip.charAt(0) != currBot // чужая фишка
        && cellRand.chip.charAt(2) != chip.charAt(2) // иной ранг фишки
        && isFillArea() // все поля заняты?
        ) {
          newCell.chip = joker; newCell.brim = cellRand.chip + ':' + cellRand.brim
        }

      cellRand.receive(newCell)

      if (newCell.chip == joker) {
        runInAction(() => {game.status = `${chip} : WINNER ${count}`})
        return
      }

      currBot = currBot == 'F' ? 'B' : 'F'
      ++count;

      runInAction(() => {game.status = `... ${currBot} ${count}`})

      setTimeout(oneStep, randomInt(999, 9999))
    }

    setTimeout(oneStep, 3000)

    return this;
  }

  GameCell() {
    return observer( ({cell}) => {

      const chip = cell.chip == 'chip' ? '.' : cell.chip
      const brim = cell.brim == 'brim' ? '.' : cell.brim

      return (
        <Box border={cell.effect && cell.effect.indexOf('last') >= 0 ? 'all' : false}>
          {cell.id} : {chip} - {brim}
        </Box>
      )
    })
  }
}