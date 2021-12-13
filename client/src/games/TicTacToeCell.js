import React, { useEffect } from "react"
import { Box } from "grommet"
import { observer } from "mobx-react-lite"
import { makeObservable, observable, runInAction, action } from "mobx"
import GameCell from "../models/GameCell"
import { useChatStore } from ".."

function CellShow({chip, brim, wait}) {

  if (chip == 'chip') chip = ""

  let color = chip == 'O' ? 'red' : 'green'
  if (wait) {color = 'gray'; chip='?'}
  return (
    <div style={{color: color, fontSize: "64px"}}>{chip}</div>
  )
}

const uniRender = observer ( ({cell}) => {

  const chatStore = useChatStore()

  const clickCell = () => {
      cell.click()
    }

  useEffect(() => {
    if (cell.info) {
      chatStore.pushMessage(cell.info, cell.game.id)
      cell.info = null
    }
  },[cell.info])

  let winEffect = cell.effect == 'WIN' ? 'accent-1' : ''

  return (
    <Box border="all" background={winEffect} align="center" justify="center" onClick={e => clickCell() }>
      {cell.id}
      <CellShow chip={cell.chip} wait={cell.wait}/>
    </Box>
  )
})

export default class TicTacToeCell extends GameCell {

  constructor(id, game, args) {
    super(id, game, args)
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