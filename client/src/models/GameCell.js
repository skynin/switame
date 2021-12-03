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

    makeObservable(this, {
      id: observable,
      chip: observable,
      brim: observable,
      wait: observable,
      click: action
  })
  }

  receive(impact) {
    if (impact.id != this.id) {
      throw 'cell impact.id != this.id'
    }

    runInAction(()=> {
      this.wait = false

      if (impact.wait) this.wait = impact.wait
      if (impact.chip) this.chip = impact.chip
      if (impact.brim) this.brim = impact.brim
      if (impact.info) this.info = impact.info
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