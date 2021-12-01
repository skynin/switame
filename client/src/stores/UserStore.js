import UserModel from "../models/UserModel"

export default class UserStore {

  gameBot

  constructor() {
    this._currUser = new UserModel()
    this._currUser.load()

    this.gameBot = new UserModel({nickname: 'gameBot'})
  }

  setUser(user) {
    this._currUser = user
  }

  get currUser() {
    return this._currUser
  }
}