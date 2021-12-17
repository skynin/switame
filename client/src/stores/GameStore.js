import TicTacToe from "../games/TicTacToe"
import GameModel from "../models/GameModel"
import FooGame from "../models/FooGame"
import TicTacBoom from "../games/TicTacBoom"
import TicTacMoob from "../games/TicTacMoob"

export default class GameStore {

  games

  constructor() {
    this.games = new Map()
    this.addGame(new TicTacToe().initEmpty())
    this.addGame(new TicTacBoom().initEmpty())
    this.addGame(new TicTacMoob().initEmpty())

    this.addGame(new FooGame().initEmpty().startAutoPlay(), 'second')
  }

  getById(gameID) {
    return Array.from(this.games).find(
      ([gmid, gm]) => gmid == gameID || gm.id == gameID || gm.displayName == gameID)?.[1]
  }

/* DELETE get currGame() {
    return this.games.get('current')
  }*/
  get secondGame() {
    return this.games.get('second')
  }

  addGame(game, name) {
    this.games.set(name || game.id, game)
  }
}