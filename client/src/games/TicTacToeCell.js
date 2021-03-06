import React, { useEffect } from "react"
import { Box } from "grommet"
import { observer } from "mobx-react-lite"
import GameCell from "../models/GameCell"
import { useChatStore } from ".."

const starSymb = String.fromCharCode(0x2727)
const starCornCleaSymb = String.fromCharCode(0x2726)

const _clearCorners = ['21','14','45','52']
const _clearDouble = ['23','34','43','32']
const _corners = ['11','15','51','55']
const _none = ['21','14','52','45']

function CellShow({chip, brim, wait, cell}) {

  // https://www.w3schools.com/colors/colors_names.asp
  let color = chip == 'O' ? 'blue' : (chip == 'X' ? 'green' : 'PeachPuff')
  if (chip == 'chip') chip = "";

  if (wait) {color = 'gray'; chip='?'}

  let {fontSize} = cell.game.optionsCell

  return (
    <div style={{color, fontSize}}>{chip}</div>
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

  let winEffect = ''
  let border = 'all'
  if (cell.effect == 'hide') {
    border = false
    winEffect = 'dark-3'
  }
  else if (cell.effect == 'none') {
    winEffect = 'light-4'
  }

  winEffect = cell.brim == 'DRAW' ? 'accent-4' : (cell.effect == 'WIN' ? 'accent-1' : winEffect)
  if (cell.brim == '.') winEffect = 'neutral-3'

  let showChip = cell.chip
  if (cell.symb && (showChip == 'chip' || showChip == '*')) {
    showChip = cell.symb
  }

  // <Box width="xxsmall" height="xxsmall" gap="xxsmall" border={border} background={winEffect} align="center" justify="center" onClick={e => clickCell() }>

  // {cell.id}
  return (
    <Box border={border} background={winEffect} align="center" justify="center" onClick={e => clickCell() }>
      <CellShow cell={cell} chip={showChip} wait={cell.wait}/>
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

      if (this._corners.includes(this.id)) return;

      let col = this.id.charAt(0), row=this.id.charAt(1)

      if (this.id == 33) {
        this.brim = '.'
        this.chip = 'chip'
        this.effect = 'hide'
      }
      else if (col == 1 || col == this.game.sizeBoard || row == 1 || row == this.game.sizeBoard) {
        this.brim = '.'
        this.chip = '*'
        this.symb = _clearCorners.includes(this.id) ? starCornCleaSymb : starSymb
      }
    }
    else if (this.game.variety == 'tic-tac-moob') {
      let col = this.id.charAt(0), row=this.id.charAt(1)

      if (this.id == 33) {
        this.brim = '.'
        this.chip = 'chip'
        this.effect = 'hide'
      }
      else if (_none.includes(this.id)) {
        this.effect = 'none'
      }
      else if (_corners.includes(this.id)) {
        this.brim = '.'
        this.chip = 'chip'
        this.effect = 'hide'
      }
      else if (col != 1 && row != 1 && col != this.game.sizeBoard && row != this.game.sizeBoard) {
        this.brim = '.'
        this.chip = '*'
        this.symb = starSymb
      }
    }
  }
}