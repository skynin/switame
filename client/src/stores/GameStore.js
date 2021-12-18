import TicTacToe from "../games/TicTacToe"
import FooGame from "../models/FooGame"
import TicTacBoom from "../games/TicTacBoom"
import TicTacMoob from "../games/TicTacMoob"
import { makeObservable, action, computed } from "mobx"

export default class GameStore {

  games

  constructor() {
    this.games = new Map()
    this.addGame(new TicTacToe().initEmpty())
    this.addGame(new TicTacBoom().initEmpty())
    this.addGame(new TicTacMoob().initEmpty())

    makeObservable(this, {
      activedGames: computed,
      secondGame: computed,
      addGame: action,
    })
  }

  getById(gameID) {
    return Array.from(this.games).find(
      ([gmid, gm]) => gmid == gameID || gm.id == gameID || gm.displayName == gameID)?.[1]
  }

  get activedGames() {
    return Array.from(this.games).filter(([gmid, gm]) => gmid != 'second' && gm.status.id != 'ready')
      .map(([gmid, gm]) => gm)
  }

  get secondGame() {
    let result = this.games.get('second')
    if (result) return result

    this.addGame(new FooGame().initEmpty().startAutoPlay(), 'second')

    return this.games.get('second')
  }

  addGame(game, name) {
    this.games.set(name || game.id, game)
  }
}