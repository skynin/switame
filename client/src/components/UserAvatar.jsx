import { Avatar, Image, CardFooter, CardBody, Card } from 'grommet';
import { USER_ROUTE } from '../utils/consts';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

const modes = {
  'left-side': {
    height: "7rem",
    size: "large",
    direction: "column"
  },
  'game-board': {
    height: "5rem",
    size: "xxsmall",
    direction: "row"
  }
}

const UserAvatar = observer( ({user, mode}) => {

  const currMode = modes[mode]

  const winnerColor = mode == 'game-board' && user.effect == 'WIN' ? 'accent-1' : 'light-2'

  return (
    <Card background={winnerColor} direction={currMode.direction} align='center' margin="xxsmall" height={currMode.height}>
      <CardBody>
      <Link to={USER_ROUTE}>
      <Avatar size={currMode.size} margin="xxsmall">
        <Image height="100%" src={user.avatarUrl()}/>
      </Avatar>
      </Link>
      </CardBody>
      <CardFooter margin="xsmall" pad="xsmall">{user.nickname}</CardFooter>
    </Card>
  )
})

export default UserAvatar