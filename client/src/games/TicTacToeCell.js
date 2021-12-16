import React, { useEffect } from "react"
import { Box } from "grommet"
import { observer } from "mobx-react-lite"
import { makeObservable, observable, runInAction, action } from "mobx"
import GameCell from "../models/GameCell"
import { useChatStore } from ".."

const starSymb = String.fromCharCode(0x2727)
const starCornCleaSymb = String.fromCharCode(0x2726)

const _clearCorners = ['21','14','45','52']

function CellShow({chip, brim, wait, chipId}) {

  let color = chip == 'O' ? 'blue' : (chip == 'X' ? 'green' : 'red')
  if (chip == 'chip') chip = "";

  if (wait) {color = 'gray'; chip='?'}

  if (chip == '*') {
    chip = _clearCorners.includes(chipId) ? starCornCleaSymb : starSymb;
  }

  return (
    <div style={{color: color, fontSize: "64px"}}>{chip}</div>
  )
}

const uniRender = observer ( ({cell}) => {

  const chatStore = useChatStore()

  const clickCell = () => {
      if (cell.brim == 'brim') cell.click()
    }

  useEffect(() => {
    if (cell.info) {
      chatStore.pushMessage(cell.info, cell.game.id)
      cell.info = null
    }
  },[cell.info])

  let winEffect = cell.brim == 'DRAW' ? 'accent-4' : (cell.effect == 'WIN' ? 'accent-1' : '')
  if (cell.brim == '.') winEffect = 'neutral-3'

  let border = 'all'
  if (cell.effect == 'hide') {
    border = false
    winEffect = 'dark-1'
    // winEffect = ''
  }
  return (
    <Box border={border} background={winEffect} align="center" justify="center" onClick={e => clickCell() }>
      <CellShow chipId={cell.id} chip={cell.chip} wait={cell.wait}/>
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

  _corners = ['11','55','15','51']

  actClear(impact) {
    super.actClear(impact)
    if (this.game.variety == 'tic-tac-boom') {
      let col = this.id.charAt(0), row=this.id.charAt(1)

      if (this._corners.includes(this.id)) {
        // this.brim = '.'
        // this.chip = 'chip'
      }
      else if (this.id == 33) { // || this._corners.includes(this.id)) {
        this.brim = '.'
        this.chip = 'chip'
        this.effect = 'hide'
      }
      else if (col == 1 || col == this.game.sizeBoard || row == 1 || row == this.game.sizeBoard) {
        this.brim = '.'
        this.chip = '*'
      }
    }
  }
}