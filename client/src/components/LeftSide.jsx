import { useMemo } from 'react';
import { CardHeader, CardFooter, CardBody, Card } from 'grommet';
import { useGameStore, useUserStore } from '../index';
import { observer } from "mobx-react-lite"
import UserAvatar from './UserAvatar';
import { isMobile } from 'react-device-detect';

let LeftSide = () => {

  const userStore = useUserStore()
  const currUser = userStore.currUser

  const nowPlaying = () => {
    if (isMobile) return ''

    const gameStore = useGameStore()
    const game = gameStore.secondGame
    const GArea = useMemo(() => game.GameArea('view'), [game.id])

    return (
      <>
        <hr/>
        <Card>
          <CardHeader>Сейчас играют</CardHeader>
          <CardBody><GArea/></CardBody>
          <CardFooter></CardFooter>
        </Card>
      </>
    )
  }

  return (
    <div>
      <UserAvatar user={currUser} mode="left-side"/>
      { nowPlaying() }
    </div>
  )
}

LeftSide = observer(LeftSide)

export default LeftSide;