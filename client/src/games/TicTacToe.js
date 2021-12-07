import { Box, Grid, Button } from "grommet"
import TicTacToeCell from "./TicTacToeCell"
import { tempid } from "../utils/funcs"
import GameModel from "../models/GameModel"
import UserAvatar from "../components/UserAvatar"
import { observer } from "mobx-react-lite"
import { runInAction } from "mobx"
import { useEffect } from "react"
import { useChatStore } from ".."

const UserPlay = ({user}) => {
  return (
    <div>
      <UserAvatar user={user} mode="game-board"/>
    </div>
  )
}

const delete_ButtonPlay = observer(({game}) => {

  function click() {
    game.statusNext()
  }

  const chatStore = useChatStore()

  useEffect(() => {
    if (game.info) {
      chatStore.pushMessage(game.info, game.id)
      game.info = null
    }
  })

  return (
    <Button margin="small" hoverIndicator={true} pad="xsmall" onClick={e => click()} label={game.statusNextName}/>
  )
})

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

  delete_GameBoardHead(args) {
    const game = this

    return observer(() => {
    return (
      <div>
        <Box direction="row">
          <UserPlay user={game.userTop}/>&nbsp;
          <UserPlay user={game.userBottom}/>
        </Box>
        <Box direction="row"><ButtonPlay game={game}/></Box>
      </div>
    )})
  }

  delete_GameBoardFooter(args) {
    const game = this

    return observer(() => {

    const gameStatus = game.statusLine != 'none' ? game.status : 'Инфа о ходе игры'

    return (
      <div>
        <Box>{gameStatus}</Box>
      </div>
    )})
  }

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