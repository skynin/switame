import { useMemo } from 'react';
import { Avatar, Image, CardFooter, CardBody, Card } from 'grommet';
import { Link } from 'react-router-dom';
import { USER_ROUTE } from '../utils/consts';
import { useGameStore, useUserStore } from '../index';
import { observer } from "mobx-react-lite"

let LeftSide = () => {

  const userStore = useUserStore()
  const gameStore = useGameStore()

  const game = gameStore.secondGame
  const currUser = userStore.currUser

  const GArea = useMemo(() => game.GameArea('view'), [game.id])

  return (
    <div>
    <Card background="light-2" align='center' height="xsmall">
      <CardBody>
      <Link to={USER_ROUTE}>
      <Avatar size="large" margin="xxsmall">
        <Image src={currUser.avatarUrl()}/>
      </Avatar>
      </Link>
      </CardBody>
      <CardFooter>{currUser.nickname}</CardFooter>
    </Card>
    <hr/>
    <Card>
      <GArea/>
    </Card>
    </div>
  )
}

LeftSide = observer(LeftSide)

export default LeftSide;