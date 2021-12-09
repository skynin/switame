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

    let arrM = this.messages.get(gameId) || [];
    arrM.push({id: tempid('h'), message})

    if (arrM.length > 99) arrM = arrM.slice(-99)

    if (message == '_clear') arrM = []

    this.messages.set(gameId, arrM)
  }

  readMessages(gameId) {
    let arrM = this.messages.get(gameId || this.currentGameId) || []

    return arrM.slice(-33)
  }
}
