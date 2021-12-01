import React from "react"
import { Box } from "grommet"
import { observer } from "mobx-react-lite"
import { makeObservable, observable, runInAction, action } from "mobx"
import GameCell from "../models/GameCell"
import { useChatStore } from ".."

function CellShow({chip, brim}) {
  const color = chip == 'O' ? 'red' : 'green'
  return (
    <div style={{color: color, fontSize: "64px"}}>{chip}</div>
  )
}

const uniRender = observer ( ({cell}) => {

  const chatStore = useChatStore()

  function clickCell(cell) {
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);

    chatStore.pushMessage('click '+ today.toISOString(), cell.game.id)
    cell.click()
  }

  return (
    <Box border="all" align="center" justify="center" onClick={e => clickCell(cell) }>
      {cell.chip != 'chip' && <CellShow chip={cell.chip} /> }
    </Box>
  )
})

export default class TicTacToeCell extends GameCell {

  constructor(id, game, args) {
    super(id, game, args)
  }

  click() {
    runInAction(()=>{
      // console.log(this.chip)
      this.chip = this.chip == 'O' ? 'X' : 'O'
    })
  }

  /**
   *
   * @param {Object} args
   * @returns {function}
   */
  renderFunc(args) {
    return uniRender
  }
}