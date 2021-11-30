import { tempid } from '../utils/funcs'
import { makeObservable, observable, runInAction } from "mobx"

/*
Шаблон-пример ячейки
*/

export default class GameCell {

  id
  game
  chip
  brim

  constructor(id, game, args) {
    this.id = id || tempid('c')
    this.game = game

    let {brim, chip} = args || {brim: 'brim', chip: 'chip'}

    this.chip = chip
    this.brim = brim

    makeObservable(this, {
      id: observable,
      chip: observable,
      brim: observable
  })
  }

  emptyBoard() {
    return 'emptyCell ' + this.id
  }
}