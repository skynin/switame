
import { Box } from 'grommet';
import { Link } from "react-router-dom";
// import { observer } from "mobx-react-lite";
import { GAMES_ROUTE } from '../utils/consts';

// const MainPage = observer(() => {
const MainPage = () => {
  return (
    <div>
      <Box pad="medium">
        <h4>Варианты крестиков-ноликов</h4>
        <p>Боты учатся на своих поражениях, но все равно бывают невнимательными.
        Как люди &#128521;<br/>
        Одержите победу/ничью 9 раз подряд, увидите сами
        </p>
        <Box pad="medium">
        <ul style={{marginTop: 0}}>
          <li><Link className="wit-anchor" to={`${GAMES_ROUTE}/TicTacToe`}>Обычные</Link></li>
        </ul>
        <p>С открывающимися и бьющими клетками</p>
        <ul style={{marginTop: 0}}>
          <li><Link className="wit-anchor" to={`${GAMES_ROUTE}/TicTacBoom`}>только по вертикали/горизонтали</Link></li>
          <li><Link className="wit-anchor" to={`${GAMES_ROUTE}/TicTacMoob`}>только по диагоналям</Link></li>
        </ul>
        </Box>
      </Box>
    </div>
  )
}

export default MainPage;