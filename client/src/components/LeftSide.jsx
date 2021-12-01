import { useMemo } from 'react';
import { Avatar, Image, CardFooter, CardBody, Card } from 'grommet';
import { Link } from 'react-router-dom';
import { USER_ROUTE } from '../utils/consts';
import { useGameStore, useUserStore } from '../index';
import { observer } from "mobx-react-lite"
import UserAvatar from './UserAvatar';

let LeftSide = () => {

  const userStore = useUserStore()
  const gameStore = useGameStore()

  const game = gameStore.secondGame
  const currUser = userStore.currUser

  const GArea = useMemo(() => game.GameArea('view'), [game.id])

  return (
    <div>
      <UserAvatar user={currUser} mode="left-side"/>
    <hr/>
    <Card>
      <GArea/>
    </Card>
    </div>
  )
}

LeftSide = observer(LeftSide)

export default LeftSide;