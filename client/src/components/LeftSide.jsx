import { useContext } from 'react';
import { Avatar, Image, CardFooter, CardBody, Card } from 'grommet';
import { Link } from 'react-router-dom';
import { USER_ROUTE } from '../utils/consts';
import { Context } from '../index';
import { observer } from "mobx-react-lite"

let LeftSide = () => {

  const {userStore} = useContext(Context)

  return (
    <Card background="light-2" align='center' height="xsmall">
      <CardBody>
      <Link to={USER_ROUTE}>
      <Avatar size="large" margin="xxsmall">
        <Image src={userStore.currUser.avatarUrl()}/>
      </Avatar>
      </Link>
      </CardBody>
      <CardFooter>{userStore.currUser.nickname}</CardFooter>
    </Card>
  )
}

LeftSide = observer(LeftSide)

export default LeftSide;