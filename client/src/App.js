import {useState, useEffect, useContext} from 'react';
import {useNavigate, Link} from 'react-router-dom'
import './App.css';

import { Grommet, Button, Menu, Header, Footer, Text, Anchor, Grid, Box, Sidebar, Avatar, Nav, Image } from 'grommet';
import { Home as IcoHome, Help as IcoHelp, Projects as IcoProjects, Clock as IcoClock } from 'grommet-icons'
import { grommet, dark } from 'grommet/themes';

import LeftSide from './components/LeftSide';
import RightSide from './components/RigtSide';
import MainSection from './components/MainSection';
import GridResponsive from './components/GridResponsive';
import { ABOUT_ROUTE } from './utils/consts';
// import { hpe } from 'grommet-theme-hpe';
// import { aruba } from 'grommet-theme-aruba';
// import { hp } from 'grommet-theme-hp';
// import { dxc } from 'grommet-theme-dxc';

const THEMES = {
  grommet,
  dark,
  // hpe,
  // aruba,
  // hp,
  // dxc,
};

function App() {

  const [themeName, setThemeName] = useState('grommet');

  const navigate = useNavigate()

  return (
    <Grommet theme={THEMES[themeName || 'grommet']}>
      <Header background="brand">
        <Button icon={<IcoHome />} hoverIndicator onClick={()=>navigate('/')}/>
        <Menu label="account" items={[{ label: 'logout' }]} />
      </Header>

      <GridResponsive gridType={'app'}>
        <LeftSide gridArea="lSection"/>
        <MainSection gridArea="mSection"/>
        <RightSide gridArea="rSection"/>
      </GridResponsive>

      <Footer background="brand" pad="medium">
        <Box direction="row" gap="xsmall">
          <Box height="32px" width="32px" border="all">
            <Image fit="cover" src="/logo192.png"/>
          </Box>
          <Text>Skynin Wit Games</Text>
        </Box>
        <Button label="About" onClick={()=>navigate(ABOUT_ROUTE)}/>
      </Footer>
  </Grommet>
  );
}

export default App;
/*
    <div className="App">
      <header>
        Header
      </header>
    </div>
*/