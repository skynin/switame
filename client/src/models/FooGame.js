import { randomInt } from '../utils/funcs';
import GameModel from './GameModel'
import GameCell from './GameCell';

export default class FooGame extends GameModel {

  constructor(id) {
    super(id)
  }

  initEmpty() {

    const arrBrim = [0x229E, 0x22A1].map(ch => String.fromCharCode(ch))
    const prefixCell = String.fromCharCode(0x25CC)
    const chip = String.fromCharCode(0x22C7)
    let bI = 0

    for (let iii=5; iii>0; --iii) {
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

    let gameCells = Object.values(game.cells);
    const sizeBoard = gameCells.length

    let currBot = 'F' // другой B, Foo vs Bar

    const arrStars = [0x2605, 0x2749, 0x2738, 0x2726].map(ch => String.fromCharCode(ch))
    const arrBrim = [0x2295, 0x2296, 0x2297, 0x2298, 0x2299].map(ch => String.fromCharCode(ch))

    function oneStep() {
      let cellRand = gameCells[randomInt(0, sizeBoard-1)]

      let chip = currBot + ' ' + arrStars[randomInt(0, arrStars.length-1)]

      let newCell = {id: cellRand.id, chip}
      if (randomInt(1,5) == 1) newCell.brim = currBot + ' ' + arrBrim[randomInt(0, arrBrim.length-1)]

      cellRand.receive(newCell)

      currBot = currBot == 'F' ? 'B' : 'F'

      setTimeout(oneStep, randomInt(999, 9999))
    }

    setTimeout(oneStep, 3000)

    return this;
  }
}