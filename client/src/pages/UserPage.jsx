import { Avatar, Card, RadioButtonGroup, Image, CardHeader, CardBody, TextInput, Button} from 'grommet';
import { useState, useContext } from 'react';
import GridResponsive from '../components/GridResponsive';
import { Context } from '../index';
// import { observer } from "mobx-react-lite";

const UpdateSection = () => {

  const {userStore} = useContext(Context)
  const currUser = userStore.currUser;

  let avatarVariants = currUser.avatarTypes

  let [currAvType, setAvType] = useState(currUser.avatarType)
  let [currNickname, setNickname] = useState(currUser.nickname)

  const avBorder = {
    color: 'accent-2',
    size: "medium",
    style: "dashed",
    side: "all"
  }

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

      <Card margin="xsmall">
      <CardHeader pad="small">Никнейм</CardHeader>
      <CardBody pad="small">
        <TextInput
        placeholder="ваш ник"
        value={currNickname}
        onChange={({target: {value}}) => setNickname(value)}
        />
      </CardBody>
      </Card>

      <Card margin="xsmall">
      <CardHeader pad="small">Выбор аватара</CardHeader>
      <CardBody pad="small">
        <RadioButtonGroup
          direction="row"
          name="avatar"
          options={avatarVariants}
          value={currAvType}
          onChange={({ target: { value } }) => {console.log(value); setAvType(value)}}
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
      <Button label="Сохранить" onClick={update} margin="medium"/>
    </div>
  )
}

const TotalSection = () => {
  return (
    <div>
      <p>Достижения</p>
    </div>
  )
}

const UserPage = () => {
  return (
    <GridResponsive gridType={'user'}>
      <UpdateSection gridArea="lSection"/>
      <TotalSection gridArea="rSection"/>
    </GridResponsive>
  )
}

export default UserPage;