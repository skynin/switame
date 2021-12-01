import { Avatar, Image, CardFooter, CardBody, Card } from 'grommet';
import { USER_ROUTE } from '../utils/consts';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

const modes = {
  'left-side': {
    height: "xsmall",
    size: "large",
    direction: "column"
  },
  'game-board': {
    height: "xsmall",
    size: "xxsmall",
    direction: "row"
  }
}

const UserAvatar = observer( ({user, mode}) => {

  const currMode = modes[mode]

  return (
    <Card direction={currMode.direction} background="light-2" align='center' height={currMode.height}>
      <CardBody>
      <Link to={USER_ROUTE}>
      <Avatar size={currMode.size} margin="xxsmall">
        <Image src={user.avatarUrl()}/>
      </Avatar>
      </Link>
      </CardBody>
      <CardFooter>{user.nickname}</CardFooter>
    </Card>
  )
})

export default UserAvatar