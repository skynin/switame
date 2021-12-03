import { tempid } from '../utils/funcs'
import { action, makeObservable, observable, runInAction } from "mobx"

/*
Шаблон-пример ячейки
*/

export default class GameCell {

  id
  game
  chip
  brim
  wait = false
  info

  constructor(id, game, {brim='brim', chip='chip', wait=false} = {}) {
    this.id = id || tempid('c')
    this.game = game

    this.chip = chip
    this.brim = brim
    this.wait = wait
    this.effect = ""

    this.receivedCell = ['wait','chip','brim','info','effect']

    makeObservable(this, {
      id: observable,
      chip: observable,
      brim: observable,
      wait: observable,
      effect: observable,
      click: action
  })
  }

  receive(impact) {
    if (impact.id != this.id) {
      throw 'cell impact.id != this.id'
    }

    runInAction(()=> {
      this.wait = false

      for (let fld of this.receivedCell) {
        if (impact[fld] !== undefined)
          this[fld] = impact[fld]
      }
    })
  }

  click(beforeClick, afterClick) {
    if (this.game.wait) {
      console.log('click', 'game is waiting ' + this.id)
      return
    }

    if (this.wait) {
      console.log('click', 'blocked click ' + this.id)
      return
    }

    this.wait = true

    setTimeout(() => { // отпускаем поток UI
      if (beforeClick) beforeClick()
      this.game.receive({sender: this.DTO, act: 'click'})
      if (afterClick) afterClick()
    })
  }

  get DTO() {
    return {
      id: this.id,
      kind: 'cell',
      game: this.game.id,
      brim: this.brim,
      chip: this.chip,
      wait: this.wait,
    }
  }
}