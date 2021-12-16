import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
// import { observer } from "mobx-react-lite";
import { useChatStore, useGameStore } from '../index'

const GamePage = () => {

  const {gameName} = useParams();

  const game = useMemo(() => {
    const gameStore = useGameStore()
    return gameStore.getById(gameName)
  },[gameName])

  if (!game) {
    console.error('gameName',gameName)
  }

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

export default GamePage;