import {useState, useContext} from 'react';
import { Button, Menu, Header, Layer, FormField, TextInput, Box, Notification } from 'grommet';
import { USER_ROUTE } from '../utils/consts';
import { Home as IcoHome } from 'grommet-icons'
import {useNavigate} from 'react-router-dom'
import { Context } from '../index'

function HeaderMenu() {

  const {userStore} = useContext(Context)

  const [showModal, setShowModal] = useState(false)

  const navigate = useNavigate()

  const leftMenu = [
    { label: 'profile', onClick: () => navigate(USER_ROUTE) }
  ]

  if (userStore.currUser.isAuth) {
    leftMenu.push({ label: 'logout', onClick: () => {userStore.currUser.logout(); navigate('/')} })
  }
  else {
    leftMenu.push({ label: 'login', onClick: () => setShowModal(true)})
  }

  return (
      <Header background="brand">
        <Button icon={<IcoHome />} hoverIndicator onClick={()=>navigate('/')}/>
        <Menu label="account" items={leftMenu} />
        {showModal && <AuthModal currUser={userStore.currUser} setShow={setShowModal}/>}
      </Header>
  )
}

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