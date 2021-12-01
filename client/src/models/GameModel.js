import { tempid } from '../utils/funcs'
import { Box } from "grommet"
import GameCell from './GameCell'
import UserModel from './UserModel'
import { observer } from "mobx-react-lite"
import { makeObservable, observable, runInAction, action, computed } from "mobx"

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

  status = 'none' // play, pause, finish

  userTop
  userBottom

  constructor(id) {
    this.id = id || tempid('g')

    this.cells = new Map()

    this.userTop = new UserModel({nickname: 'bot Top'})
    this.userBottom = new UserModel({nickname: 'bot Bottom'})

    makeObservable(this, {
      status: observable,
      statusNext: action,
      statusName: computed
    })
  }

  // * * * Public

  statusNext(args) {
    switch (this.status) {
      case 'play':
        this.status = 'pause'
        break;
      case 'pause':
          this.status = 'play'
          break;
      case 'finish':
          this.status = null
          break;
      default:
        this.status = 'play'
      }
  }

  get statusName() {
    return this.status || 'Старт'
  }

  /**
   Общий блок игрового пространства.
   остальные методы рекомендательные
 @public
 @param {string} args - параметры постороения игрового пространства big|view
 */
 GameArea(args) {
  let game = this

  // if (args == 'big')

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