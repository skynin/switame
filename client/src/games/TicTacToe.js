import { Box, Grid, Button } from "grommet"
import TicTacToeCell from "./TicTacToeCell"
import { tempid } from "../utils/funcs"
import GameModel from "../models/GameModel"
import UserAvatar from "../components/UserAvatar"
import { observer } from "mobx-react-lite"
import { runInAction } from "mobx"
import { useEffect } from "react"
import { useChatStore } from ".."

export default class TicTacToe extends GameModel {

  sizeBoard = 3

  constructor(id) {
    super(id)

    runInAction(() => {
      this.wait = true
    })

    this.variety = 'tic-tac-toe'
  }

  /**
   * Инициализует пустую игру
   * @returns {this}
   */
  initEmpty() {
    for (let col=1; col <= this.sizeBoard; ++col) {
      for (let row=1; row <= this.sizeBoard; ++row) {
        let tCell = new TicTacToeCell(''+col+row, this)
        this.cells[tCell.id] = tCell
      }
    }

    return this
  }

  // *** React components

  /**
   * Ячейки доски нумеруются - колонка строка
   * 23 - вторая колонка, третья строка
   * @param {string} args
   * @returns
   */
  GameBoard(args) {
    const game = this

    const rowSize = 'xsmall';
    const columnSize = 'xsmall';

    let arrFill = []
    for (let iii=1; iii <= this.sizeBoard; ++iii) {
      arrFill.push(iii)
    }

    const areas = arrFill.map(eachColumn => {
      return arrFill.map((eachRow) => {
        return { name: '' + eachColumn + eachRow, start: [eachColumn-1, eachRow-1], end: [eachColumn-1, eachRow-1] }
      })
    }).flat()

    console.log('areas',areas)

    function createGridKey(key) {
      return '' + key.charAt(0) + key.charAt(1)
    }

    const arrCells = Object.entries(game.cells);

    return () => {

      return (
      <Grid
        rows={arrFill.fill(rowSize)}
        columns={arrFill.fill(columnSize)}
        gap="xxsmall"
        areas={areas}
      >
        {arrCells.map(([key, cell]) => {

          let GCell = cell.renderFunc()

          return <GCell key={key} gridArea={createGridKey(key)} cell={cell}/>
        })}
      </Grid>
      )
    }
  }
}