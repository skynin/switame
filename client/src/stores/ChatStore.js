import { makeObservable, observable, runInAction, action, computed } from "mobx"
import { tempid } from "../utils/funcs"

export default class ChatStore {

  messages
  currentGameId = 0

  constructor() {
    this.messages = new Map()

    makeObservable(this, {
      messages: observable,
      currentGameId: observable,
      setCurrentGameId: action,
      pushMessage: action,
      showChat: computed
      // readMessages: computed
    })
  }

  get showChat() {
    let arrM = this.messages.get(this.currentGameId) || []

    return arrM.length != 0
  }

  setCurrentGameId(newValue) {
    this.currentGameId = newValue
  }

  pushMessage(message, gameId) {

    gameId = gameId || this.currentGameId;

    if (message == '_clear') {
      this.messages.set(gameId, [])
      return
    }

    let arrM = this.messages.get(gameId) || [];
    arrM.push({id: tempid('h'), message})

    if (arrM.length > 99) arrM = arrM.slice(-99)

    this.messages.set(gameId, arrM)
  }

  readMessages(gameId, order) {
    let arrM = this.messages.get(gameId || this.currentGameId) || []

    let result = arrM.slice(-33)
    if (order == 'reverse') result.reverse()

    return result
  }
}
