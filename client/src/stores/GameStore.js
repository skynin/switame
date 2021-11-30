import TicTacToe from "../games/TicTacToe"
import GameModel from "../models/GameModel"

export default class GameStore {

  games

  constructor() {
    this.games = new Map()
    this.addGame((new TicTacToe().initEmpty()), 'current')
    this.addGame((new GameModel().initEmpty()), 'second')
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