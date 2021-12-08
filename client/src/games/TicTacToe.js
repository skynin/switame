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

  constructor(id) {
    super(id)

    runInAction(() => {
      this.wait = true
    })
  }

  /**
   * Инициализует пустую игру
   * @returns {this}
   */
  initEmpty() {
    for (let col=1; col < 4; ++col) {
      for (let row=1; row < 4; ++row) {
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

    const areas = [1,2,3].map(eachColumn => {
      return [1,2,3].map((eachRow) => {
        return { name: '' + eachColumn + eachRow, start: [eachColumn-1, eachRow-1], end: [eachColumn-1, eachRow-1] }
      })
    }).flat()

    function createGridKey(key) {
      return '' + key.charAt(0) + key.charAt(1)
    }

    const arrCells = Object.entries(game.cells);

    return () => {

      return (
      <Grid
        rows={[rowSize, rowSize, rowSize]}
        columns={[columnSize, columnSize, columnSize]}
        gap="xxsmall"
        areas={areas}
      >
        {arrCells.map (([key, cell])=>{

          let GCell = cell.renderFunc()

          return <GCell key={key} gridArea={createGridKey(key)} cell={cell}/>
        })}
      </Grid>
      )
    }
  }
}