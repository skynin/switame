
import { useState, useEffect, useMemo } from 'react';
import { Link } from "react-router-dom";
// import { observer } from "mobx-react-lite";
import { useChatStore, useGameStore } from '../index'
import { GAMES_ROUTE } from '../utils/consts';

// const AboutPage = observer(() => {
const MainPage = () => {
  return (
    <div>
      <Link to={`${GAMES_ROUTE}/TicTacBoom`}>TicTacBoom</Link>
      <hr/>
      <Link to={`${GAMES_ROUTE}/TicTacMoob`}>TicTacMoob</Link>
      <hr/>
      <Link to={`${GAMES_ROUTE}/TicTacToe`}>TicTacToe</Link>
    </div>
  )
}

export default MainPage;