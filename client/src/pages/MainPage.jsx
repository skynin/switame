import { useState, useEffect, useContext, useMemo } from 'react';
// import { observer } from "mobx-react-lite";
import { useGameStore } from '../index'

// const AboutPage = observer(() => {
const MainPage = () => {

  const gameStore = useGameStore()
  const game = gameStore.currGame
  const GArea = useMemo(() => game.GameArea('big'), [game.id])

  return (
    <div>
      <GArea />
    </div>
  )
}

export default MainPage;