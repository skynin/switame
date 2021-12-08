// import { useState, useEffect } from 'react';
// import { Box, Image, Text } from 'grommet';
// import { observer } from "mobx-react-lite";
// import { Context } from '..';

// const AboutPage = observer(() => {
const AboutPage = () => {

  return (
    <div>
      <img src="/logo-witgame.svg" align="right" width="240" height="240" style={{margin: 3, padding: 0}}/>
      <p style={{marginBottom: 0}}>Сайт будет содержать разнообразные игры:</p>
        <ul style={{marginTop: 0}}>
        <li>в которые не поиграть в интернете</li>
        <li>простые, для начинающих, детей</li>
        <li>и те что мне понравились</li>
        </ul>
      <p>Сложный ИИ не планируется, главная цель - дать возможность поиграть с другим человеком. Бот будет играть просто, для первых тренировок</p>
      <p>Поиск партнера для игры и согласование времени в онлайн - в разработке</p>
      <p>А в далеком будущем - организация турниров как по отдельной игре, так и многоборья</p>
      <hr/>
      <p>Большая коллекция игр где можно поиграть с ИИ: <a href="https://ludii.games/" target="_blank">Ludii Portal</a> </p>
      <p>Хороший YouTube канал коллекционера игр <a href="https://www.youtube.com/channel/UCI93THhcjKbv2d5GCXODViQ" target="_blank">Виталия Потопахина</a></p>
      <hr/>
      <p><a href="https://github.com/skynin/switame" target="_blank">GitHub</a></p>
    </div>
  )
}

export default AboutPage;