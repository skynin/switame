import { Box, Button, InfiniteScroll, Text, TextArea, TextInput } from 'grommet';
import { useChatStore } from '..';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';

const ListMessages = observer( ({list}) => {

  let lastRef = useRef()

  useEffect(() => {
      lastRef?.current?.scrollIntoView()
  })

  function divOne(item) {
    return (
      <Box key={item.id}
        flex={false}
        pad="xxsmall"
      >
        <div ref={lastRef}>{item.message}</div>
      </Box>
      )
  }

  return (
    <Box height="medium" overflow="auto">
      <InfiniteScroll items={list} replace={true}>
        {divOne}
      </InfiniteScroll>
    </Box>
)})

const InputMessage = () => {
  const [inp, setInp] = useState("")
  const chat = useChatStore()

  function sendMessage() {
    if (inp == "")  return;

    chat.pushMessage(inp)
    setInp("")
  }

  return (
  <Box direction="row">
    <TextInput placeholder="введите сообщение"
      value={inp}
      onChange={({target: {value}}) => setInp(value)} />
      &nbsp;
      <Button label=">" onClick={sendMessage}/>
  </Box>
  )
}

const ChatSection = observer( ({chat}) => {
  return (
    <Box background="light-2">
      <ListMessages list={chat.readMessages()}/>
      &nbsp;
      <InputMessage/>
    </Box>
)})

export default ChatSection