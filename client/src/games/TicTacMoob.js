import TicTacBoom from './TicTacBoom'

export default class TicTacMoob  extends TicTacBoom {

  constructor(id) {
    super(id)

    this.variety = 'tic-tac-moob'
    this.displayName = 'TicTacMoob'
  }
}