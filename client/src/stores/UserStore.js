import UserModel from "../models/UserModel"

export default class UserStore {

  gameBot
  allUsers

  constructor() {
    this._currUser = new UserModel()
    this._currUser.load()

    this.gameBot = new UserModel({nickname: 'gameBot'})

    this.allUsers = new Set()
  }

  addUser(user) {
    this.allUsers.add(user)
  }

  setUser(user) {
    this._currUser = user
  }

  get currUser() {
    return this._currUser
  }

  get topGamers() {
    return Array.from(this.allUsers).filter(a => a.total > 0).sort((a, b) => a.total > b.total)
  }
}