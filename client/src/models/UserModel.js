import { nanoid, randomInt } from '../utils/funcs';
import MD5 from '../utils/md5';
import { action, makeObservable, observable, runInAction } from "mobx"

function createAvatarId(id, authId) {
  return MD5(id + authId)
}

export default class UserModel {
  id
  authId

  avatarType
  avatarId

  nickname

  isAuth = false
  effect = ''

  total = 0

  constructor({nickname} = {nickname: 'foon'}) {
    this._initNewUser()

    this.nickname = nickname

    makeObservable(this, {
      id: observable,
      total: observable,
      effect: observable,
      avatarId: observable,
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

    let arrTypes = this.avatarTypes.slice(0, -1)
    this.avatarType = arrTypes[randomInt(0, arrTypes.length-1)]

    this.avatarId = createAvatarId(this.id, this.authId)
  }

  updateFrom(obj) {
    if (obj.nickname) this.nickname = obj.nickname;
    if (obj.avatarId) this.avatarId = obj.avatarId;
    if (obj.avatarType) {
      if (obj.avatarType == '_changeAvatarId') {
        this.avatarId = this.avatarGenerateId()
      }
      else {
        this.avatarType = obj.avatarType;
      }
    }
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

  avatarGenerateId() {
    return createAvatarId(this.id, nanoid())
  }

  avatarUrl(avType, avId) {
    avType = avType || this.avatarType
    avId = avId || this.avatarId

    if (avType == '_changeAvatarId') {
      return '/changeAvatar.jpg'
    }

    return 'https://www.gravatar.com/avatar/'+ avId + '?d=' + avType
  }

  get avatarTypes() {
    return ['wavatar', 'robohash', 'retro', 'monsterid', 'identicon','_changeAvatarId']
  }
}