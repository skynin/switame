import {useState, useEffect} from 'react';
import { Button, Menu, Header, Footer, Text, Anchor, Grid, Box, Sidebar, Avatar, Nav, Image } from 'grommet';

function LeftSide() {
  let avatarHash = 'f9879d71858b5ff21e4963273a886bfc' // wavatar, robohash, retro, monsterid, identicon

  return (
    <Box  background="light-2">
      <Avatar size="large" margin="small">
        <Image src={'https://www.gravatar.com/avatar/'+avatarHash+'?d=wavatar'}/>
      </Avatar>
      LeftSide
    </Box>
  )
}

export default LeftSide;