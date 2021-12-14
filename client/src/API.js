import AiTicTacBoom from "./AI/AiTicTacBoom"
import AiTicTacToe from "./AI/AiTicTacToe"
import { nanoid } from "./utils/funcs"

class API {

  debugAI
  _varietyes

  constructor() {
    this.subs = Object.create(null)

    this._varietyes = Object.create(null)
    this._varietyes['tic-tac-toe'] = new AiTicTacToe()
    this._varietyes['tic-tac-boom'] = new AiTicTacBoom()

    this.debugAI = this._varietyes['tic-tac-boom']
  }

  dispatch(inAct) {

    if (!inAct.stamp) inAct.stamp = nanoid()

    setTimeout((impact) => { // может быть дооооооооолгим

      for (let kindOf of ['game'])
        if (impact?.sender.kind == kindOf) {
          let funcSub = this.subs[kindOf][impact?.sender?.id]

          if (funcSub) {
            console.log('dispatch', impact)

            let debugAI = impact.sender.variety ? this._varietyes[impact.sender.variety] : this.debugAI

            debugAI.thinkIt(impact, response => {
              console.log('funcSub',response)
              if (Array.isArray(response))
                response = response.map(r => {r.stamp = impact.stamp; return r})
              else response.stamp = impact.stamp
              funcSub(response)
            })}
          else
            console.error('API.dispatch unknown funcSub', impact)

        return
      }

    console.error('API.dispatch unhandled', impact)
    }, 5, inAct)
  }

  subscribe(type, id, funcDispatch) {

    if (!this.subs[type]) this.subs[type] = Object.create(null)

    this.subs[type][id] = funcDispatch
  }

  unsubscribe(type, id) {
    // TODO: unsubscribe
  }
}

const singleApi = new API()
export default function switAPI() { return singleApi }