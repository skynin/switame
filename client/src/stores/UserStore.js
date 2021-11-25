import UserModel from "../models/UserModel"

export default class UserStore {
  constructor() {
    this._currUser = new UserModel()
    this._currUser.load()
  }

  setUser(user) {
    this._currUser = user
  }

  get currUser() {
    return this._currUser
  }
}