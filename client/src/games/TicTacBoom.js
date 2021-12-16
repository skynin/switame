import TicTacToe from './TicTacToe'
import TicTacToeCell from './TicTacToeCell'

export default class TicTacBoom extends TicTacToe {

  constructor(id) {
    super(id)

    this.variety = 'tic-tac-boom'
    this.sizeBoard = 5

    this.displayName = 'TicTacBoom'
  }
}