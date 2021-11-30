import { Avatar, Card, RadioButtonGroup, Image, CardHeader, CardBody, TextInput, Button} from 'grommet';
import { useState, useMemo } from 'react';
import GridResponsive from '../components/GridResponsive';
import { useUserStore } from '../index';
// import { observer } from "mobx-react-lite";

const NickNameChange = ({nickName, update}) => {
  return (
    <Card margin="xsmall">
    <CardHeader pad="small">Никнейм</CardHeader>
    <CardBody pad="small">
      <TextInput
      placeholder="ваш ник"
      value={nickName}
      onChange={({target: {value}}) => update(value)}
      />
    </CardBody>
    </Card>
  )
}

const avBorder = {
  color: 'accent-2',
  size: "medium",
  style: "dashed",
  side: "all"
}

const AvatarChange = ({currUser, currAvType, update}) => {

  const avatarVariants = useMemo(()=>currUser.avatarTypes,[currUser.id])

  return (
    <Card margin="xsmall">
    <CardHeader pad="small">Выбор аватара</CardHeader>
    <CardBody pad="small">
      <RadioButtonGroup
        direction="row"
        name="avatar"
        options={avatarVariants}
        value={currAvType}
        onChange={({ target: { value } }) => {console.log(value); update(value)}}
        children={(option, { checked, hover }) =>
        <Card key={option} border={checked ? avBorder : false}>
          <Avatar size="medium" margin="small" >
            <Image fit="cover" src={currUser.avatarUrl(option)}/>
          </Avatar>
        </Card>
      }
      />
    </CardBody>
    </Card>
  )
}

const UpdateSection = ({currUser}) => {

  let [currAvType, setAvType] = useState(currUser.avatarType)
  let [currNickname, setNickname] = useState(currUser.nickname)

  function update() {
    currUser.updateFrom({
      nickname: currNickname,
      avatarType: currAvType
    });
    currUser.save();
  }

  return (
    <div>
      <Card margin="xsmall">
      <CardHeader pad="xsmall">Ваш секретный ID входа</CardHeader>
      <CardBody pad="xsmall"><h3>{currUser.authId}</h3></CardBody>
      </Card>

      <NickNameChange nickName={currNickname} update={setNickname}/>

      <AvatarChange currUser={currUser} currAvType={currAvType} update={setAvType}/>

      <Button label="Сохранить" onClick={update} margin="medium"/>
    </div>
  )
}

const TotalSection = () => {
  return (
    <div>
      <p>Успехи</p>
    </div>
  )
}

const UserPage = () => {

  const userStore = useUserStore()
  const currUser = userStore.currUser;

  return (
    <GridResponsive gridType={'user'}>
      <UpdateSection currUser={currUser} gridArea="lSection"/>
      <TotalSection gridArea="rSection"/>
    </GridResponsive>
  )
}

export default UserPage;