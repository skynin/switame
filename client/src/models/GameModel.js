import { tempid } from '../utils/funcs'
import { Box } from "grommet"
import GameCell from './GameCell'

/*
Шаблон-демо модели

Компоненты для отображения игры содержаться в модели игры
В общем случае - каждая игра имеет ункальные элементы отображения, и одинакова только схема отображения:
Тулбар, заголовок
Игровая доска
Подвал, информация

И режим отображения игры в левой панели
*/

export default class GameModel {

  id
  cells

  constructor(id) {
    this.id = id || tempid('g')

    this.cells = new Map()
  }

  // * * * Public

  /**
   Общий блок игрового пространства.
   остальные методы рекомендательные
 @public
 @param {string} args - параметры постороения игрового пространства big|view
 */
 GameArea(args) {
  let game = this

  const GBoard = game.GameBoard(args)
  const GameBoardHead = game.GameBoardHead(args)
  const GameBoardFooter = game.GameBoardFooter(args)

  return () => {
    return (
      <Box>
        <GameBoardHead/>
        <GBoard />
        <GameBoardFooter />
      </Box>
    )
  }
}

  /**
  * Инициализует пустую игру
  * @returns {this}
  */
  initEmpty() {
    for (let iii=5; iii>0; --iii) {
      let tCell = new GameCell(null, this)
      this.cells.set(tCell.id, tCell)
    }

    return this
  }

  emptyBoard() {
    return 'emptyBoard ' + this.id
  }

  // *** React function components

  /** @protected */
  GameBoardHead(args) {
    if (args != 'big') return () => {return (<div></div>)}

    return () => {
      return (
        <Box>Tool Bar GArea</Box>
      )
    }
  }

  /** @protected */
  GameCell() {
    return ({cell}) => {
      return (
        <Box>
          {cell.id} : {cell.chip} - {cell.brim}
        </Box>
      )
    }
  }

  /** @protected */
  GameBoard(args) {
    let game = this

    const GCell = game.GameCell()

    return () => {
      return (
        <Box>
          Board Area
          {Array.from(game.cells).map(([cellID, cell]) =>
            <GCell key={cellID} cell={cell}/>
          )}
        </Box>
      )
    }
  }

  /** @protected */
  GameBoardFooter(args) {
    if (args != 'big') return () => {return (<div></div>)}

    return () => {
      return (
        <Box>Footer GArea</Box>
      )
    }
  }
}