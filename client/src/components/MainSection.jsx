import {useState, useEffect} from 'react';
import { Button, Menu, Header, Footer, Text, Anchor, Grid, Box, Sidebar, Avatar, Nav } from 'grommet';
import AppRouter from './AppRouter';


function MainSection() {
  return (
    <Box background="light-2">
      <AppRouter/>
    </Box>
  )
}

export default MainSection;