import { useState, useEffect, useMemo } from 'react';
// import { observer } from "mobx-react-lite";
import { useChatStore, useGameStore } from '../index'

// const AboutPage = observer(() => {
const MainPage = () => {

  const gameStore = useGameStore()
  const game = gameStore.currGame
  const GArea = useMemo(() => game.GameArea('big'), [game.id])

  const chatStore = useChatStore()

  useEffect(() => {
    chatStore.setCurrentGameId(game.id)
    return () => chatStore.setCurrentGameId(0)
  },[game.id])

  return (
    <div>
      <GArea />
    </div>
  )
}

export default MainPage;