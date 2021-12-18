import { useMemo, useState } from 'react';
import { Button, Menu, Header, Layer, FormField, TextInput, Box, Notification } from 'grommet';
import { GAMES_ROUTE, USER_ROUTE } from '../utils/consts';
import { Home as IcoHome } from 'grommet-icons'
import { useNavigate } from 'react-router-dom'
import { useGameStore, useUserStore } from '../index'
import { observer } from 'mobx-react-lite';

const HeaderMenu = observer (() => {

  const userStore = useUserStore()
  const currUser = userStore.currUser

  const [showModal, setShowModal] = useState(false)

  const navigate = useNavigate()

  const activedGames = useGameStore().activedGames.map(gm => {
    return { label: gm.displayName, onClick: () => {navigate(GAMES_ROUTE + '/' + gm.displayName)} }
  })

  const leftMenu = useMemo(() => {
    const leftMenu = [
      { label: 'profile', onClick: () => navigate(USER_ROUTE) }
    ]

    if (currUser.isAuth) {
      leftMenu.push({ label: 'logout', onClick: () => {currUser.logout(); navigate('/')} })
    }
    else {
      leftMenu.push({ label: 'login', onClick: () => setShowModal(true)})
    }

    return leftMenu
  },[currUser.id, currUser.isAuth])

  return (
      <Header background="brand">
        <Button icon={<IcoHome />} hoverIndicator onClick={()=>navigate('/')}/>
        {activedGames.length != 0 && <Menu label="Активные игры" items={activedGames} /> }
        <Menu label="account" items={leftMenu} />
        {showModal && <AuthModal currUser={currUser} setShow={setShowModal}/>}
      </Header>
  )
})

function AuthModal({setShow, currUser}) {

  const [secID, setSecID] = useState()
  const [showNote, setShowNote] = useState()

  function loginClick() {

    if (currUser.login(secID)) {
      setShow(false)
    }
    else {
      setShowNote(true)
    }
  }

  return (
    <>
    {showNote &&
    <Notification
        toast
        status="critical"
        title="Ошибка"
        message="Неверный секретный ID"
        onClose={() => setShowNote(false)}/>
    }
    <Layer
      onEsc={() => setShow(false)}
      onClickOutside={() => setShow(false)}
    >
      <Box pad="medium">
      <FormField label="Введите секретный ID">
        <TextInput placeholder="секретный ID" onChange={({target: {value}}) => setSecID(value)}/>
      </FormField>
      <Button label="Войти" onClick={() => loginClick()} />
      </Box>
    </Layer>
    </>
  )
}

export default HeaderMenu;