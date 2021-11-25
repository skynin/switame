import { nanoid } from '../utils/funcs';
import MD5 from '../utils/md5';
import { makeObservable, observable, runInAction } from "mobx"

function createAvatarId(id, authId) {
  return MD5(id + authId)
}

function initNewUser(obj) {
  obj.id = nanoid()
  obj.authId = nanoid()
  obj.avatarType = 'wavatar'
  obj.avatarId = createAvatarId(obj.id, obj.authId)
  obj.nickname = 'fooname123'

  obj.isAuth = false
}

export default class UserModel {
  constructor() {
    initNewUser(this)

    makeObservable(this, {
      id: observable,
      authId: observable,
      avatarType: observable,
      nickname: observable,
      isAuth: observable,
  })
  }

  updateFrom(obj) {
    runInAction(() => {
      this.nickname = obj.nickname;
      this.avatarType = obj.avatarType;
      })
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
      initNewUser(this)
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