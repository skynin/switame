import { tempid } from '../utils/funcs'
import { Box } from "grommet"
import GameCell from './GameCell'
import UserModel from './UserModel'
import { observer } from "mobx-react-lite"
import { makeObservable, observable, runInAction, action, computed } from "mobx"
import switAPI from '../API'

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

  wait = false

  constructor(id) {
    this.id = id || tempid('g')

    this.cells = Object.create(null)

    this.userTop = new UserModel({nickname: 'bot Top'})
    this.userBottom = new UserModel({nickname: 'bot Bottom'})

    switAPI().subscribe('game', this.id, impact => this.receive(impact))

    makeObservable(this, {
      status: observable,
      wait: observable,
      statusName: computed
    })
  }

  // * * * Public

  /**
   *
   * @param {Array|Object} impact массив или объект для изменения состояния игры, клеток
   * @returns {void}
   */
   receive(impact) {
    if (Array.isArray(impact)) {
      for(let eachImpact of impact) this.receive(eachImpact)
      return
    }

    if (impact.error) {
      console.error(impact.error)
      return
    }

    if (impact?.act == 'click') {
      this.sendClick(impact)
      return;
    }

    runInAction(() => {
      if (impact.wait || impact.wait === false) {
        this.wait = impact.wait
      }
    })

    if (impact?.receiver?.kind == 'board') {
      this.receiveBoard(impact)
      return;
    }

    if (impact?.receiver?.kind == 'game') {
      this.receiveGame(impact)
      return;
    }

    console.error('Unhandled',impact)
  }

  sendClick(impact) {
    if (impact.sender.kind == 'cell') {

      if (this.wait) {
        let cellId = impact.sender.id
        this.cells[cellId].receive({id: cellId, info: 'Ждем ответа...'})
        return
      }

      runInAction(()=>{
        this.wait = tempid('sg') // для идентификации ответа
      })

      // отправить на сервер
      switAPI().dispatch({
        sender: this.DTO,
        stamp: this.wait, // для идентификации ответа
        impact
      })
    }

    if (impact.sender.kind == 'button') {
      // TODO отправить на сервер
    }
  }

  receiveGame(impact) {
    runInAction(() => {
      if (impact.status) this.status = impact.status
    })

    if (impact.cells) this.receiveBoard(impact)
  }

  receiveBoard(impact) {
    try {

      console.log('receiveBoard',impact)

      if (impact.cells) {
      // изменение клеток доски
      // пройтись по всем клеткам и изменить
      for (let eachCell of impact.cells) {
          let cell = this.cells[eachCell.id]

          cell.receive(eachCell)
        }
      }
    } catch (e) {
      console.error('recieveBoard',impact,e)
    }
  }

  get DTO() {
    let cells = Object.values(this.cells).map(eachCell => eachCell.DTO)

    return {
      id: this.id,
      kind: 'game',
      status: this.status,
      wait: this.wait,
      cells
    }
  }

  statusNext(args) {

    let newStatus = this.status

    switch (this.status) {
      case 'play':
        newStatus = 'pause'
        break;
      case 'pause':
        newStatus = 'play'
        break;
      case 'finish':
        newStatus = null
        break;
      default:
        newStatus = 'play'
      }

    switAPI().dispatch({
      sender: this.DTO,
      act: newStatus
    })
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
      this.cells[tCell.id] = tCell
    }

    return this
  }

  emptyBoard() {
    return 'emptyBoard ' + this.id
  }

  // *** React function components

  /** @protected */
  GameBoardHead(args) {
    if (args != 'big') return () => {return (<div>Foo vs Bar</div>)}

    return () => {
      return (
        <Box>Tool Bar GArea</Box>
      )
    }
  }

  /** @protected */
  GameCell() {
    return observer( ({cell}) => {
      return (
        <Box>
          {cell.id} : {cell.chip} - {cell.brim}
        </Box>
      )
    })
  }

  /** @protected */
  GameBoard(args) {
    let game = this

    const GCell = game.GameCell()

    return () => {
      return (
        <Box>
          {Object.entries(game.cells).map(([cellID, cell]) =>
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