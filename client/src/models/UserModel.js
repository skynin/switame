import { nanoid } from '../utils/funcs';
import MD5 from '../utils/md5';
import { action, makeObservable, observable, runInAction } from "mobx"

function createAvatarId(id, authId) {
  return MD5(id + authId)
}

export default class UserModel {
  constructor(args) {
    this._initNewUser()

    if (args) {
      const {nickname} = args
      if (nickname) this.nickname = nickname
    }

    makeObservable(this, {
      id: observable,
      authId: observable,
      avatarType: observable,
      nickname: observable,
      isAuth: observable,
      updateFrom: action
  })
  }

  _initNewUser() {
    this.id = nanoid()
    this.authId = nanoid()
    this.avatarType = 'wavatar'
    this.avatarId = createAvatarId(this.id, this.authId)
    this.nickname = 'fooname123'

    this.isAuth = false
  }

  updateFrom(obj) {
    this.nickname = obj.nickname;
    this.avatarType = obj.avatarType;
  }

  save() {
    localStorage.setItem('currUser',
    JSON.stringify({
      id: this.id,
      authId: this.authId,
      avatarType: this.avatarType,
      avatarId: this.avatarId,
      nickname: this.nickname
    }));
  }

  load() {
    let rUser = localStorage.getItem('currUser')
    if (rUser) {
      rUser = JSON.parse(rUser)
      runInAction(() => {
        this.isAuth = true
        this.id = rUser.id
        this.authId = rUser.authId
        this.avatarType = rUser.avatarType
        this.nickname = rUser.nickname
        this.avatarId = rUser.avatarId
      })
    }
  }

  logout() {
    let rUser = localStorage.getItem('currUser')
    if (rUser) {
      localStorage.setItem('savedUser', rUser)
    }

    localStorage.removeItem('currUser')
    runInAction(() => {
      this._initNewUser()
    })
  }

  login(authId) {
    let rUser = localStorage.getItem('savedUser')
    if (!rUser) {return false;}

    let objUser = JSON.parse(rUser)
    if (objUser.authId !== authId) {return false;}

    localStorage.setItem('currUser', rUser)
    this.load()

    return true
  }

  avatarUrl(avType) {
    avType = avType || this.avatarType
    return 'https://www.gravatar.com/avatar/'+this.avatarId + '?d=' + avType
  }

  get avatarTypes() {
    return ['wavatar', 'robohash', 'retro', 'monsterid', 'identicon']
  }
}