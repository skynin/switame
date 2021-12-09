import { tempid } from '../utils/funcs'
import { Box, Button } from "grommet"
import GameCell from './GameCell'
import UserModel from './UserModel'
import { observer } from "mobx-react-lite"
import { makeObservable, observable, runInAction, action, computed } from "mobx"
import switAPI from '../API'
import ButtonModel from './ButtonModel'
import UserAvatar from "../components/UserAvatar"
import StatusModel from './StatusModel'
import { isString } from '../utils/funcs'
import { useChatStore, useUserStore } from '..'

/*
Инфраструктурный класс игры

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

  status = 'ready' // ready, play, pause, finish
  allStatuses

  userTop = null
  userBottom = null

  wait = false
  info = null

  activeButtons

  allButtons
  toolBars

  constructor(id) {
    this.id = id || tempid('g')

    this.cells = Object.create(null)

    setTimeout(() => { // временно, пока нет сервера для согласования игроков
      runInAction(() => {
        this.userBottom = new UserModel({nickname: 'Wit Bot'})
        this.userBottom.isBot = true

        let userStore = useUserStore()
        this.userTop = userStore.currUser

        userStore.addUser(this.userTop)
        userStore.addUser(this.userBottom)

        this.setStatus('ready')
        })
    }, 100)

    this.allStatuses = Object.create(null)
    this.allButtons = Object.create(null)

    this.activeButton = Object.create(null)

    this._initButtons()
    this._initStatuses()

    switAPI().subscribe('game', this.id, impact => this.receive(impact))

    makeObservable(this, {
      userTop: observable,
      userBottom: observable,
      status: observable,
      info: observable,
      infoLine: computed,
      setStatus: action,
      showWinner: action,
      wait: observable,
      activeButtons: observable
    })
  }

  _initButtons() {

    const game = this

    function statusNext(args) { // только отослыем запрос на изменение статуса

      let newStatus = args || game.status.nextStatus

      game.wait = true
      game.info = 'Ожидание подтверждения'

      switAPI().dispatch({
        sender: game.DTO,
        act: 'status-new',
        actData: newStatus
      })
    }

    this.allButtons['play'] = new ButtonModel('play', 'Старт', args => {
      statusNext('play')
    })
    this.allButtons['finish'] = new ButtonModel('finish', 'Завершить', args => {
      statusNext('finish')
    })
    this.allButtons['ready'] = new ButtonModel('ready', 'Очистить', args => {
      statusNext('ready')
    })

    game.toolBars = {
      play: [game.allButtons['finish']],
      finish: [game.allButtons['ready']],
      ready: [game.allButtons['play']],
    }

    game.activeButtons = game.toolBars['ready']
  }

  _initStatuses() {
    const game = this

    game.allStatuses['ready'] = new StatusModel('ready', 'play', 'Готова', 'Игра в ожидании начала', {act: 'clear'})
    game.allStatuses['play'] = new StatusModel('play', 'finish', 'Идет', 'Идет игра', {act: 'play'})
    game.allStatuses['finish'] = new StatusModel('finish', 'ready', 'Завершена', 'Игра завершена', {act: 'finish'})

    game.status = game.allStatuses['ready']
  }

  _sendToAllCells(impact) {
    this.arrCells.forEach(eachCell => {
      eachCell.receive({...impact, id: eachCell.id})
    })
  }

  setStatus(status, info) {
    if (!status) throw 'Unknown setStatus'

    if (isString(status)) status = this.allStatuses[status]

    this.status = status;
    this.activeButtons = this.toolBars[status.id]

    this._sendToAllCells(status.impactData)

    this.wait = status.id != 'play'
    switch(status.id) {
      case 'ready': this.info = null;
        [this.userTop, this.userBottom] = [this.userBottom, this.userTop]
        this.userTop.effect = 'X' // топ ходит первым, крестиками
        this.userBottom.effect = 'O'

        useChatStore().pushMessage('_clear', this.id)
      break;
      case 'finish':
        this.info = 'Игра завершена';
        this.showWinner(info)
      break;
      case 'play':
        if (this.userTop.isBot) { // передаем право первого хода
          switAPI().dispatch({
            sender: this.DTO,
            act: 'step'
          })
        }
        else {
          this.info = 'Ваш ход'
        }
      break;
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

  // * * * Public
  get arrCells() {
    return Object.values(this.cells)
  }

  /**
   *
   * @param {Array|Object} impact массив или объект для изменения состояния игры, клеток
   * @returns {void}
   */
   receive(impact) {
    if (Array.isArray(impact)) { // распаковываем массив
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

    if (impact.wait || impact.wait === false) // пришло изменение ожидания игры
      runInAction(() => {
        this.wait = impact.wait
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
        this.info = 'Ждем ответа...'
      })

      // отправить на сервер
      switAPI().dispatch({
        sender: this.DTO,
        stamp: this.wait, // для идентификации ответа
        impact
      })
    }

    if (impact.sender.kind == 'button') {
      // TODO отправить на сервер желаемое пользователем действие
    }
  }

  showWinner(info) {
    if (!info) return

    this.info = info
    if (info.winner == this.userBottom.effect) {
      this.userBottom.effect = 'WIN'
      this.userTop.effect = null

      ++this.userBottom.total;
    }
    else if (info.winner == this.userTop.effect) {
      this.userBottom.effect = null
      this.userTop.effect = 'WIN'

      ++this.userTop.total;
    }
    else {
      this.userBottom.effect = null
      this.userTop.effect = null
    }

    setTimeout(() => useChatStore().pushMessage('' + info, this.id))
  }

  receiveGame(impact) {
    console.log('receiveGame',impact)

    if (impact.act == 'status-new') this.setStatus(impact.actData || impact.status || impact.act, impact.info)

    if (impact.cells) this.receiveBoard(impact)
  }

  receiveBoard(impact) {
    try {
      console.log('receiveBoard',impact)

      if (impact.cells) {

      runInAction(()=>{
        this.info = impact.info || 'Ваш ход'
      })

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
      status: this.status.id,
      wait: this.wait,
      cells
    }
  }

  get infoLine() {
    return (this.info ? "" + this.info : this.info) || this.status.statusLine
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
        <GameBoardHead game={game}/>
        <GBoard game={game}/>
        <GameBoardFooter game={game}/>
      </Box>
    )
  }
}

emptyBoard() {
  return 'emptyBoard ' + this.id
}

// *** React function components

/** @protected */
GameBoardHead(args) {
  if (args != 'big') return () => {return (<div>Foo vs Bar</div>)}

  return observer( ({game}) => {

    const buttons = game.activeButtons || []

    return (
      <Box>
      <Box direction="row">
        <UserPlay user={game.userTop}/>&nbsp;
        <UserPlay user={game.userBottom}/>
      </Box>
      <Box direction="row">
        {buttons.map( bt =>
          <Button key={bt.id} margin={bt.margin} hoverIndicator={bt.hoverIndicator} pad="xsmall" onClick={e => bt.actClick()} label={bt.label}/>
        )}
      </Box>
      </Box>
    )
  })
  }

  /** @protected */
  GameCell() {
    return observer( ({cell}) => {
      return (
        <Box border={cell.effect && cell.effect.indexOf('last') >= 0 ? 'all' : false}>
          {cell.id} : {cell.chip} - {cell.brim}
        </Box>
      )
    })
  }

  /** @protected */
  GameBoard(args) {

    const GCell = this.GameCell()

    return ({game}) => {

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
    // let game = this

    if (args != 'big') return observer(({game}) => {return (<div>&#10148; {game.status.id || game.status}</div>)})

    return observer(({game}) => {
      return (
        <Box>{game.infoLine}</Box>
      )
    })
  }
}

var UserPlay = observer( ({user}) => {

  if (!user) return (<div>user is unknown</div>)

  return (
    <div>
      <UserAvatar user={user} mode="game-board"/>
    </div>
  )
})
