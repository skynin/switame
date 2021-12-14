import TicTacToe from "../games/TicTacToe"
import GameModel from "../models/GameModel"
import FooGame from "../models/FooGame"
import TicTacBoom from "../games/TicTacBoom"

export default class GameStore {

  games

  constructor() {
    this.games = new Map()
    // this.addGame(new TicTacToe().initEmpty(), 'current')
    this.addGame(new TicTacBoom().initEmpty(), 'current')
    this.addGame(new FooGame().initEmpty().startAutoPlay(), 'second')
  }

  get currGame() {
    return this.games.get('current')
  }
  get secondGame() {
    return this.games.get('second')
  }

  addGame(game, name) {
    this.games.set(name || game.id, game)
  }
}